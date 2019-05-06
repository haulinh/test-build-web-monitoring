import React from 'react'
import { Modal, Button, Steps, Icon, InputNumber, Alert, Input } from 'antd'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import * as _ from 'lodash'
import moment from 'moment'
import userApi from 'api/UserApi'
import authApi from 'api/AuthApi'

const Step = Steps.Step;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const RowView =  styled.div`
  margin-bottom: 12px;
  justify-content: center;
  align-items: center;
`

const RowViewCenter =  RowView.extend`
  justify-content: center;
  display: flex;
  flex-direction: row;
`

const Text = styled.p``

export default class ModalSelect extends React.PureComponent {
  state = {
    stepCurrent: 0,
    type: null,
    code: ''
  }

  async handleUpdate (enable) {
    try {
      const { success } = await authApi.putSecurity({enable})
      return !!success
    } catch (error) {
      return false
    }
  }

  async handleSuccess (type) {
    if (type === 'sms') {
      this.setState({type, stepCurrent: 0})
      await userApi.getSmsCode('sms')
    } else {
      const success = await this.handleUpdate(true)
      this.props.onSuccess(success)
      this.setState({type})
    }
  }

  handleNextStep = stepCurrent => {
    this.setState({ stepCurrent })
  }

  handleChangeCode = ({target}) => {
    this.setState({ code: target.value })
  }

  handleConfirmSms = async () => {
    const { code } = this.state
    if (code) {
      this.setState({ stepCurrent: 1 })
      const { success } = await userApi.confirmSms('sms', { code })
      this.setState({ stepCurrent: 2})
      if (success) {
        this.setState({type: null})
      }
      this.props.onSuccess(success)
    }
  }

  _renderAction() {
    return (
      <Container>
        <Text>
          { translate('security.message.info') }
        </Text>
        <Button onClick={() => this.handleSuccess('email')}>{translate('security.use.email')}</Button>
        <Button onClick={() => this.handleSuccess('sms')} style={{ marginTop: 16 }}>{translate('security.use.sms')}</Button>
      </Container>
    )
  }

  _renderSms () {
    return (
      <Container>
        <RowView>
          <Steps current={this.state.stepCurrent}>
            <Step key='0' title={translate('security.step1')} icon={<Icon type="solution" />} />
            <Step key='1' title={translate('security.step2')} icon={<Icon type="clock-circle" />} />
            <Step key='2' title={translate('security.step3')} icon={<Icon type="smile-o" />} />
          </Steps>
        </RowView>
        <RowView>
          <Alert message={translate('security.message.code', {phone: _.get(this.props, 'user.phone.phoneNumber', 'NaN')})} type="success" />
        </RowView>
        <RowViewCenter>
          {/* <InputNumber autoFocus style={{width: 200, textAlign: 'center'}} onChange={this.handleChangeCode}/> */}
          <Input 
            onChange={this.handleChangeCode}
            addonBefore={<strong>Code</strong>}
            onPressEnter={this.handleConfirmSms}
            addonAfter={<strong onClick={this.handleConfirmSms}>{translate('security.send')}</strong>} />
        </RowViewCenter>
        {/* <RowViewCenter> */}
          {/* <Button style={{ marginRight: 16 }} onClick={() => this.handleNextStep(0)}>Close</Button> */}
        {/* </RowViewCenter> */}
      </Container>
    )
  }

  render () {
    const {twoFactorAuth} = this.props.user
    if (!twoFactorAuth) {
      this.props.user.twoFactorAuth = {
        enable: false,
        code: ''
      }
    }
    const {code, enable, expired} = this.props.user.twoFactorAuth
    const isExpired = moment().isSameOrAfter(moment(expired))
    const isSmsVerifyInProgress = !enable && code != "" && !isExpired
    return (
      <Modal
          footer={null}
          title={translate('security.label')}
          visible={this.props.visible}
          onOk={this.props.handleOk}
          onCancel={this.props.onCancel}
        >
          {
            /*
              NOTE  logic
              Nếu đã có code, còn hạn mà chưa nhập code thì show form sms
              ngoài ra show form action
            */
            isSmsVerifyInProgress || this.state.type === 'sms' ? this._renderSms() : this._renderAction()
          }
        </Modal>
    )
  }
}