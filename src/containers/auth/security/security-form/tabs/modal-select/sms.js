import React from 'react'
import { Steps, Icon, Alert, Input } from 'antd'
import { translate } from 'hoc/create-lang'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment-timezone'
// import {Row} from 'antd'
import swal from 'sweetalert2'
import { autobind } from 'core-decorators'
import userApi from 'api/UserApi'
// import authApi from 'api/AuthApi'
import { connectAutoDispatch } from 'redux/connect'
import { set2FAStatus, set2FAType, update2FA } from 'redux/actions/authAction'
import AuthApi from 'api/AuthApi'

const Step = Steps.Step

// const i18n = {
//   second: translate('unit.time.second'),
//   minute: translate('unit.time.minute'),
// }

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

@connectAutoDispatch(
  state => ({
    twoFactorAuth: state.auth.userInfo.twoFactorAuth,
  }),
  { set2FAStatus, set2FAType, update2FA }
)
@withRouter
@autobind
export default class ModalSelectSMS extends React.PureComponent {
  static propTypes = {
    /* component props */
    switchToTab: PropTypes.func.isRequired,
    clearSmsVerifyInProgress: PropTypes.func.isRequired,
    /* redux props */
    twoFactorAuth: PropTypes.object.isRequired,
    set2FAStatus: PropTypes.func.isRequired,
    set2FAType: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoadingSms: false,
      stepCurrent: 0,
      code: '',
      smsExpiredTime: 600000,
    }
  }

  componentWillReceiveProps(props) {
    let remainTime = moment(props.twoFactorAuth.expired) - moment()
    this.setState({
      smsExpiredTime: remainTime,
    })
  }

  componentWillMount() {
    let remainTime = moment(this.props.twoFactorAuth.expired) - moment()
    this.setState({ smsExpiredTime: remainTime })
    if (this.isExpired()) {
      clearInterval(this.countDownIntervalID)
      this.props.update2FA({
        code: '',
        enable: false,
      })
    }
  }

  componentDidMount() {
    this.startCountDownExpired()
  }

  componentWillUnmount() {
    clearInterval(this.countDownIntervalID)
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
              phone: _.get(this.props, 'user.phone.phoneNumber', 'NaN'),
              expired: `${moment(this.state.smsExpiredTime).format('mm:ss')}`,
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
              <strong
                onClick={this.handleConfirmSms}
                style={{ cursor: 'pointer' }}
              >
                {translate('security.send')}
              </strong>
            }
          />
        </RowViewCenter>
      </Container>
    )
  }

  isExpired() {
    return this.state.smsExpiredTime < 0
  }

  startCountDownExpired() {
    this.countDownIntervalID = setInterval(async () => {
      if (this.isExpired()) {
        clearInterval(this.countDownIntervalID)
        try {
          /* TODO */
          let res = await AuthApi.putSecurity({ enable: false })
          let { twoFactorAuth } = res.data
          this.props.update2FA(twoFactorAuth)
          this.props.clearSmsVerifyInProgress()
          this.props.switchToTab(1)
        } catch (err) {
          /* TODO */
        }
      } else {
        this.setState(prevState => ({
          smsExpiredTime: prevState.smsExpiredTime - 1000,
        }))
      }
    }, 1000)
  }

  handleChangeCode = ({ target }) => {
    this.setState({ code: target.value })
  }

  handle2FARegister = success => {
    if (success) {
      swal({
        type: 'success',
        title: translate('security.success'),
      })
      this.props.set2FAStatus(true)
      this.props.set2FAType('sms')
      this.props.clearSmsVerifyInProgress()
      this.props.switchToTab(1)
    } else {
      swal({
        type: 'error',
        title: translate('security.failure'),
      })
      this.props.set2FAStatus(false)
    }
  }

  async handleConfirmSms() {
    try {
      const { code } = this.state
      if (code) {
        this.setState({ stepCurrent: 1 })
        const { success, data } = await userApi.confirmSms('sms', { code })
        this.setState({ stepCurrent: 2 })

        const { twoFactorAuth } = data
        this.props.update2FA(twoFactorAuth)

        let remainTime = moment(twoFactorAuth.expired) - moment()
        this.setState({ smsExpiredTime: remainTime })

        if (success) {
          this.props.switchToOption({ option: 'sms' })
        } else {
          this.setState({ stepCurrent: 0 })
        }
        this.handle2FARegister(success)
      }
    } catch (error) {
      this.setState({ stepCurrent: 0 })
    }
  }
}
