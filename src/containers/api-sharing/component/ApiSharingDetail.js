import { Tabs } from 'antd'
import { shareApiApi } from 'api/ShareApiApi'
import { i18n } from 'containers/api-sharing/constants'
import { isCreate } from 'containers/api-sharing/util'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

export const ApiSharingDetailContext = React.createContext({
  stationAutos: [],
  setStationAutos: () => {},
  measureListData: [],
  setMeasureListData: () => {},
})

@withRouter
export default class ApiSharingDetail extends Component {
  state = {
    data: {},
    stationAutos: [],
    measureListData: [],
  }

  setStationAutos = stationAutos => {
    this.setState({ stationAutos })
  }

  setMeasureListData = measureListData => {
    this.setState({ measureListData })
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
      console.log(error)
    }
  }

  updateData = newData => {
    this.setState({ data: newData })
    this.props.setName(newData.name)
  }

  render() {
    const { rule, configTab, queryTab } = this.props
    const { data, stationAutos, measureListData } = this.state

    const QueryTab = queryTab
    const ConfigTab = configTab

    return (
      <ApiSharingDetailContext.Provider
        value={{
          stationAutos,
          setStationAutos: this.setStationAutos,
          measureListData,
          setMeasureListData: this.setMeasureListData,
        }}
      >
        <Tabs>
          <Tabs.TabPane tab={i18n.tab.configTab} key="ConfigTab">
            <ConfigTab rule={rule} data={data} updateData={this.updateData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={i18n.tab.viewDataTab} key="ViewDataTab">
            <QueryTab rule={rule} data={data} />
          </Tabs.TabPane>
        </Tabs>
      </ApiSharingDetailContext.Provider>
    )
  }
}
