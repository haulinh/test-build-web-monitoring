import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Col } from 'antd'
import _ from 'lodash'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { connectAutoDispatch } from 'redux/connect'
import { set2FAStatus } from 'redux/actions/authAction'
import AuthApi from 'api/AuthApi'


/* MARK  @translate */
const i18n = {
  enable2FA: translate('security.enable2FA'),
  disable2FA: translate('security.disable2FA'),
}


@connectAutoDispatch(
  (state) => ({
    enable: state.auth.userInfo.twoFactorAuth.enable
  }),
  { set2FAStatus }
)
@autobind
export default class SecurityForm extends PureComponent {
  static propTypes = {
    enable: PropTypes.bool.isRequired
  }

  state = {
    isSwitchingStatus: false
  }

  render() {
    return this.props.enable 
      ? this._renderDisableButton()
      : this._renderEnableButton() 
  }

  _renderDisableButton() {
    return (
      <Row type="flex" justify="center" align="top" style={{height: 150, marginTop: 50}}>
        <Col>
          <Button 
            type="danger"
            loading={this.state.isSwitchingStatus} 
            onClick={this._handleDisable2FA}
            >{i18n.disable2FA}
          </Button>
        </Col>
        <Col>
          <span style={{ color: 'green', fontWeight: '600', marginTop: 20 }}>
            {translate('security.message.userUse', {
              type:
                _.get(
                  this.props,
                  'twoFactorAuth.type',
                  'email'
                ) === 'sms'
                  ? 'SMS'
                  : 'Email'
            })}
          </span>
        </Col>
      </Row>
    )
  }

  _renderEnableButton() {
    return (
      <Row type="flex" justify="center" align="top" style={{height: 150, marginTop: 50}}>
        <Col>
          <Button type="primary" onClick={this._handleEnable2FA}>{i18n.enable2FA}</Button>
        </Col>
        <Col>
          <span style={{marginTop: 20}}>{translate('security.note')}</span>
        </Col>
      </Row>
    )
  }

  _handleEnable2FA() {
    this.props.switchToTab(2)
  }

  async _handleDisable2FA() {
    try {
      this.setState({isSwitchingStatus: true})
      let { success } = await AuthApi.putSecurity({ enable: false })
      this.setState({isSwitchingStatus: false})
      if (success) return this.props.set2FAStatus(false)
    } catch (error) {
      console.log("eror putSucurity", error)
      this.setState({isSwitchingStatus: false})
    }
  }
}