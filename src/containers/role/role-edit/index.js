import React, { PureComponent } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'
import RoleForm from 'containers/role/role-form'
import Breadcrumb from 'containers/role/breadcrumb'
import Clearfix from 'components/elements/clearfix'
import RoleApi from 'api/RoleApi'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { get as _get } from 'lodash'
import { message } from 'antd'
import { translate } from 'hoc/create-lang'

@withRouter
@protectRole(ROLE.ROLE.EDIT)
@autobind
export default class RoleEdit extends PureComponent {
  static propTypes = {}

  state = {
    isLoaded: false,
    dataEdit: [],
  }

  async componentWillMount() {
    const _id = this.props.match.params._id
    const record = await RoleApi.getRole(_id)
    if (record.error) {
      message.error(translate('addon.error'))
    } else {
      this.setState({
        isLoaded: true,
        dataEdit: { ...record.data, menu: [_get(record.data, 'menu')] },
      })
    }
  }

  async onSubmit(values) {
    const data = {
      name: values.name,
      description: values.description,
      menu: values.menu[0],
    }
    const _id = this.props.match.params._id
    const record = await RoleApi.updateRole(_id, data)
    if (record.error) {
      message.error(translate('addon.onSave.update.error'))
    } else {
      message.success(translate('addon.onSave.update.success'))
      // this.props.history.push(slug.role.base)
    }
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list', 'edit']} />
        <Clearfix height={16} />
        {this.state.isLoaded && (
          <RoleForm
            onSubmit={this.onSubmit}
            initialValues={this.state.dataEdit}
          />
        )}
      </PageContainer>
    )
  }
}
