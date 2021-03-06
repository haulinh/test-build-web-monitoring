import { Row, Tabs as TabsAnt } from 'antd'
import { CpuSetting, CloudCross, Danger } from 'assets/icons'
import { i18n } from '../../constants'
import { get, groupBy } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { AlarmType } from '../../constants'
import AlarmDisconnect from './AlarmType/AlarmDisconnect'
import AlarmStatusDevice from './AlarmType/AlarmStatusDevice'
import AlarmExceed from './AlarmType/Exceed'

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
    const {
      users,
      roles,
      alarmList,
      stationAutos,
      stationId,
      stationName,
    } = this.props
    const measuringList = get(
      stationAutos.find(station => station._id === stationId),
      'measuringList'
    )

    const measuringListStation = measuringList.map(measuring => ({
      id: uuidv4(),
      ...measuring,
    }))

    const alarmGroupByType = groupBy(alarmList, 'type')

    return (
      <Tabs defaultActiveKey="threshold">
        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <Danger />
              {i18n().tabs.exceed}
            </Row>
          }
          key="threshold"
        >
          <AlarmExceed
            users={users}
            roles={roles}
            measuringListStation={measuringListStation}
            dataSource={alarmGroupByType[AlarmType.DataLevel]}
            stationId={stationId}
            stationName={stationName}
          />
        </TabPane>

        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <CloudCross />
              {i18n().tabs.connection}
            </Row>
          }
          key="disconnect"
        >
          <AlarmDisconnect
            users={users}
            stationName={stationName}
            roles={roles}
            stationId={stationId}
            dataSource={alarmGroupByType[AlarmType.Disconnect]}
          />
        </TabPane>

        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <CpuSetting />
              {i18n().tabs.device}
            </Row>
          }
          key="device"
        >
          <AlarmStatusDevice
            users={users}
            stationName={stationName}
            roles={roles}
            stationId={stationId}
            dataSource={alarmGroupByType[AlarmType.Device]}
          />
        </TabPane>

        {/* <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <AdvancedIcon />
              N??ng cao
            </Row>
          }
          key="advanced"
        >
          N??ng cao
        </TabPane> */}
      </Tabs>
    )
  }
}

StationAlarmManagement.defaultProps = {
  alarmList: [],
}
