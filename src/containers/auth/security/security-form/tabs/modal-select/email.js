import React from 'react'
import { Button, Steps, Icon, Alert, Input } from 'antd'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Row } from 'antd'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import userApi from 'api/UserApi'
import authApi from 'api/AuthApi'
import { connectAutoDispatch } from 'redux/connect'
import { set2FAStatus } from 'redux/actions/authAction'

const Step = Steps.Step

const RESET_2FA_SMS = 60 * 10

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const RowView = styled.div`
  margin-bottom: 12px;
  justify-content: center;
  align-items: center;
`

const RowViewCenter = styled(RowView)`
  justify-content: center;
  display: flex;
  flex-direction: row;
`

const Text = styled.p``

@connectAutoDispatch(
  state => ({
    user: state.auth.userInfo
  }),
  { set2FAStatus }
)
export default class ModalSelectEmail extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    set2FAStatus: PropTypes.func.isRequired
  }
  state = {
    isLoadingSms: false,
    isLoadingEmail: false,
    stepCurrent: 0,
    type: null,
    code: ''
  }

  render() {
    return (
      <Row>
        {/*
          NOTE  logic
          Nếu đã có code, còn hạn mà chưa nhập code thì show form sms
          ngoài ra show form action
        */
        this.props.isSmsVerifyInProgress || this.state.type === 'sms'
          ? this._renderSms()
          : this._renderOptions()}
      </Row>
    )
  }

  _setTimeoutReset = () => {
    setTimeout(() => this.handleUpdate(false), RESET_2FA_SMS)
  }

  _renderOptions() {
    return (
      <Container>
        <Text>{translate('security.message.info')}</Text>
        <Button
          onClick={this._handleSelectEmail}
          loading={this.state.isLoadingEmail}
        >
          {translate('security.use.email')}
        </Button>
        <Button
          loading={this.state.isLoadingSms}
          onClick={this._handleRegisterSms}
          style={{ marginTop: 16 }}
        >
          {translate('security.use.sms')}
        </Button>
      </Container>
    )
  }

  _renderSms = () => {
    // this._setTimeoutReset()
    return (
      <Container>
        <RowView>
          <Steps current={this.state.stepCurrent}>
            <Step
              key="0"
              title={translate('security.step1')}
              icon={<Icon type="solution" />}
            />
            <Step
              key="1"
              title={translate('security.step2')}
              icon={<Icon type="clock-circle" />}
            />
            <Step
              key="2"
              title={translate('security.step3')}
              icon={<Icon type="smile-o" />}
            />
          </Steps>
        </RowView>
        <RowView>
          <Alert
            message={translate('security.message.code', {
              phone: _.get(this.props, 'user.phone.phoneNumber', 'NaN')
            })}
            type="success"
          />
        </RowView>
        <RowViewCenter>
          {/* <InputNumber autoFocus style={{width: 200, textAlign: 'center'}} onChange={this.handleChangeCode}/> */}
          <Input
            onChange={this.handleChangeCode}
            addonBefore={<strong>Code</strong>}
            onPressEnter={this.handleConfirmSms}
            addonAfter={
              <strong onClick={this.handleConfirmSms}>
                {translate('security.send')}
              </strong>
            }
          />
        </RowViewCenter>
      </Container>
    )
  }

  handle2FARegister = type => {
    if (type) {
      swal({
        type: 'success',
        title: translate('security.success')
      })
      this.props.set2FAStatus(true)
      this.props.switchToTab(1)
    } else {
      swal({
        type: 'error',
        title: translate('security.failure')
      })
      this.props.set2FAStatus(false)
    }
  }

  async handleUpdate(enable) {
    try {
      const { success } = await authApi.putSecurity({ enable })
      return !!success
    } catch (error) {
      return false
    }
  }

  async _handleSelectSms() {
    this.setState({ isLoadingSms: true })
    await userApi.getSmsCode('sms')
    this.setState({ type: 'sms', stepCurrent: 0, isLoadingSms: false })
  }

  async _handleSelectEmail() {
    this.setState({ isLoadingEmail: true })
    const success = await this.handleUpdate(true)
    this.setState({ type: 'email', isLoadingEmail: false })
    this.handle2FARegister(success)
  }

  handleNextStep = stepCurrent => {
    this.setState({ stepCurrent })
  }

  handleChangeCode = ({ target }) => {
    this.setState({ code: target.value })
  }

  handleConfirmSms = async () => {
    const { code } = this.state
    if (code) {
      this.setState({ stepCurrent: 1 })
      const { success } = await userApi.confirmSms('sms', { code })
      this.setState({ stepCurrent: 2 })
      if (success) {
        this.setState({ type: null })
      } else {
        this.setState({ stepCurrent: 0 })
      }
      this.handle2FARegister(success)
    }
  }
}
