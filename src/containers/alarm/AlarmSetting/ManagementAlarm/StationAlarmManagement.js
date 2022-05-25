import { Icon, Row, Tabs as TabsAnt } from 'antd'
import React, { Component } from 'react'
import styled from 'styled-components'

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
    return (
      <Tabs defaultActiveKey="threshold">
        <TabPane
          tab={
            <Row type="flex" align="middle">
              <Icon type="warning" style={{ fontSize: 20 }} />
              Vượt ngưỡng
            </Row>
          }
          key="threshold"
        >
          Vượt ngưỡng
        </TabPane>
        <TabPane
          tab={
            <Row type="flex" align="middle">
              <Icon type="cloud-sync" style={{ fontSize: 20 }} />
              Tín hiệu
            </Row>
          }
          key="signal"
        >
          Tín hiệu
        </TabPane>
        <TabPane
          tab={
            <Row type="flex" align="middle">
              <Icon type="appstore" style={{ fontSize: 20 }} />
              Thiết bị
            </Row>
          }
          key="device"
        >
          Thiết bị
        </TabPane>
        <TabPane
          tab={
            <Row type="flex" align="middle">
              <Icon type="setting" style={{ fontSize: 20 }} />
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
