import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Button, Icon } from 'antd'
import { autobind } from 'core-decorators'
import UserApi from 'api/UserApi'
import UserForm from '../user-form'
import slug from '/constants/slug'
import createManagerEdit from 'hoc/manager-edit'
import PropTypes from 'prop-types'
import Breadcrumb from '../breadcrumb'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

@protectRole(ROLE.USER.EDIT)
@createManagerEdit({
  apiUpdate: UserApi.updateOne,
  apiGetByKey: UserApi.getOne,
})
@autobind
export default class UserEdit extends React.PureComponent {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  async handleSubmit(data) {
    await this.props.onUpdateItem(data)
  }

  //Su kien truoc khi component duoc tao ra
  async componentWillMount() {
    this.props.getItem()
  }

  // Su kien xoa measuring
  deleteStationType() {
    const key = this.props.match.params.key
    this.props.onDeleteItem(key, () => {
      this.props.history.push(slug.stationType.list)
    })
  }

  buttonDelete() {
    return (
      <div>
        <Button type="primary" onClick={this.deleteStationType}>
          <Icon type="delete" />
          Delete
        </Button>
      </div>
    )
  }

  render() {
    return (
      <PageContainer button={this.buttonDelete()} {...this.props.wrapperProps}>
        <Breadcrumb
          items={[
            'list',
            {
              id: 'edit',
              name: this.props.isLoaded ? this.props.data.email : null,
            },
          ]}
        />
        {this.props.isLoaded && this.props.data && (
          <UserForm
            initialValues={this.props.data}
            onSubmit={this.handleSubmit}
            isEdit
            isLoading={this.state.isLoading}
          />
        )}
      </PageContainer>
    )
  }
}
