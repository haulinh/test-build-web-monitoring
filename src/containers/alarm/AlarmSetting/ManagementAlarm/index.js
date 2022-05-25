import RoleApi from 'api/RoleApi'
import UserApi from 'api/UserApi'
import { get } from 'lodash'
import React, { Component } from 'react'
import StationAlarmListGroup from './StationAlarmListGroup'

export default class ManagementAlarm extends Component {
  state = {
    users: [],
    roles: [],
  }
  componentDidMount = async () => {
    await Promise.all([this.getRoles(), this.getUsers()])
  }

  getUsers = async () => {
    try {
      const result = await UserApi.searchUser()
      const users = get(result, 'data', []).filter(
        item => !get(item, 'removeStatus.allowed')
      )
      if (result.success) {
        this.setState({ users })
      }
    } catch (error) {
      console.error({ error })
    }
  }

  getRoles = async () => {
    try {
      const result = await RoleApi.getRoles()
      if (result.success) {
        this.setState({ roles: result.data })
      }
    } catch (error) {
      console.error({ error })
    }
  }

  render() {
    const { users, roles } = this.state

    return (
      <div
        style={{
          border: '1px solid #F3F4F6',
          borderRadius: '4px',
        }}
      >
        <StationAlarmListGroup
          users={users}
          roles={roles}
          stationTypeName="Nước thải công nghiệp"
        />
      </div>
    )
  }
}
