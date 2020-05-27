import React, { PureComponent } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'
import swal from 'sweetalert2'
import slug from 'constants/slug'
import RoleForm from 'containers/role/role-form'
import Breadcrumb from 'containers/role/breadcrumb'
import RoleApi from 'api/RoleApi'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import Clearfix from 'components/elements/clearfix'

@withRouter
@protectRole(ROLE.ROLE.CREATE)
@autobind
export default class RoleCreate extends PureComponent {
  static propTypes = {}

  async onSubmit(values) {
    const data = {
      name: values.name,
      description: values.description,
      menu: values.menu[0]
    }
    const record = await RoleApi.createRole(data)
    if (record.success) {
      swal({
        title: 'success',
        type: 'success'
      }).then(() => {
        this.props.history.push(slug.role.base)
      })
    }
    return record
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'create']} />
        <Clearfix height={16} />
        <RoleForm onSubmit={this.onSubmit} />
      </PageContainer>
    )
  }
}
