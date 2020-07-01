import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { message } from 'antd'
import { autobind } from 'core-decorators'
import ProvinceApi from 'api/ProvinceApi'
import slug from 'constants/slug'
import ProvinceForm from '../province-form'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'

@protectRole(ROLE.PROVINCE.CREATE)
@autobind
export default class ProvinceCreate extends React.PureComponent {
  state = {
    isLoading: false,
  }
  async handleSubmit(data) {
    this.setState({ isLoading: true })
    const res = await ProvinceApi.createProvince(data)
    this.setState({ isLoading: false })
    if (res.success) {
      message.success(translate('province.create.success'))
      this.props.history.push(slug.province.list)
    }
    return res
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <ProvinceForm
          isLoading={this.state.isLoading}
          onSubmit={this.handleSubmit}
        />
      </PageContainer>
    )
  }
}
