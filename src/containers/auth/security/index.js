import React, { PureComponent } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { autobind } from 'core-decorators'
import Breadcrumb from 'containers/auth/breadcrumb'
import { connectAutoDispatch } from 'redux/connect'
import Clearfix from 'components/elements/clearfix'
import SecurityForm from './security-form/'

@connectAutoDispatch(
  state => ({
    userInfo: state.auth.userInfo,
  }),
  {}
)
@autobind
export default class Security extends PureComponent {
  render() {
    return (
      <PageContainer {...this.props.wrapperProps} style={{ height: '100%' }}>
        <Breadcrumb items={['security']} />
        <Clearfix height={16} />
        <SecurityForm />
      </PageContainer>
    )
  }
}
