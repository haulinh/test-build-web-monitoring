import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import styled from 'styled-components'

import slug from 'constants/slug'
import createLang from 'hoc/create-lang'

import EmailForm from './email-form'
import PhoneNumberForm from './phone-number-form'
import EmailConfirmForm from './reset-password'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
`

const Brand = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
  > div {
    font-size: 32px;
    font-weight: 700;
    color: #000000;
    margin-left: 16px;
  }
`

const Form = styled.div`
  width: 510px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(26, 26, 26, 0.2);
  input {
    background: #f6f6f6;
  }
`

const Footer = styled.div`
  width: 510px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 16px;
  font-weight: 600;
  .copyright {
    color: #20313e;
  }
  .policy {
    > a {
      color: #7f8890;
      margin-left: 15px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`

@createLang
@withRouter
export default class Auth extends PureComponent {
  getPath = () => {
    const {
      history: { location },
    } = this.props
    return location.pathname
  }

  render() {
    const {
      lang: { t },
    } = this.props
    return (
      <Container>
        <Brand>
          <img src="/images/ilotusland-logo.svg" alt="ilotusland" />
          <div>iLotusLand</div>
        </Brand>
        <Form>
          {this.getPath() === slug.login.loginWithEmail && <EmailForm />}
          {this.getPath() === slug.login.loginWithPhoneNumber && (
            <PhoneNumberForm />
          )}
          {this.getPath() === slug.password.emailConfirm && (
            <EmailConfirmForm />
          )}
        </Form>
        <Footer>
          <div className="copyright">
            Copyright © {new Date().getFullYear()} iLotusLand
          </div>
          <div className="policy">
            <a href="#privacyPolicy">{t('global.privacyPolicy')}</a>
            <a href="#termsOfService">{t('global.termsOfService')}</a>
          </div>
        </Footer>
      </Container>
    )
  }
}
