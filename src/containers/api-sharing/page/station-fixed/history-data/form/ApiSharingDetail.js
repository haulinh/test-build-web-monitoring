import { Tabs } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { i18n } from 'containers/api-sharing/constants'
import { isCreate } from 'containers/api-sharing/util'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ConfigTab from './config-tab'
import QueryTab from './query-tab'

@withRouter
export default class ApiSharingDetail extends Component {
  state = {
    data: {},
  }
  async componentDidMount() {
    const {
      match: { params },
      rule,
    } = this.props
    if (isCreate(rule)) return

    try {
      const res = await shareApiApi.getApiDetailById(params.id)
      if (res.success) {
        this.setState({ data: res.data })
      }
    } catch (error) {
      console.log(error)
    }
  }

  updateData = newData => {
    this.setState({ data: newData })
  }

  render() {
    const { rule } = this.props
    const { data } = this.state

    return (
      <Tabs>
        <Tabs.TabPane tab={i18n.tab.configTab} key="ConfigTab">
          <ConfigTab data={data} rule={rule} updateData={this.updateData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={i18n.tab.viewDataTab} key="ViewDataTab">
          <QueryTab data={data} rule={rule} />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
