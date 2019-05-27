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
import { set2FAStatus } from 'redux/actions/authAction'
import CompSMS from './sms'
import CompOptions from './options'

const Step = Steps.Step

const RESET_2FA_SMS = 60 * 10

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

const Text = styled.p``

@connectAutoDispatch(
  (state) => ({
    user: state.auth.userInfo
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
    set2FAStatus: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      option: null,
      isSmsVerifyInProgress: this.props.isSmsVerifyInProgress,
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
          this.state.isSmsVerifyInProgress || this.state.option === 'sms'
          ? <CompSMS switchToOption={this._switchToOption} clearSmsVerifyInProgress={this._clearSmsVerifyInProgress} {...this.props}/>
          : <CompOptions switchToOption={this._switchToOption} {...this.props}/>
        }
      </Row>
    )
  }

  _switchToOption(option) {
    this.setState({ option })
  }

  _clearSmsVerifyInProgress() {
    this.setState({isSmsVerifyInProgress: false})
  }
}
