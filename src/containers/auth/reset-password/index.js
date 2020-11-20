import React, { PureComponent, Fragment, createRef } from 'react'
import { Form, Input, notification } from 'antd'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import AuthApi from 'api/AuthApi'
import Errors from 'constants/errors'
import { translate } from 'hoc/create-lang'
import Button from 'components/elements/button'
import Heading from 'components/elements/heading'
import OTPForm from 'containers/auth/otp-form'
import { getAuthError, getRemainTime } from 'containers/auth/helper'

import NewPassword from './new-password'
import { requireRule, emailRule } from '../rules'

const Note = styled.p`
  font-style: italic;
  padding-bottom: 8px;
`

const CustomButton = styled.div`
  background: #ffffff;
  color: #2f6bff;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin: ${props => props.margin};
`

const FIELDS = {
  EMAIL: 'email',
  CODE: 'code',
}

@withRouter
@Form.create()
export default class EmailConfirm extends PureComponent {
  state = {
    isLoading: false,
    isShowOtpForm: false,
    isShowResetPasswordForm: false,
  }

  otpRef = createRef()

  handleGetOtp = async () => {
    try {
      const { form } = this.props
      const values = await form.validateFields()
      if (!values) return

      this.setState({ isLoading: true })

      const email = values[FIELDS.EMAIL]
      const result = await AuthApi.getForgotSendCode(email)
      const { error, message, data = {} } = result
      if (error) {
        this.handleError(message)
        this.setState({ isLoading: false })
        return
      }

      this.setState(
        {
          isLoading: false,
          isShowOtpForm: true,
        },
        () => {
          const otpRemainTime = getRemainTime(data.expired) || 30
          this.otpRef.startCountDown(otpRemainTime)
        }
      )
    } catch (error) {
      this.setState({ isLoading: false })
    }
  }

  handleVerifyOTP = async () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const params = {
      email: values[FIELDS.EMAIL],
      code: values[FIELDS.CODE],
    }
    const result = await AuthApi.postConfirmCode(params)
    const { error, message, data } = result
    if (error) {
      this.handleError(message)
      return true
    }
    this.setState({
      userInfo: data,
      isShowOtpForm: false,
      isShowResetPasswordForm: true,
    })
  }

  handleError = errMessage => {
    let message = getAuthError(errMessage)
    if (
      [
        Errors.OTP_EXPIRED,
        Errors.OTP_INCORRECT,
        Errors.OTP_VERIFIED,
        Errors.NOT_SEND_OTP,
        Errors.EMAIL_NOT_EXISTS,
        Errors.ACCOUNT_DISABLE,
        Errors.ACCOUNT_NOT_ACTIVATED,
        Errors.ACCOUNT_DELETE,
        Errors.ORGANIZATION_EXPIRED,
        Errors.ORGANIZATION_NOT_EXIST,
      ].includes(errMessage)
    ) {
      const { form } = this.props
      form.setFields({
        [FIELDS.EMAIL]: {
          value: form.getFieldValue(FIELDS.EMAIL),
          errors: [new Error(getAuthError(errMessage))],
        },
      })
      return
    }
    notification.error({
      message,
      duration: 4,
    })
  }

  onSubmit = async e => {
    e.preventDefault()
    this.handleGetOtp()
  }

  setOTP = code => {
    const { form } = this.props
    form.setFieldsValue({ [FIELDS.CODE]: code })
  }

  render() {
    const { history, form } = this.props
    const {
      isLoading,
      isShowOtpForm,
      isShowResetPasswordForm,
      userInfo,
    } = this.state

    return (
      <Fragment>
        <Form
          onSubmit={this.onSubmit}
          hidden={isShowOtpForm || isShowResetPasswordForm}
        >
          <Heading fontSize={16}>{translate('resetPassword.key')}</Heading>
          {form.getFieldDecorator(FIELDS.CODE)(<Input hidden />)}
          <Form.Item>
            {form.getFieldDecorator(FIELDS.EMAIL, {
              rules: [requireRule, emailRule],
            })(<Input autoFocus placeholder="Your email" size="large" />)}
          </Form.Item>
          <Note>{translate('resetPassword.key2')}</Note>
          <Button
            block
            size="small"
            color="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {translate('global.submit')}
          </Button>
          <CustomButton margin="16px 0 0 0" onClick={history.goBack}>
            {translate('global.cancel')}
          </CustomButton>
        </Form>
        {isShowOtpForm && (
          <OTPForm
            ref={ref => (this.otpRef = ref)}
            otpLength={4}
            onCancel={history.goBack}
            onChange={this.setOTP}
            onVerifyOTP={this.handleVerifyOTP}
            onRefreshOTP={this.handleGetOtp}
            email={form.getFieldValue(FIELDS.EMAIL)}
          />
        )}
        {isShowResetPasswordForm && (
          <NewPassword
            userInfo={userInfo}
            email={form.getFieldValue(FIELDS.EMAIL)}
          />
        )}
      </Fragment>
    )
  }
}
