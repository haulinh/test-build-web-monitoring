import { Tabs } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { i18n } from 'containers/api-sharing/constants'
import { isCreate, isView } from 'containers/api-sharing/util'
import _ from 'lodash'
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
      setName,
    } = this.props
    if (isCreate(rule)) return

    try {
      const res = await shareApiApi.getApiDetailById(params.id)
      if (res.success) {
        this.setState({ data: res.data })
        if (setName) {
          setName(res.data.name)
        }
      }
    } catch (error) {
      // console.log(error)
    }
  }

  updateData = newData => {
    this.setState({ data: newData })
  }

  getActiveKey = () => {
    const { rule, location } = this.props
    if (isView(rule)) {
      return 'QueryTab'
    }

    return _.get(location, ['state', 'activeKey'])
  }

  render() {
    const { rule } = this.props
    const { data } = this.state
    const activeKey = this.getActiveKey()

    return (
      <Tabs defaultActiveKey={activeKey || 'ConfigTab'}>
        <Tabs.TabPane
          disabled={isView(rule)}
          tab={i18n().tab.configTab}
          key="ConfigTab"
        >
          <ConfigTab data={data} rule={rule} updateData={this.updateData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={i18n().tab.viewDataTab} key="QueryTab">
          <QueryTab data={data} rule={rule} />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
