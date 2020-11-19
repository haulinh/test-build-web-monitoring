import React, { PureComponent, Fragment } from 'react'
import { Form, Input } from 'antd'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import AuthApi from 'api/AuthApi'
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
const TextError = styled.div`
  font-weight: 'normal';
  font-size: '14px';
  color: #dc4448;
  margin: 5px 0;
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
    isShowOtpConfirm: false,
    isShowResetPasswordForm: false,
  }

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
        this.setState({ isLoading: false, error: getAuthError(message) })
        return
      }

      const otpRemainTime = getRemainTime(data.expired) || 30
      this.setState({
        otpRemainTime,
        isLoading: false,
        isShowOtpConfirm: true,
      })
      return {
        otpRemainTime,
        error: error ? getAuthError(message) : null,
      }
    } catch (error) {
      return null
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
    if (error) return getAuthError(message)
    this.setState({
      userInfo: data,
      isShowOtpConfirm: false,
      isShowResetPasswordForm: true,
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
      isShowOtpConfirm,
      isShowResetPasswordForm,
      error,
      userInfo,
      otpRemainTime,
    } = this.state

    return (
      <Fragment>
        <Form
          onSubmit={this.onSubmit}
          hidden={isShowOtpConfirm || isShowResetPasswordForm}
        >
          <Heading fontSize={16}>{translate('resetPassword.key')}</Heading>
          {form.getFieldDecorator(FIELDS.CODE)(<Input hidden />)}
          <Form.Item>
            {form.getFieldDecorator(FIELDS.EMAIL, {
              rules: [requireRule, emailRule],
            })(<Input autoFocus placeholder="Your email" size="large" />)}
          </Form.Item>
          {error && <TextError>{error}</TextError>}
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
        {isShowOtpConfirm && (
          <OTPForm
            otpLength={4}
            otpRemainTime={otpRemainTime}
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
