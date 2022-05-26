import { Row, Tabs as TabsAnt } from 'antd'
import {
  AdvancedIcon,
  DeviceIcon,
  SignalIcon,
  ThresholdIcon,
} from 'assets/icons-alarm'
import React, { Component } from 'react'
import styled from 'styled-components'
import AlarmExceed from './AlarmType/Exceed'
import AlarmDisconnect from './AlarmType/AlarmDisconnect'

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

export default class StationAlarmManagement extends Component {
  render() {
    const { users, roles, alarmList } = this.props
    console.log({ alarmList })

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
          <AlarmExceed users={users} roles={roles} />
        </TabPane>
        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <SignalIcon />
              Tín hiệu
            </Row>
          }
          key="signal"
        >
          <AlarmDisconnect users={users} roles={roles} />
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
        <TabPane
          tab={
            <Row style={{ gap: 5 }} type="flex" align="middle">
              <AdvancedIcon />
              Nâng cao
            </Row>
          }
          key="advanced"
        >
          Nâng cao
        </TabPane>
      </Tabs>
    )
  }
}
