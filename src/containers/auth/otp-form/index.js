import React, { Component, Fragment } from 'react'
import { Form } from 'antd'
import { lowerCase } from 'lodash'
import PropTypes from 'prop-types'
import OtpInput from 'react-otp-input'
import styled from 'styled-components'

import { translate as t } from 'hoc/create-lang'

import Button from 'components/elements/button'
import { formatDuration } from '../helper'

const FormBody = styled.div`
  > div {
    margin: 16px 50px;
    flex: 6;
    > div {
      flex: 1;
      justify-content: center;
      input {
        width: 45px !important;
        height: 55px;
        font-size: 20px;
        background: #f0f0f0;
        border: 1px solid #e4e4e4;
        border-radius: 6px;
        caret-color: #2f6bff;
        &:focus {
          background: #eef3ff;
          border: 1px solid #a7c0ff;
          outline: none;
        }
      }
    }
  }
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

const Text = styled.div`
  font-weight: ${props => props.fontWeight || 'normal'};
  font-size: ${props => props.fontSize || '14px'};
  color: ${props => props.color || '14px'};
  text-align: center;
  margin-bottom: 12px;
`
export default class OTPForm extends Component {
  state = {
    otp: '',
    isLoading: false,
    remainingOTPTime: 0,
  }

  componentWillUnmount() {
    clearInterval(this.countDownIntervalID)
  }

  isExpiredOTP = () => this.state.remainingOTPTime <= 0

  startCountDown = timeCountdown => {
    this.setState({ remainingOTPTime: timeCountdown }, () => {
      this.countDownIntervalID = setInterval(async () => {
        if (this.isExpiredOTP()) {
          clearInterval(this.countDownIntervalID)
        } else {
          this.setState(prevState => ({
            remainingOTPTime: prevState.remainingOTPTime - 1,
          }))
        }
      }, 1000)
    })
  }

  onChangeOTP = otp => {
    const { onChange, otpLength } = this.props
    this.setState({ otp })
    onChange(otp)
    if (otp && otp.length === otpLength) {
      this.handleVerifyOTP()
    }
  }

  onRefreshOTP = async () => {
    const { onRefreshOTP } = this.props
    this.setState({ remainingOTPTime: null, otp: '' }, onRefreshOTP)
  }

  onSubmit = async e => {
    e.preventDefault()
    this.handleVerifyOTP()
  }

  handleVerifyOTP = async () => {
    const { isLoading } = this.state
    const { onVerifyOTP } = this.props
    if (isLoading) return
    this.setState({ isLoading: true })
    const error = await onVerifyOTP()
    if (error) {
      this.setState({ isLoading: false, error })
    }
  }

  renderResendButton = () => {
    const { email } = this.props
    const { remainingOTPTime } = this.state
    if (email) return null

    return this.isExpiredOTP() ? (
      <CustomButton margin="8px 0 20px" onClick={this.onRefreshOTP}>
        {t('login.form.refreshOtp')}
      </CustomButton>
    ) : (
      <Text color="#B2B7BC">
        {t('login.form.refreshOtpAfter', {
          time: `${
            remainingOTPTime === null
              ? '--:--'
              : formatDuration(remainingOTPTime)
          }s`,
        })}
      </Text>
    )
  }

  render() {
    const { otp, error, isLoading } = this.state
    const { email, phoneNumber, otpLength, onCancel } = this.props

    return (
      <Fragment>
        <Form onSubmit={this.onSubmit}>
          <Text color="#7F8890">
            {t('login.form.inputOtp', {
              type: email ? 'CODE' : 'OTP',
              to: lowerCase(
                email ? t('global.email') : t('global.phoneNumber')
              ),
            })}
          </Text>
          <Text fontSize="20px" fontWeight="700" color="#20313E">
            {phoneNumber || email}
          </Text>
          <FormBody>
            <OtpInput
              value={otp}
              numInputs={otpLength}
              isInputNum={true}
              shouldAutoFocus={true}
              onChange={this.onChangeOTP}
            />
            {error && <Text color="#f5222d">{error}</Text>}
          </FormBody>
          {this.renderResendButton()}
          <Button
            disabled={otp.length < otpLength}
            block
            isLoading={isLoading}
            color="primary"
          >
            {t('global.verify')}
          </Button>
          <CustomButton margin="16px 0 0 0" onClick={onCancel}>
            {t('global.cancel')}
          </CustomButton>
        </Form>
      </Fragment>
    )
  }
}

OTPForm.propTypes = {
  otpLength: PropTypes.number,
  phoneNumber: PropTypes.string,
  email: PropTypes.string,
  onVerifyOTP: PropTypes.func.isRequired,
  onRefreshOTP: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

OTPForm.defaultProps = {
  otpLength: 6,
}
