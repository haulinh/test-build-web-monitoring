import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import QCVNApi from 'api/QCVNApi'
import slug from 'constants/slug'
import QCVNForm from '../qcvn-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

@protectRole(ROLE.STATION_AUTO.CREATE)
@autobind
export default class QCVNCreate extends React.PureComponent {
  async handleSubmit(data) {
    const res = await QCVNApi.createQCVN(data)
    if (res.success) {
      message.info('Add measuring success!')
      this.props.history.push(slug.qcvn.list)
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <QCVNForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
