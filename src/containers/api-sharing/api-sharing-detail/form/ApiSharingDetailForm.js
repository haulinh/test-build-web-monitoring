import { Tabs } from 'antd'
import React, { Component } from 'react'
import ConfigTab from './ConfigTab'
import ViewDataTab from './ViewDataTab'

export default class ApiSharingDetailForm extends Component {
  render() {
    return (
      <Tabs>
        <Tabs.TabPane tab="ConfigTab" key="ConfigTab">
          <ConfigTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="ViewDataTab" key="ViewDataTab">
          <ViewDataTab />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
