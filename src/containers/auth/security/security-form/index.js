import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Button, Tabs, Input, Col,Form } from 'antd'
import swal from 'sweetalert2'
import objectPath from 'object-path'
import moment from 'moment'
import _ from 'lodash'
import AuthApi from 'api/AuthApi'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { connectAutoDispatch } from 'redux/connect'
import ModalActive from './modal-select'
const TabPane = Tabs.TabPane
const FormItem = Form.Item

/* MARK  @translate */
const i18n = {
  enterYourPwd: '--Enter your password',
  confirmPwd: '--Confirm',
  confirmPwdLabel: "--To continue, first verify it's you",
  confirmPwdError: '--Password not match',
  disable2FA: '--Disable 2FA',
  enable2FA: '--Enable 2FA',
}


@connectAutoDispatch(
  (state) => ({
    email: state.auth.userInfo.email
  }),
  {}
)
@Form.create()
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
      enable: objectPath.get(props.userInfo, 'twoFactorAuth.enable'),
      activeTabKey: "1",
      confirmPasswordInfo: {
        hasFeedback: true,
        validateStatus: "default",
        help: '',
      },
    }
  }

  /* nếu chưa hết hạn sms thì di chuyển đến form sms */
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
    console.log(this, "fdsfsfadsfasf----")
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
            <TabPane key="1">{this._render2FAEnable()}</TabPane>
            <TabPane key="2">{this._render2FAConfirmPassword()}</TabPane>
            <TabPane key="3">{this._render2FAOptions()}</TabPane>
          </Tabs>
        </Card>
      </Row>
    )
  }

  _render2FAEnable = () => {
    return this.state.enable ? (
      <Row type="flex" justify="center" align="top" style={{height: 150, marginTop: 50}}>
        <Col>
          <Button type="danger" onClick={() => this.handleClick2FAButton(false)}>{i18n.disable2FA}</Button>
        </Col>
        <Col>
          <span style={{ color: 'green', fontWeight: '600', marginTop: 20 }}>
            {translate('security.message.userUse', {
              type:
                _.get(
                  this.props,
                  'userInfo.twoFactorAuth.type',
                  'email'
                ) === 'sms'
                  ? 'SMS'
                  : 'Email'
            })}
          </span>
        </Col>
      </Row>
    ) : (
      <Row type="flex" justify="center" align="top" style={{height: 150, marginTop: 50}}>
        <Col>
          <Button type="primary" onClick={() => this.handleClick2FAButton(true)}>{i18n.enable2FA}</Button>
        </Col>
        <Col>
          <span style={{marginTop: 20}}>{translate('security.note')}</span>
        </Col>
      </Row>
    )
  }

  _render2FAConfirmPassword() {
    const {getFieldDecorator, getFieldValue} = this.props.form
    const {isConfirmPassword, confirmPasswordInfo} = this.state

    return (
      <Form layout="vertical" onSubmit={this._handleSubmtCheckPassword}>
        <Row type="flex">
          <Col style={{textAlign: "center"}} span={24}>
            <Button disabled shape="round">{this.props.email}</Button>
          </Col>
          <Col span={24} style={{marginTop: 30}}>
            <FormItem 
              label={i18n.confirmPwdLabel}
              {...confirmPasswordInfo}
            >
            {getFieldDecorator('password', {
              initialValue: '',
            })(
              <Input size="large" placeholder={i18n.enterYourPwd} />
            )}
            </FormItem>
          </Col>
          <Col span={24}>
            <Button block type="primary" 
              loading={isConfirmPassword}
              disabled={!getFieldValue('password')}
              htmlType="submit">
              {i18n.confirmPwd}
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  _render2FAOptions() {
    return (
      <Row>
        <ModalActive
          isSmsVerifyInProgress={this.state.isSmsVerifyInProgress}
          user={this.props.userInfo}
          onSuccess={this.handle2FARegister}
        />
      </Row>
    )
  }

  async handleUpdate(enable) {
    try {
      const { success } = await AuthApi.putSecurity({ enable })
      return !!success
    } catch (error) {
      return false
    }
  }

  handle2FARegister = type => {
    if (type) {
      this.setState({ 
        enable: true,
        activeTabKey: 1
       })
      swal({
        type: 'success',
        title: translate('security.success')
      })
    } else {
      this.setState({ enable: false })
      swal({
        type: 'error',
        title: translate('security.failure')
      })
    }
  }

  handleClick2FAButton = (value) => {
    if (value) { //enable active
      /* TODO  handle enable 2fa */
      this.setState({activeTabKey: 2})
    }
    else {
      /* TODO  handle disable 2fa */
      let isSuccess = this.handleUpdate(false)
      if (isSuccess) return this.setState({ enable: false })
    }
  }

  async _handleSubmtCheckPassword(e) {
    e.preventDefault()
    const {getFieldValue} = this.props.form

    const {email} = this.props
    const password = getFieldValue('password')

    try {
      this.setState({isConfirmPassword: true})
      const res = await AuthApi.checkPassword({email, password})
      if (res.data.isPasswordMatch) {
        this.setState({activeTabKey: 3})
      }
      else {
        this.setState({
          confirmPasswordInfo: {
            ...this.state.confirmPasswordInfo,
            validateStatus: "error",
            help: i18n.confirmPwdError,
          }
        })
      }
    }
    catch(error) {
      console.log(error.response.data.error)
    }

    this.setState({isConfirmPassword: false})
  }
}