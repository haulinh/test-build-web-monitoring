import { Tabs } from 'antd'
import React, { Component } from 'react'
import ConfigTab from './config-tab'
import ViewDataTab from './ViewDataTab'

export default class ApiSharingDetailForm extends Component {
  render() {
    const { edit, match, location } = this.props

    return (
      <Tabs>
        <Tabs.TabPane tab="ConfigTab" key="ConfigTab">
          <ConfigTab edit={edit} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="ViewDataTab" key="ViewDataTab">
          <ViewDataTab />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
