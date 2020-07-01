import React, { PureComponent } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'
import slug from 'constants/slug'
import RoleForm from 'containers/role/role-form'
import Breadcrumb from 'containers/role/breadcrumb'
import RoleApi from 'api/RoleApi'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import Clearfix from 'components/elements/clearfix'
import { message } from 'antd'
import { translate } from 'hoc/create-lang'

@withRouter
@protectRole(ROLE.ROLE.CREATE)
@autobind
export default class RoleCreate extends PureComponent {
  state = {
    isLoading: false,
  }
  static propTypes = {}

  async onSubmit(values) {
    const data = {
      name: values.name,
      description: values.description,
      menu: values.menu[0],
    }
    this.setState({ isLoading: true })
    const record = await RoleApi.createRole(data)
    this.setState({ isLoading: false })
    if (record.error) {
      message.error(translate('roleManager.create.error'))
    }
    if (record.success) {
      message.success(translate('roleManager.create.success'))
      this.props.history.push(slug.role.base)
    }
    return record
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <RoleForm submitting={this.state.isLoading} onSubmit={this.onSubmit} />
      </PageContainer>
    )
  }
}
