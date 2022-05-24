import { Tabs, Icon, Row, Collapse } from 'antd'
import React, { Component } from 'react'
import Threshold from 'assets/svg-icons/Threshold'

const { TabPane } = Tabs

export default class StationAlarm extends Component {
  state = {
    activeKey: 'threshold',
  }
  render() {
    return (
      <Tabs defaultActiveKey="threshold">
        <TabPane
          tab={
            <Row type="flex" align="middle">
              <Icon type="warning" />
              Vượt ngưỡng
            </Row>
          }
          key="threshold"
        >
          Vượt ngưỡng
        </TabPane>
        <TabPane tab="Tín hiệu" key="signal">
          Tín hiệu
        </TabPane>
        <TabPane tab="Thiết bị" key="device">
          Thiết bị
        </TabPane>
        <TabPane tab="Nâng cao" key="advanced">
          Nâng cao
        </TabPane>
      </Tabs>
    )
  }
}
