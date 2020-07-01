import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import QCVNApi from 'api/QCVNApi'
import slug from 'constants/slug'
import QCVNForm from '../qcvn-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'

@protectRole(ROLE.STATION_AUTO.CREATE)
export default class QCVNCreate extends React.PureComponent {
  state = {
    isLoading: false,
  }
  handleSubmit = async data => {
    this.setState({ isLoading: true })
    const res = await QCVNApi.createQCVN(data)
    this.setState({ isLoading: false })
    if (res.success) {
      // message.info('Add measuring success!')
      message.success(translate('qcvn.create.success'))
      this.props.history.push(slug.qcvn.list)
    }
    return res
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <QCVNForm
          isLoading={this.state.isLoading}
          onSubmit={this.handleSubmit}
        />
      </PageContainer>
    )
  }
}
