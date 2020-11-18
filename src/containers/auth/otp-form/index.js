import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import OtpInput from 'react-otp-input'
import styled from 'styled-components'
import { Form } from 'antd'

import createLang from 'hoc/create-lang'

import Button from 'components/elements/button'
import Loader from 'components/elements/loader-circle'

const FormBody = styled.div`
  > div {
    margin: 16px 50px;
    flex: 6;
    > div {
      flex: 1;
      input {
        width: 45px !important;
        height: 55px;
        font-size: 20px;
        background: #f0f0f0;
        border: 1px solid #e4e4e4;
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
  margin-bottom: 16px;
`

const EVENT_COUNTDOWN = 'event_countdown'

@createLang
export default class OTPForm extends Component {
  constructor() {
    super()
    this.state = {
      isValidOTP: true,
      isLoading: false,
      isValidToRefreshOTP: false,
      otp: '',
      remainingOTPTime: 0,
      otpRemainTime: null,
    }
    document.addEventListener(EVENT_COUNTDOWN, this.startCountDown)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.otpRemainTime !== prevState.otpRemainTime) {
      const remainingOTPTime = nextProps.otpRemainTime
      var event = new CustomEvent(EVENT_COUNTDOWN)
      document.dispatchEvent(event)

      return {
        remainingOTPTime,
        otpRemainTime: remainingOTPTime,
      }
    }
    return null
  }

  componentWillUnmount() {
    clearInterval(this.countDownIntervalID)
    document.removeEventListener(EVENT_COUNTDOWN, this.startCountDown)
  }

  isExpired = () => this.state.remainingOTPTime <= 0

  startCountDown = () => {
    this.countDownIntervalID = setInterval(async () => {
      if (this.isExpired()) {
        clearInterval(this.countDownIntervalID)
        this.setState({ isValidToRefreshOTP: true })
      } else {
        this.setState(prevState => ({
          remainingOTPTime: prevState.remainingOTPTime - 1,
        }))
      }
    }, 1000)
  }

  onChangeOTP = otp => {
    const { onChange } = this.props
    this.setState({ otp })
    onChange(otp)
  }

  formatDuration = (seconds, format = 'MM:ss') => {
    const s = new Date(1000 * seconds).toISOString()
    if (format === 'MM:ss') return s.substr(14, 5)
    if (format === 'HH:MM:ss') return s.substr(11, 8)
    return ''
  }

  onRefreshOTP = async () => {
    this.setState({ isValidToRefreshOTP: false })
    const { onRefreshOTP } = this.props
    const result = await onRefreshOTP()
    this.setState({ remainingOTPTime: result.remainTime }, this.startCountDown)
  }

  onSubmit = async e => {
    const { onVerifyOTP } = this.props
    e.preventDefault()
    this.setState({ isLoading: true })
    const result = await onVerifyOTP()

    if (!result) {
      this.setState({ isLoading: false, isValidOTP: false })
      return
    }
  }

  render() {
    const {
      email,
      phoneNumber,
      otpLength,
      lang: { t },
      onCancel,
    } = this.props

    const {
      otp,
      isLoading,
      isValidOTP,
      remainingOTPTime,
      isValidToRefreshOTP,
    } = this.state

    return (
      <Fragment>
        <Form onSubmit={this.onSubmit}>
          <Text color="#7F8890">Input OTP sent to phone number</Text>
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
          </FormBody>
          {!isValidOTP && (
            <Text color="#DC4448">{t('login.errors.wrongOtp')}</Text>
          )}

          {isValidToRefreshOTP ? (
            <CustomButton margin="8px 0 20px" onClick={this.onRefreshOTP}>
              {isLoading ? <Loader isCenter size={20} color="#fff" /> : ''}{' '}
              {t('login.form.refreshOtp')}
            </CustomButton>
          ) : (
            <Text color="#B2B7BC">
              {t('login.form.refreshOtpAfter', {
                time: `${this.formatDuration(remainingOTPTime)}s`,
              })}
            </Text>
          )}
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
}

OTPForm.defaultProps = {
  otpLength: 6,
}
