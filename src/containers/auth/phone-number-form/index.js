import React, { Component, createRef, Fragment } from 'react'
import styled from 'styled-components'
import { Form, notification } from 'antd'
import { getConfigApi } from 'config'
import { withRouter } from 'react-router-dom'

import slug from 'constants/slug'
import Errors from 'constants/errors'
import createLang from 'hoc/create-lang'
import { setAuthToken } from 'utils/auth'
import {
  verifyPhoneNumber,
  getOTPByPhoneNumber,
  verifyOTPWithPhoneNumber,
} from 'api/AuthApi'

import Heading from 'components/elements/heading'
import Button from 'components/elements/button'
import InputPhoneNumber from 'components/elements/input-phone-number_v2'

import OTPForm from '../otp-form'
import { getAuthError, getRemainTime } from '../helper'

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
  .ant-form-item-control {
    line-height: 0;
  }
`

const PhoneNumber = styled(InputPhoneNumber)``

const ButtonCancel = styled(Button)`
  &,
  &:hover {
    margin-top: 12px;
    background: #ffffff;
    color: #2f6bff;
    cursor: pointer;
  }
`
@createLang
@withRouter
@Form.create()
export default class PhoneNumberForm extends Component {
  state = { isShowOtpForm: false, isLoading: false }

  otpRef = createRef()

  getPhoneNumber = () => {
    const { form } = this.props
    const values = form.getFieldValue(FIELDS.PHONE_NUMBER)
    return (values || {}).phoneNumber
  }

  handleGetOtp = async () => {
    const phone = this.getPhoneNumber()
    const result = await getOTPByPhoneNumber({ phone })
    const { error, data, message } = result
    if (error) {
      this.handleError(message)
      return
    }
    const otpRemainTime = getRemainTime(data.refreshOtp)
    this.otpRef.startCountDown(otpRemainTime)
  }

  handleVerifyOTP = async () => {
    const { form, history } = this.props
    const phone = this.getPhoneNumber()
    const otp = form.getFieldValue(FIELDS.OTP)

    const result = await verifyOTPWithPhoneNumber({ otp, phone })
    const { error, message, token } = result
    if (error) {
      if (message === Errors.ORGANIZATION_EXPIRED) {
        history.push(`${slug.user.expLicense}?expDate=${result['0'].expDate}`)
      }
      return getAuthError(message)
    }
    setAuthToken(token)
    window.location = getConfigApi().defaultPage
  }

  handleError = errMessage => {
    let message = getAuthError(errMessage)
    const setFieldError = (field, error) => {
      const { form } = this.props
      form.setFields({
        [field]: {
          value: form.getFieldValue(field),
          errors: [new Error(error)],
        },
      })
    }
    if ([Errors.PHONE_NOT_EXISTS].includes(errMessage)) {
      setFieldError(FIELDS.PHONE_NUMBER, message)
      return
    }

    notification.error({
      message,
      duration: 4,
    })
  }

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ isLoading: true })
    try {
      const phone = this.getPhoneNumber()
      const result = await verifyPhoneNumber({ phone })
      const { error, message, data } = result
      if (error) {
        this.setState({ isLoading: false })
        this.handleError(message)
        return
      }

      this.setState(
        {
          isLoading: false,
          isShowOtpForm: true,
        },
        () => {
          const remainingTime = getRemainTime(data.refreshOtp)
          const isNeedToGetOTP =
            data.isVerified || !data.refreshOtp || remainingTime < 0
          if (isNeedToGetOTP) {
            this.handleGetOtp()
          }
          if (remainingTime > 0) this.otpRef.startCountDown(remainingTime)
        }
      )
    } catch (error) {
      this.setState({ isLoading: false })
    }
  }

  goBack = () => {
    const { history } = this.props
    const { isShowOtpForm } = this.state
    if (!isShowOtpForm) history.push(slug.login.loginWithEmail)
    else this.setState({ isShowOtpForm: false })
  }

  render() {
    const {
      form,
      lang: { t },
    } = this.props

    const { isLoading, isShowOtpForm } = this.state
    return (
      <Fragment>
        <Form hidden={isShowOtpForm} onSubmit={this.onSubmit}>
          <FormHeader>
            <Heading fontSize={16}>{t('login.form.loginWithPhone')}</Heading>
          </FormHeader>
          <FormBody>
            <Form.Item>
              {form.getFieldDecorator(FIELDS.PHONE_NUMBER)(
                <PhoneNumber inputProps={{ autoFocus: true }} />
              )}
            </Form.Item>
          </FormBody>
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
              ref={ref => (this.otpRef = ref)}
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
