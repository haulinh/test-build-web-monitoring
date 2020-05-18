import React from 'react'
import { Button } from 'antd'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import _ from 'lodash'
import swal from 'sweetalert2'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import userApi from 'api/UserApi'
import authApi from 'api/AuthApi'
import { connectAutoDispatch } from 'redux/connect'
import { update2FA, set2FAStatus } from 'redux/actions/authAction'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const showMsgInfo = msg => {
  msg = msg || ''
  message.info(msg)
}

@connectAutoDispatch(
  state => ({
    user: state.auth.userInfo
  }),
  { update2FA, set2FAStatus }
)
@autobind
export default class ModalSelectOptions extends React.PureComponent {
  static propTypes = {
    /* comp props */
    switchToOption: PropTypes.func.isRequired,
    /* redux props */
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
      <Container>
        <p>{translate('security.message.info')}</p>
        <Button
          onClick={this._handleSelectEmail}
          loading={this.state.isLoadingEmail}
        >
          {translate('security.use.email')}
        </Button>
        <Button
          loading={this.state.isLoadingSms}
          onClick={this._handleSelectSms}
          style={{ marginTop: 16 }}
        >
          {translate('security.use.sms')}
        </Button>
      </Container>
    )
  }

  async _handleSelectSms() {
    this.props.switchToOption('sms')
    this.setState({ isLoadingSms: true })
    try {
      const res = await userApi.getSmsCode('sms')
      const { twoFactorAuth } = res.data
      this.props.update2FA(twoFactorAuth)
    } catch (error) {
      showMsgInfo('ERROR')
    }
    this.setState({ type: 'sms', stepCurrent: 0, isLoadingSms: false })
  }

  async _handleSelectEmail() {
    this.props.switchToOption('email')
    try {
      this.setState({ isLoadingEmail: true })
      const { success } = await authApi.putSecurity({ enable: true })
      this.setState({ type: 'email', isLoadingEmail: false })
      this._showhandleInfo(success)
    } catch (error) {
      return false
    }
  }

  _showhandleInfo = type => {
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
}
