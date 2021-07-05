import { Tabs } from 'antd'
import { i18n } from 'containers/api-sharing/constants'
import React, { Component } from 'react'
import ConfigTab from './config-tab'
import ViewDataTab from './ViewDataTab'

export default class ApiSharingDetail extends Component {
  render() {
    const { edit } = this.props

    return (
      <Tabs>
        <Tabs.TabPane tab={i18n.tab.configTab} key="ConfigTab">
          <ConfigTab edit={edit} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={i18n.tab.viewDataTab} key="ViewDataTab">
          <ViewDataTab />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
