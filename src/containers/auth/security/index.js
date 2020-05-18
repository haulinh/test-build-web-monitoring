import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
// import AuthApi from 'api/AuthApi'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
// import { Spin, Icon } from 'antd'
import Breadcrumb from 'containers/auth/breadcrumb'
import { connectAutoDispatch } from 'redux/connect'
import SecurityForm from './security-form/'

@connectAutoDispatch(
  state => ({
    userInfo: state.auth.userInfo
  }),
  {}
)
@autobind
export default class Security extends PureComponent {
  render() {
    return (
      <PageContainer {...this.props.wrapperProps} style={{ height: '100%' }}>
        <Breadcrumb items={['security']} />
        <SecurityForm />
      </PageContainer>
    )
  }
}
