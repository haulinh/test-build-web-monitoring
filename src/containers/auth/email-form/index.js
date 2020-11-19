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

import { getAuthError } from '../helper'
import { emailRule, requireRule } from '../rules'

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
    const result = await userLogin2Factor(values)
    if (result.error) {
      this.handleError(result.message)
      return
    }
    this.handleSuccess(result)
  }

  handleLogin = async values => {
    const { userLogin, history } = this.props
    const result = await userLogin(values)

    if (result.error) {
      if (result.message === Errors.ORGANIZATION_EXPIRED) {
        history.push(`${slug.user.expLicense}?expDate=${result['0'].expDate}`)
      } else {
        this.handleError(result.message)
      }
      return
    }
    if (result.data.twoFactorAuth && result.data.twoFactorAuth.enable) {
      this.setState({ isTwoFactorAuth: true })
    } else {
      this.handleSuccess(result)
    }
  }

  handleError(errMessage) {
    let title = getAuthError(errMessage)
    swal({
      title,
      type: 'error',
    })
  }

  handleSuccess(user) {
    swal({
      type: 'success',
      text: 'Welcome ' + user.data.email,
    })

    const defaultPage = getConfigApi().defaultPage
    window.location = defaultPage
  }

  onSubmit = async e => {
    e.preventDefault()
    try {
      const { form } = this.props
      const values = await form.validateFields()
      if (!values) return

      this.setState({ isLoading: true })
      const { isTwoFactorAuth } = this.state
      if (isTwoFactorAuth) {
        await this.handleUserLoginTwoFactor(values)
      } else {
        await this.handleLogin(values)
      }
      this.setState({ isLoading: false })
    } catch (error) {
      console.log(error)
    }
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
          <Form.Item>
            {form.getFieldDecorator(FIELDS.EMAIL, {
              rules: [requireRule, emailRule],
            })(
              <Input
                autoFocus
                size="large"
                placeholder={t('login.form.email.placeholder')}
              />
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator(FIELDS.PASSWORD, { rules: [requireRule] })(
              <Input.Password
                type="password"
                size="large"
                placeholder={t('login.form.password.placeholder')}
              />
            )}
          </Form.Item>
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
