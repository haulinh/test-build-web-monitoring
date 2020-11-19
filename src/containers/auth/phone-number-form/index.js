import React, { Component, Fragment } from 'react'
import { Form } from 'antd'
import styled from 'styled-components'
import { getConfigApi } from 'config'
import { withRouter } from 'react-router-dom'

import slug from 'constants/slug'
import createLang from 'hoc/create-lang'
import { setAuthToken } from 'utils/auth'
import {
  verifyPhoneNumber,
  getOTPByPhoneNumber,
  verifyOTPWithPhoneNumber,
} from 'api/AuthApi'

import Heading from 'components/elements/heading'
import Button from 'components/elements/button'
import InputPhoneNumber from 'components/elements/input-phone-number'

import OTPForm from '../otp-form'
import { getAuthError, getRemainTime } from './helper'

const FIELDS = {
  PHONE_NUMBER: 'phoneNumber',
  OTP: 'otp',
}

const FormHeader = styled.div`
  width: 100%%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`

const FormBody = styled.div`
  > div {
    margin-bottom: 12px;
  }
`

const PhoneNumber = styled(InputPhoneNumber)`
  .flag-dropdown {
    border: none !important;
  }
`

const ButtonCancel = styled(Button)`
  &,
  &:hover {
    margin-top: 12px;
    background: #ffffff;
    color: #2f6bff;
    cursor: pointer;
  }
`

const TextError = styled.div`
  font-weight: 'normal';
  font-size: '14px';
  color: #dc4448;
  margin-bottom: 16px;
`

@createLang
@withRouter
@Form.create()
export default class PhoneNumberForm extends Component {
  state = { isShowOtpForm: false, isLoading: false }

  getPhoneNumber = () => {
    const { form } = this.props
    const values = form.getFieldValue(FIELDS.PHONE_NUMBER)
    return (values || {}).phoneNumber
  }

  handleVerifyPhoneNumber = async () => {
    const phone = this.getPhoneNumber()
    const result = await verifyPhoneNumber({ phone })
    return result
  }

  handleGetOtp = async () => {
    const phone = this.getPhoneNumber()
    const { error, data, message } = await getOTPByPhoneNumber({ phone })
    return {
      error: error ? getAuthError(message) : null,
      otpRemainTime: getRemainTime(data.expired),
    }
  }

  handleVerifyOTP = async () => {
    const { form } = this.props
    const phone = this.getPhoneNumber()
    const otp = form.getFieldValue(FIELDS.OTP)

    const result = await verifyOTPWithPhoneNumber({ otp, phone })
    const { error, message, token } = result
    if (error) {
      return getAuthError(message)
    }
    setAuthToken(token)
    window.location = getConfigApi().defaultPage
  }

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ isLoading: true })
    try {
      const { error, message, data } = await this.handleVerifyPhoneNumber()
      if (error) {
        this.setState({ error: getAuthError(message), isLoading: false })
        return
      }
      const remainingTime = getRemainTime(data.expired)
      const isNeedToGetOTP = !data.expired || remainingTime < 0
      if (isNeedToGetOTP) {
        this.handleGetOtp()
      }

      this.setState({
        isLoading: true,
        isShowOtpForm: true,
        otpRemainTime: remainingTime,
      })
    } catch (error) {
      this.setState({ isLoading: false })
    }
  }

  goBack = () => {
    const { history } = this.props
    history.push(slug.login.loginWithEmail)
  }

  render() {
    const {
      form,
      lang: { t },
    } = this.props

    const { error, isLoading, isShowOtpForm, otpRemainTime } = this.state
    return (
      <Fragment>
        <Form hidden={isShowOtpForm} onSubmit={this.onSubmit}>
          <FormHeader>
            <Heading fontSize={16}>{t('login.form.loginWithPhone')}</Heading>
          </FormHeader>
          <FormBody>
            {form.getFieldDecorator(FIELDS.PHONE_NUMBER)(<PhoneNumber />)}
          </FormBody>
          {error && <TextError>{error}</TextError>}
          <Button isLoading={isLoading} block color="primary">
            {t('login.form.buttonLogin')}
          </Button>
          <ButtonCancel block onClick={this.goBack}>
            {t('addon.cancel')}
          </ButtonCancel>
        </Form>
        {isShowOtpForm &&
          form.getFieldDecorator(FIELDS.OTP)(
            <OTPForm
              otpRemainTime={otpRemainTime}
              phoneNumber={this.getPhoneNumber()}
              onVerifyOTP={this.handleVerifyOTP}
              onRefreshOTP={this.handleGetOtp}
              onCancel={this.goBack}
            />
          )}
      </Fragment>
    )
  }
}
