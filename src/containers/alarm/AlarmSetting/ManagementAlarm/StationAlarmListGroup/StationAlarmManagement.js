import { Row, Tabs as TabsAnt } from 'antd'
import {
  // AdvancedIcon,
  DeviceIcon,
  SignalIcon,
  ThresholdIcon,
} from 'assets/icons-alarm'
import React, { Component } from 'react'
import styled from 'styled-components'
import AlarmExceed from './AlarmType/Exceed'
import AlarmDisconnect from './AlarmType/AlarmDisconnect'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import measuring from 'containers/manager/measuring'
import { groupBy } from 'lodash'
import { AlarmType } from '../../constants'

const { TabPane } = TabsAnt

const Tabs = styled(TabsAnt)`
  .ant-tabs-nav-scroll {
    display: flex;
    justify-content: center;
  }

  .ant-collapse-content {
    border-top: unset;
  }
  .ant-tabs-bar {
    border-bottom: unset;
  }
`
@connect(state => ({
  stationAutos: get(state, 'stationAuto.list'),
}))
export default class StationAlarmManagement extends Component {
  render() {
    const { users, roles, alarmList, stationAutos, _id } = this.props
    const measuringList = get(
      stationAutos.find(station => station._id === _id),
      'measuringList'
    )

    const measuringListStation = measuringList.map(measuring => ({
      id: uuidv4(),
      ...measuring,
    }))

    const alarmGroupByType = groupBy(alarmList, 'type')

    console.log(alarmList)
    return (
      <Tabs defaultActiveKey="threshold">
        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <ThresholdIcon />
              Vượt ngưỡng
            </Row>
          }
          key="threshold"
        >
          <AlarmExceed
            users={users}
            roles={roles}
            measuringListStation={measuringListStation}
            alarmList={alarmGroupByType[AlarmType.DataLevel]}
          />
        </TabPane>

        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <SignalIcon />
              Tín hiệu
            </Row>
          }
          key="disconnect"
        >
          <AlarmDisconnect
            users={users}
            roles={roles}
            dataSource={alarmGroupByType[AlarmType.Disconnect]}
          />
        </TabPane>

        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <DeviceIcon />
              Thiết bị
            </Row>
          }
          key="device"
        >
          Thiết bị
        </TabPane>

        {/* <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <AdvancedIcon />
              Nâng cao
            </Row>
          }
          key="advanced"
        >
          Nâng cao
        </TabPane> */}
      </Tabs>
    )
  }
}

StationAlarmManagement.defaultProps = {
  alarmList: [],
}
