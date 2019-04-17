import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import ProvinceApi from 'api/ProvinceApi'
import slug from 'constants/slug'
import ProvinceForm from '../province-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role/index.backup'

@protectRole(ROLE.STATION_AUTO.CREATE)
@autobind
export default class ProvinceCreate extends React.PureComponent {
  async handleSubmit(data) {
    const res = await ProvinceApi.createProvince(data)
    if (res.success) {
      message.info('Add  success!')
      this.props.history.push(slug.province.list)
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <ProvinceForm onSubmit={this.handleSubmit} />
      </PageContainer>
    )
  }
}
