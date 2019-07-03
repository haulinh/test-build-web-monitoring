import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connectAutoDispatch } from 'redux/connect'
import { reduxForm, Field } from 'redux-form'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'
import swal from 'sweetalert2'
import { withRouter } from 'react-router'
import Heading from 'components/elements/heading'
import createLang from 'hoc/create-lang'
import { InputLabel, createValidateComponent } from 'components/elements'
import Button from 'components/elements/button'
import Clearfix from 'components/elements/clearfix'
import { userLogin, userLogin2Factor } from 'redux/actions/authAction'
import Errors from 'constants/errors'
import * as _ from 'lodash'

const FInput = createValidateComponent(InputLabel)

const Form = styled.form`
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);
  width: 450px;
  box-shadow: 0 2px 10px 0 rgba(238, 238, 238, 0.5);
  background-color: #ffffff;
  padding: 24px 32px;
  
`

const FloatRight = styled.div`
  text-align: right;
  padding-top: 8px;
`

const Header = {
  Wrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 8px;
  `,
  Logo: styled.img`
    height: 38px;
    width: auto;
  `
}

const bodyStyle = `
  body { 
    background: linear-gradient(135deg,#1d89ce 0%,#56d2f3 100%) !important; 
  }
  video {
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    background: url(/images/clouds.png) no-repeat;
    background-size: cover;
    -webkit-transition: 1s opacity;
    transition: 1s opacity;
}

`

@createLang
@withRouter
@reduxForm({
  form: 'LoginForm'
})
@connectAutoDispatch(
  state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userInfo: state.auth.userInfo
  }),
  { userLogin, userLogin2Factor }
)
export default class Login extends PureComponent {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    userLogin: PropTypes.func,
    userLogin2Factor: PropTypes.func
  }

  state = {
    formData: {},
    isTwoFactorAuth: false
  }

  userError(user) {
    let title = user.message
    console.log(Errors.ACCOUNT_DELETE, 'Errors.ACCOUNT_DELETE')
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
      type: 'error'
    })
  }

  userSuccess(user) {
    swal({
      type: 'success',
      text: 'Welcome ' + user.data.email
    })
    this.props.history.push('/')
  }

  async handleLogin(values) {
    if (!this.state.isTwoFactorAuth) {
      const user = await this.props.userLogin(values)
      if (user.error) {
        console.log(user, 'user')
        this.userError(user)
      } else {
        if (user.data.twoFactorAuth && user.data.twoFactorAuth.enable) {
          this.setState({
            isTwoFactorAuth: true,
            formData: values
          })
        } else {
          this.userSuccess(user)
        }
      }
    } else {
      const user = await this.props.userLogin2Factor(values)
      if (user.error) {
        this.userError(user)
      } else {
        this.userSuccess(user)
      }
    }
  }

  getEmail_Sms() {
    if (_.get(this.props, 'userInfo.twoFactorAuth.type') === 'sms') {
      return _.get(this.props, 'userInfo.phone.phoneNumber')
    }

    return _.get(this.state, 'formData.email')
  }

  render() {
    const { t } = this.props.lang
    return (
      <Container>
        <style dangerouslySetInnerHTML={{ __html: bodyStyle }} />
        <video   loop autoPlay muted>
           <source src="/video/login.webm" type="video/webm"/>
            <source src="/video/login.mp4" type="video/mp4" />
        </video>
        
        <Form onSubmit={this.props.handleSubmit(this.handleLogin.bind(this))}>
          <Header.Wrapper>
            <Heading fontSize={28}>{t('login.title')}</Heading>
            <Header.Logo src="/images/logo/logo.png" />
          </Header.Wrapper>
          <Clearfix height={8} />
          {!this.state.isTwoFactorAuth ? (
            <div>
              <Field
                label={t('login.form.email.label')}
                placeholder={t('login.form.email.placeholder')}
                name="email"
                icon="fa fa-user"
                component={FInput}
              />
              <Clearfix height={16} />
              <Field
                label={t('login.form.password.label')}
                placeholder={t('login.form.password.placeholder')}
                type="password"
                name="password"
                component={FInput}
              />
            </div>
          ) : (
            <div>
              <p>
                {t('login.twoFactorAlert', {
                  email: this.getEmail_Sms()
                })}
              </p>
              <Field
                label={t('login.form.twoFactor.label')}
                placeholder={t('login.form.twoFactor.placeholder')}
                name="code"
                component={FInput}
              />
            </div>
          )}
          <Clearfix height={16} />
          <Button isLoading={this.props.submitting} block color="primary">
            {!this.state.isTwoFactorAuth
              ? t('login.form.buttonLogin')
              : t('login.form.buttonTwoFactor')}
          </Button>
          <Clearfix height={16} />
          <FloatRight>
            <Link to={slug.password.emailConfirm}>
              {translate('resetPassword.key')}
            </Link>
          </FloatRight>
        </Form>
      </Container>
    )
  }
}
