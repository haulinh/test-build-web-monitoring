import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import { Row } from 'antd'
import { autobind } from 'core-decorators'
import { connectAutoDispatch } from 'redux/connect'
import { set2FAStatus } from 'redux/actions/authAction'
import CompSMS from './sms'
import CompOptions from './options'

@connectAutoDispatch(
  state => ({
    user: state.auth.userInfo,
  }),
  { set2FAStatus }
)
@autobind
export default class ModalSelect extends React.PureComponent {
  static propTypes = {
    /* comp props */
    switchToTab: PropTypes.func.isRequired,
    isSmsVerifyInProgress: PropTypes.bool.isRequired,
    /* redux props */
    user: PropTypes.object.isRequired,
    set2FAStatus: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      option: null,
      isSmsVerifyInProgress: false,
    }
  }

  /* nếu chưa hết hạn sms thì di chuyển đến form nhập code sms */
  componentDidMount() {
    const { twoFactorAuth } = this.props.user
    const { code, enable, expired } = twoFactorAuth
    const isExpired = moment().isSameOrAfter(moment(expired))
    const isSmsVerifyInProgress = !enable && code !== '' && !isExpired
    if (isSmsVerifyInProgress) {
      this.setState({
        isSmsVerifyInProgress: true,
      })
    }
  }

  render() {
    return (
      <Row>
        {/*
          NOTE  logic
          Nếu đã có code, còn hạn mà chưa nhập code thì show form sms
          ngoài ra show form action
        */
        this.state.isSmsVerifyInProgress || this.state.option === 'sms' ? (
          <CompSMS
            switchToOption={this._switchToOption}
            clearSmsVerifyInProgress={this._clearSmsVerifyInProgress}
            {...this.props}
          />
        ) : (
          <CompOptions switchToOption={this._switchToOption} {...this.props} />
        )}
      </Row>
    )
  }

  _switchToOption(option) {
    this.setState({ option })
  }

  _clearSmsVerifyInProgress() {
    this.setState({ isSmsVerifyInProgress: false })
  }
}
