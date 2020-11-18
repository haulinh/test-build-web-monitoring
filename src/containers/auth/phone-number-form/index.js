import React, { Component, Fragment } from 'react'
import { Form } from 'antd'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import createLang from 'hoc/create-lang'
import { getOTPByPhoneNumber } from 'api/AuthApi'
import { connectAutoDispatch } from 'redux/connect'
import { userLogin, userLogin2Factor } from 'redux/actions/authAction'

import Heading from 'components/elements/heading'
import Button from 'components/elements/button'
import InputPhoneNumber from 'components/elements/input-phone-number'

import OTPForm from '../otp-form'
import slug from 'constants/slug'

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

@createLang
@withRouter
@Form.create()
@connectAutoDispatch(null, { userLogin, userLogin2Factor })
export default class PhoneNumberForm extends Component {
  state = { isShowOtpForm: false, isLoading: false }

  goBack = () => {
    const { history } = this.props
    history.push(slug.login.loginWithEmail)
  }

  handleVerifyOTP = async () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    console.log(values)
  }

  handleGetOtp = async () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const phoneNumber = (values.phoneNumber || {}).phoneNumber
    const result = { remainTime: 3 } //await getOTPByPhoneNumber(phoneNumber)
    return {
      isSuccess: true,
      remainTime: result.remainTime || 10,
    }
  }

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ isLoading: true })
    try {
      const result = await this.handleGetOtp()

      if (result.isSuccess)
        this.setState({
          isShowOtpForm: true,
          otpRemainTime: result.remainTime,
        })
    } catch (error) {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const {
      form,
      lang: { t },
    } = this.props

    const { isLoading, isShowOtpForm, otpRemainTime } = this.state

    return (
      <Fragment>
        <Form hidden={isShowOtpForm} onSubmit={this.onSubmit}>
          <FormHeader>
            <Heading fontSize={16}>{t('login.form.loginWithPhone')}</Heading>
          </FormHeader>
          <FormBody>
            {form.getFieldDecorator(FIELDS.PHONE_NUMBER)(<PhoneNumber />)}
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
              otpRemainTime={otpRemainTime}
              phoneNumber={
                (form.getFieldValue(FIELDS.PHONE_NUMBER) || {}).phoneNumber
              }
              onVerifyOTP={this.handleVerifyOTP}
              onRefreshOTP={this.handleGetOtp}
              onCancel={this.goBack}
            />
          )}
      </Fragment>
    )
  }
}
