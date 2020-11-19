import React, { Component } from 'react'
import { get } from 'lodash'
import swal from 'sweetalert2'
import styled from 'styled-components'
import { getConfigApi } from 'config'
import { Divider, Form, Input } from 'antd'
import { Link, withRouter } from 'react-router-dom'

import slug from 'constants/slug'
import Errors from 'constants/errors'

import createLang, { translate } from 'hoc/create-lang'

import Heading from 'components/elements/heading'
import Button from 'components/elements/button'

import { connectAutoDispatch } from 'redux/connect'
import { userLogin, userLogin2Factor } from 'redux/actions/authAction'

const FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
  CODE: 'code',
}

const FormHeader = styled.div`
  width: 100%%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`

const FormLogin = styled.div`
  display: ${props => (props.hidden ? 'none' : 'block')};
  input {
    margin-bottom: 12px;
  }
`

const FormVerify = styled.div`
  display: ${props => (props.hidden ? 'none' : 'block')};
`

@createLang
@withRouter
@Form.create()
@connectAutoDispatch(state => ({ userInfo: state.auth.userInfo }), {
  userLogin,
  userLogin2Factor,
})
export default class EmailForm extends Component {
  state = { isTwoFactorAuth: false, isLoading: false }

  loginWithPhone = () => {
    const { history } = this.props
    history.push(slug.login.loginWithPhoneNumber)
  }

  getEmailSms = () => {
    const { userInfo, form } = this.props
    if (get(userInfo, 'twoFactorAuth.type') === 'sms') {
      return get(userInfo, 'phone.phoneNumber')
    }
    return form.getFieldValue(FIELDS.EMAIL)
  }

  handleUserLoginTwoFactor = async values => {
    const { userLogin2Factor } = this.props
    const user = await userLogin2Factor(values)
    if (user.error) {
      this.userError(user)
      return
    }
    this.userSuccess(user)
  }

  handleLogin = async values => {
    const { userLogin, history } = this.props
    const user = await userLogin(values)

    if (user.error) {
      if (user.message === Errors.ORGANIZATION_EXPIRED) {
        history.push(`${slug.user.expLicense}?expDate=${user['0'].expDate}`)
      } else {
        this.userError(user)
      }
      return
    }
    if (user.data.twoFactorAuth && user.data.twoFactorAuth.enable) {
      this.setState({ isTwoFactorAuth: true })
    } else {
      this.userSuccess(user)
    }
  }

  userError(user) {
    let title = user.message
    if (user.message === Errors.USER_PASSWORD_INCORRECT) {
      title = translate('login.errors.emailOrPasswordIncorrect')
    } else if (user.message === Errors.ACCOUNT_DISABLE) {
      title = translate('login.errors.accountDisable')
    } else if (user.m === Errors.ACCOUNT_NOT_ACTIVATED) {
      title = translate('login.errors.accountNotActivated')
    } else if (user.message === Errors.CODE_NOT_EQUAL) {
      title = translate('login.errors.codeNotEqual')
    } else if (user.message === Errors.ORGANIZATION_NOT_EXIST) {
      title = translate('login.errors.organizationNotExist')
    }

    if (user.message === Errors.ACCOUNT_DELETE) {
      title = translate('login.errors.accountDelete')
    }

    swal({
      title: title,
      type: 'error',
    })
  }

  userSuccess(user) {
    swal({
      type: 'success',
      text: 'Welcome ' + user.data.email,
    })

    const defaultPage = getConfigApi().defaultPage
    window.location = defaultPage
  }

  onSubmit = async e => {
    e.preventDefault()
    const { form } = this.props
    const { isTwoFactorAuth } = this.state
    const values = form.getFieldsValue()
    this.setState({ isLoading: true })

    if (isTwoFactorAuth) {
      await this.handleUserLoginTwoFactor(values)
    } else {
      await this.handleLogin(values)
    }
    this.setState({ isLoading: false })
  }

  render() {
    const {
      form,
      lang: { t },
    } = this.props

    const { isTwoFactorAuth, isLoading } = this.state

    return (
      <Form onSubmit={this.onSubmit}>
        <FormHeader>
          <Heading fontSize={16}>{t('login.title')}</Heading>
          <Heading fontSize={16}>
            <Link to={slug.password.emailConfirm}>
              {translate('resetPassword.key')}
            </Link>
          </Heading>
        </FormHeader>
        <FormLogin hidden={isTwoFactorAuth}>
          {form.getFieldDecorator(FIELDS.EMAIL)(
            <Input
              autoFocus
              size="large"
              placeholder={t('login.form.email.placeholder')}
            />
          )}
          {form.getFieldDecorator(FIELDS.PASSWORD)(
            <Input.Password
              type="password"
              size="large"
              placeholder={t('login.form.password.placeholder')}
            />
          )}
        </FormLogin>
        <FormVerify hidden={!isTwoFactorAuth}>
          <p>
            {t('login.twoFactorAlert', {
              email: this.getEmailSms(),
            })}
          </p>
          <Form.Item colon={false} label={t('login.form.twoFactor.label')}>
            {form.getFieldDecorator(FIELDS.CODE)(
              <Input
                size="large"
                placeholder={t('login.form.twoFactor.placeholder')}
              />
            )}
          </Form.Item>
        </FormVerify>
        <Button isLoading={isLoading} block color="primary">
          {!isTwoFactorAuth
            ? t('login.form.loginWithEmail')
            : t('login.form.buttonTwoFactor')}
        </Button>
        <Divider />
        <Button block color="default" onClick={this.loginWithPhone}>
          {t('login.form.loginWithPhone')}
        </Button>
      </Form>
    )
  }
}
