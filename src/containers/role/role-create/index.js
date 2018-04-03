import React, { PureComponent } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'
import swal from 'sweetalert2'
import slug from 'constants/slug'
import RoleForm from 'containers/role/role-form'
import Breadcrumb from 'containers/role/breadcrumb'
import RoleApi from 'api/RoleApi'
import AuthApi from 'api/AuthApi'
import PropTypes from 'prop-types'

@withRouter
@autobind
export default class RoleCreate extends PureComponent {
  static propTypes = {}

  async onSubmit(values) {
    const data = {
      name: values.name,
      description: values.description,
      menu: values.menu
    }
    const record = await RoleApi.createRole(data)
    if (record.error) {
      swal({
        title: 'Error',
        type: 'error',
        text: record.message
      })
    } else {
      swal({
        title: 'success',
        type: 'success'
      }).then(() => {
        this.props.history.push(slug.role.base)
      })
    }
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'create']} />
        <RoleForm onSubmit={this.onSubmit} />
      </PageContainer>
    )
  }
}