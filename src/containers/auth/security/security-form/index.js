import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Tabs } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { autobind } from 'core-decorators'
import { connectAutoDispatch } from 'redux/connect'
import ModalActive from './tabs/modal-select'
import Enable2FA from './tabs/enable-2fa'
import ConfirmPssword2FA from './tabs/confirm-pwd'
const TabPane = Tabs.TabPane

@connectAutoDispatch(
  (state) => ({}),
  {}
)
@autobind
export default class SecurityForm extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    userInfo: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      isConfirmPassword: false,
      isSmsVerifyInProgress: false,
      activeTabKey: "1",
      confirmPasswordInfo: {
        hasFeedback: true,
        validateStatus: "default",
        help: '',
      },
    }
  }

  /* nếu chưa hết hạn sms thì di chuyển đến form nhập code sms */
  componentDidMount() {
    const { twoFactorAuth } = this.props.userInfo
    if (!twoFactorAuth) {
      this.props.userInfo.twoFactorAuth = {
        enable: false,
        code: ''
      }
    }
    const { code, enable, expired } = this.props.userInfo.twoFactorAuth
    const isExpired = moment().isSameOrAfter(moment(expired))
    const isSmsVerifyInProgress = !enable && code != '' && !isExpired
    if (isSmsVerifyInProgress) {
      this.setState({
        activeTabKey: 3,
        isSmsVerifyInProgress: true
      })
    }
  }

  render() {
    return (
      <Row type="flex" justify='center' style={{height: '100%'}}>
         <Card
          style={{ width: 450 }}
          cover={
            <img
              alt="example"
              src="https://www.gstatic.com/identity/boq/accountsettingsmobile/recovery_scene_316x112_a71256f365c17ad4f8a1b82c5b03a173.png"
            />
          }
        >
          <Tabs activeKey={`${this.state.activeTabKey}`} renderTabBar={() => <div></div>}>
            <TabPane key="1">
              <Enable2FA 
                handleClick2FAButton={this.handleClick2FAButton}
                switchToTab={this._switchToTab}
              />
            </TabPane>
            <TabPane key="2">
              <ConfirmPssword2FA 
                switchToTab={this._switchToTab}
              />
            </TabPane>
            <TabPane key="3">
              <ModalActive
                isSmsVerifyInProgress={this.state.isSmsVerifyInProgress}
                onSuccess={this.handle2FARegister}
                switchToTab={this._switchToTab}
              />
            </TabPane>
          </Tabs>
        </Card>
      </Row>
    )
  }

  _switchToTab(tab) {
    this.setState({activeTabKey: tab})
  }
}