import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { Row, Button, Input, Col, Form } from 'antd'
// import swal from 'sweetalert2'
// import _ from 'lodash'
import AuthApi from 'api/AuthApi'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { connectAutoDispatch } from 'redux/connect'
const FormItem = Form.Item

/* MARK  @translate */
function i18n() {
  return {
    enterYourPwd: translate('security.enterPassword'),
    confirmPwd: translate('security.confirm'),
    confirmPwdLabel: translate('security.confirmPasswordLabel'),
    confirmPwdError: translate('security.confirmPasswordError'),
  }
}

@connectAutoDispatch(
  state => ({
    email: state.auth.userInfo.email,
  }),
  {}
)
@Form.create()
@autobind
export default class SecurityFormConfirm extends PureComponent {
  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      isConfirmPassword: false,
      confirmPasswordInfo: {
        hasFeedback: true,
        validateStatus: 'default',
        help: '',
      },
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { isConfirmPassword, confirmPasswordInfo } = this.state

    return (
      <Form layout="vertical" onSubmit={this._handleSubmtCheckPassword}>
        <Row type="flex">
          <Col style={{ textAlign: 'center' }} span={24}>
            <Button disabled shape="round">
              {this.props.email}
            </Button>
          </Col>
          <Col span={24} style={{ marginTop: 30 }}>
            <FormItem label={i18n().confirmPwdLabel} {...confirmPasswordInfo}>
              {getFieldDecorator('password', {
                initialValue: '',
              })(
                <Input.Password
                  size="large"
                  placeholder={i18n().enterYourPwd}
                  autoComplete="off"
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <Button
              block
              type="primary"
              loading={isConfirmPassword}
              disabled={!getFieldValue('password')}
              htmlType="submit"
            >
              {i18n().confirmPwd}
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  async _handleSubmtCheckPassword(e) {
    e.preventDefault()
    const { getFieldValue } = this.props.form

    const { email } = this.props
    const password = getFieldValue('password')

    try {
      this.setState({ isConfirmPassword: true })
      const res = await AuthApi.checkPassword({ email, password })
      if (res.data.isPasswordMatch) {
        this.props.switchToTab(3)
      } else {
        this.setState({
          confirmPasswordInfo: {
            ...this.state.confirmPasswordInfo,
            validateStatus: 'error',
            help: i18n().confirmPwdError,
          },
        })
      }
    } catch (error) {
      console.log(error.response.data.error)
    }

    this.setState({ isConfirmPassword: false })
  }
}
