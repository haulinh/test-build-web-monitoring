import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Select, Card, Avatar } from 'antd'
import { autobind } from 'core-decorators'
import swal from 'sweetalert2'
import _ from 'lodash'

import { translate } from 'hoc/create-lang'
import UserApi from 'api/UserApi'
import RoleApi from 'api/RoleApi'

const { Option } = Select
const { Meta } = Card

const i18n = {
  create: translate('addon.create'),
  error: translate("addon.error"),
  roleAssign: translate('userManager.list.roleAssign')
}

const BACKGROUND_COLORS = [ '#87d068', '#f56a00', '#7265e6', '#ffbf00', '#00a2ae' ]


@autobind
export default class UserSearchForm extends React.PureComponent {
  static propTypes = {
    updateDataForSubmit: PropTypes.func.isRequired
  }

  static defaultProps= { }

  state = {
    isGettingUsers: false,
    isGettingRoles: false,
    dataSourceUsers: [],
    dataSourceRoles: [],
  }

  componentDidMount() {
    this.getUsers()
    this.getRoles()
  }

  render() {
    return (
      <Row type="flex" gutter={100} justify="space-around">
        <Col span={12}>
          <Select
            style={{width: '100%'}} 
            loading={this.state.isGettingUsers}
            optionLabelProp="label"
            onSelect={this.handleSelectUser}
            showSearch
            optionFilterProp="search"
            filterOption={this.handleFilter}
          >
            {this.state.dataSourceUsers.map((user, index) => (
              <Option key={user._id} value={user._id} label={user.email} search={`${user.lastName} ${user.firstName}`}>
                <Meta
                  avatar={
                    <Avatar 
                      // size="large"
                      icon="user"
                      src={user.avatar}
                      style={{ backgroundColor: BACKGROUND_COLORS[index % BACKGROUND_COLORS.length], marginTop: 5}}
                    />
                  }
                  style={{padding: '5px 0'}}
                  title={user.email}
                  description={`${user.lastName} ${user.firstName}`}
                />
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select 
            style={{width: '100%'}} 
            loading={this.state.isGettingRoles}
            onSelect={this.handleSelectRole}
            showSearch
            optionFilterProp="search"
            filterOption={this.handleFilter}
            // defaultValue={}
          >
            {this.state.dataSourceRoles.map(role => (
              <Option key={role._id} value={role._id} search={role.name}>{role.name}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    )
  }

  componentDidCatch() {
    swal({
      title: i18n.error,
      type: 'error'
    })
  }

  handleFilter(input, option) {
    let regex = new RegExp(input, 'gi')
    return regex.test(option.props.search)
  }

  handleSelectUser(userID) {
    let user = _.find(this.state.dataSourceUsers, user => user._id === userID)
    this.props.updateDataForSubmit({name: 'selectedUser', value: user})
  }

  handleSelectRole(roleID) {
    let role = _.find(this.state.dataSourceRoles, role => role._id === roleID)
    this.props.updateDataForSubmit({name: 'selectedRole', value: role})
  }

  /* NOTE */
  async getUsers() {
    this.setState({
      isGettingUsers: true,
    })

    let resUsers = await UserApi.searchUser()

    this.setState({
      isGettingUsers: false,
      dataSourceUsers: _.get(resUsers, 'data', []),
    })
  }

  /* NOTE */
  async getRoles() {
    this.setState({
      isGettingRoles: true,
    })

    let resRoles = await RoleApi.getRoles()

    this.setState({
      isGettingRoles: false,
      dataSourceRoles: _.get(resRoles, 'data', []),
    })
  }
}
