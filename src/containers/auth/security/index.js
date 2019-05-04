import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'antd'
import swal from 'sweetalert2'
import objectPath from 'object-path'
import AuthApi from 'api/AuthApi'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import Breadcrumb from 'containers/auth/breadcrumb'
import { fetchUserMe } from 'redux/actions/authAction'
import { connectAutoDispatch } from 'redux/connect'
import styled from 'styled-components'
import ModalActive from './modal-select'
import * as _ from 'lodash'

const Note = styled.i`
  font-size: 12px;
`

@autobind
export class SecurityForm extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    initialValues: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      enable: objectPath.get(props.initialValues, 'twoFactorAuth.enable')
    }
  }

  async handleUpdate (enable) {
    try {
      const { success } = await AuthApi.putSecurity({enable})
      return !!success
    } catch (error) {
      return false
    }
  }

  handleClose = () => {
    this.setState({isVisible: false, enable: this.state.enable})
  }

  handleOpen = () => {
    this.setState({isVisible: true})
  }

  handleSuccess = status => {
    this.setState({ isVisible: false, enable: true })
    if (status) {
      swal({
        type: 'success',
        title: translate('security.success')
      })
    } else {
      swal({
        type: 'error',
        title: translate('security.failure')
      })
    }
  }

  _render2FA_Note () {
    if (_.get(this.props, 'initialValues.twoFactorAuth.enable', false)) {
      return <div>
        <Note style={{ color: 'red', fontWeight: '600' }}>{
            translate('security.message.userUse', {
              type: _.get(this.props, 'initialValues.twoFactorAuth.type', 'email') === 'sms' ? 'SMS' : 'Email' })
          }</Note>
      </div>
    }
    return null
  }

  render() {
    return (
      <div>
        <strong>{translate('security.label')} </strong>
        <Switch
          checkedChildren="On"
          unCheckedChildren="Off"
          checked={this.state.enable}
          onChange={checked => {
            if (checked) {
              this.handleOpen()
            } else {
              let isSuccess = this.handleUpdate(false)
              if (isSuccess) return this.setState({enable: false})
              return
            }
          }}
        />
        {this._render2FA_Note()}
        <div>
          <Note>{translate('security.note')}</Note>
        </div>
        <ModalActive user={this.props.initialValues} onSuccess={this.handleSuccess} visible={this.state.isVisible} onCancel={this.handleClose}/>
      </div>
    )
  }
}

@connectAutoDispatch(state => ({}), { fetchUserMe })
@autobind
export default class Security extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      isLoaded: false
    }
  }

  async componentWillMount() {
    const record = await AuthApi.getMe()
    this.setState({
      userInfo: {
        ...record.data
      },
      isLoaded: true
    })
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['security']} />
        {this.state.isLoaded && (
          <SecurityForm
            initialValues={this.state.userInfo}
          />
        )}
      </PageContainer>
    )
  }
}
