import { Avatar, Card, Select } from 'antd'
import UserApi from 'api/UserApi'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React, { Component } from 'react'

function i18n() {
  return {
    selectUser: translate('userManager.form.placeholder.selectUser'),
  }
}

const { Option } = Select
const { Meta } = Card

const BACKGROUND_COLORS = [
  '#87d068',
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
]

export default class SelectUser extends Component {
  state = {
    isGettingUsers: false,
    dataSourceUsers: [],
  }
  componentDidMount() {
    this.getUsers()
  }

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

  render() {
    return (
      <Select
        {...this.props}
        placeholder={i18n().selectUser}
        style={{ width: '100%' }}
        loading={this.state.isGettingUsers}
        optionLabelProp="label"
        onSelect={this.handleSelectUser}
        showSearch
        optionFilterProp="search"
        filterOption={this.handleFilter}
      >
        {this.state.dataSourceUsers.map((user, index) => (
          <Option
            key={user._id}
            value={user._id}
            label={`${user.lastName} ${user.firstName}`}
            search={`${user.lastName} ${user.firstName}`}
          >
            <Meta
              avatar={
                <Avatar
                  // size="large"
                  icon="user"
                  src={user.avatar}
                  style={{
                    backgroundColor:
                      BACKGROUND_COLORS[index % BACKGROUND_COLORS.length],
                    marginTop: 5,
                  }}
                />
              }
              style={{ padding: '5px 0' }}
              title={user.email}
              description={`${user.lastName} ${user.firstName}`}
            />
          </Option>
        ))}
      </Select>
    )
  }
}
