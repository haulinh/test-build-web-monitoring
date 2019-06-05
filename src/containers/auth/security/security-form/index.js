import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Tabs } from 'antd'
// import _ from 'lodash'
import { autobind } from 'core-decorators'
import { connectAutoDispatch } from 'redux/connect'
import ModalActive from './tabs/modal-select/'
import Enable2FA from './tabs/enable-2fa'
import ConfirmPssword2FA from './tabs/confirm-pwd'
const TabPane = Tabs.TabPane

@connectAutoDispatch(
  (state) => ({
    userInfo: state.auth.userInfo
  }),
  {}
)
@autobind
export default class SecurityForm extends PureComponent {
  static propTypes = {
    /* comp's props */
    onChange: PropTypes.func,
    /* redux's props */
    userInfo: PropTypes.object.isRequired
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

  render() {
    return (
      <Row type="flex" justify='center' style={{height: '100%'}}>
        <Card
          style={{ width: 450 }}
          cover={
            <img
              alt="example"
              src="/images/2fa.png"
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
            <TabPane key="2" forceRender>
              <ConfirmPssword2FA 
                switchToTab={this._switchToTab}
              />
            </TabPane>
            <TabPane key="3" forceRender>
              <ModalActive
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