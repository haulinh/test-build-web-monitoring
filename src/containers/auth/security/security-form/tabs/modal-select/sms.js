import React from 'react'
import { Button, Steps, Icon, Alert, Input } from 'antd'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {Row} from 'antd'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import userApi from 'api/UserApi'
import authApi from 'api/AuthApi'
import { connectAutoDispatch } from 'redux/connect'
import { set2FAStatus, set2FAType } from 'redux/actions/authAction'

const Step = Steps.Step

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const RowView = styled.div`
  margin-bottom: 12px;
  justify-content: center;
  align-items: center;
`

const RowViewCenter = RowView.extend`
  justify-content: center;
  display: flex;
  flex-direction: row;
`

@connectAutoDispatch(
  (state) => ({
    user: state.auth.userInfo
  }),
  { set2FAStatus, set2FAType }
)
@autobind
export default class ModalSelectSMS extends React.PureComponent {
  static propTypes = {
    /* component props */
    switchToTab: PropTypes.func.isRequired,
    clearSmsVerifyInProgress: PropTypes.func.isRequired,
    /* redux props */
    user: PropTypes.object.isRequired,
    set2FAStatus: PropTypes.func.isRequired,
    set2FAType: PropTypes.func.isRequired
  }

  state = {
    isLoadingSms: false,
    stepCurrent: 0,
    code: ''
  }
  
  render() {
    return (
      <Container>
        {/* steps */}
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
        {/* notes */}
        <RowView>
          <Alert
            message={translate('security.message.code', {
              phone: _.get(this.props, 'user.phone.phoneNumber', 'NaN')
            })}
            type="success"
          />
        </RowView>
        {/* input */}
        <RowViewCenter>
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
  handleChangeCode = ({ target }) => {
    this.setState({ code: target.value })
  }

  handle2FARegister = success => {
    if (success) {
      swal({
        type: 'success',
        title: translate('security.success')
      })
      this.props.set2FAStatus(true)
      this.props.set2FAType('sms')
      this.props.clearSmsVerifyInProgress()
      this.props.switchToTab(1)
    } else {
      swal({
        type: 'error',
        title: translate('security.failure')
      })
      this.props.set2FAStatus(false)
    }
  }

  async handleConfirmSms()  {
    try {
      const { code } = this.state
      if (code) {
        this.setState({ stepCurrent: 1 })
        const { success } = await userApi.confirmSms('sms', { code })
        this.setState({ stepCurrent: 2 })
        if (success) {
          this.props.switchToOption({ option: 'sms' })
        } else {
          this.setState({ stepCurrent: 0 })
        }
        this.handle2FARegister(success)
      }
    }
    catch(error) {
      this.setState({ stepCurrent: 0 })
    }
  }
}
