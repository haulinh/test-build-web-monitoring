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

  setInitFields = () => {
    const { data } = this.props
    const fieldsValue = data.config.reduce((base, current) => {
      let value = current.value
      if (['stationKeys', 'measuringList'].includes(current.fieldName)) {
        value = current.value.split(',')
      }
      const fieldValue = {
        [`config.${current.fieldName}`]: value,
      }
      return { ...base, ...fieldValue }
    }, {})

    this.props.form.setFieldsValue({
      ...fieldsValue,
      name: data.name,
      description: data.description,
    })
  }

  render() {
    const { rule } = this.props
    const { data } = this.state

    return (
      <Tabs>
        <Tabs.TabPane tab={i18n.tab.configTab} key="ConfigTab">
          <ConfigTab rule={rule} data={data} updateData={this.updateData} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={i18n.tab.viewDataTab} key="ViewDataTab">
          <QueryTab rule={rule} data={data} />
        </Tabs.TabPane>
      </Tabs>
    )
  }
}
