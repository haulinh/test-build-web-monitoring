import { Skeleton } from 'antd'
import RoleApi from 'api/RoleApi'
import UserApi from 'api/UserApi'
import { get, groupBy } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAlarms } from 'redux/actions/alarm'
import StationAlarmListGroup from './StationAlarmListGroup/index'

@connect(
  state => ({
    stationAutos: get(state, ['stationAuto', 'list']),
    alarmList: get(state, ['alarm', 'alarmList']),
  }),
  {
    getAlarms,
  }
)
export default class ManagementAlarm extends Component {
  state = {
    users: [],
    roles: [],
    isLoading: false,
  }
  componentDidMount = async () => {
    const { getAlarms } = this.props

    this.setState({ isLoading: true })
    await Promise.all([this.getRoles(), this.getUsers(), getAlarms()])
    this.setState({ isLoading: false })
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

  getStationGroupByType = () => {
    const { stationAutos } = this.props
    const stationAutosGroupByType = stationAutos.reduce((base, current) => {
      const stationType = get(current, ['stationType'])
      const stationTypeKey = stationType.key

      if (base[stationTypeKey]) {
        return {
          ...base,
          [stationTypeKey]: {
            stationTypeKey,
            stationTypeName: stationType.name,
            stationAutoList: [...base[stationTypeKey].stationAutoList, current],
          },
        }
      }

      return {
        ...base,
        [stationTypeKey]: {
          stationTypeKey,
          stationTypeName: stationType.name,
          stationAutoList: [current],
        },
      }
    }, {})

    return stationAutosGroupByType
  }

  render() {
    const { users, roles, isLoading } = this.state
    const { alarmList } = this.props

    const stationAutosGroupByType = this.getStationGroupByType()
    const alarmsGroupByStationId = groupBy(alarmList, 'stationId')

    return (
      <div
        style={{
          border: '1px solid #F3F4F6',
          borderRadius: '4px',
        }}
      >
        <Skeleton loading={isLoading} active>
          {Object.values(stationAutosGroupByType).map(stationType => (
            <StationAlarmListGroup
              stationAutoList={stationType.stationAutoList}
              key={stationType.stationTypeKey}
              users={users}
              roles={roles}
              stationTypeName={stationType.stationTypeName}
              alarmsGroupByStationId={alarmsGroupByStationId}
            />
          ))}
        </Skeleton>
      </div>
    )
  }
}
