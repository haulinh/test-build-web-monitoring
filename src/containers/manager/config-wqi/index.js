import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import TabsStationAuto from './tabs-station-auto'
import TabsStationFixed from './tabs-station-fixed'
import stationAutoApi from 'api/StationAuto'
import stationFixedApi from 'api/StationFixedApi'
import stationConfigApi from 'api/StationConfigApi'
import stationTypeApi from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import { Icon, Tabs } from 'antd'
import * as _ from 'lodash'
import Breadcrumb from './breadcrumb'

const TabPane = Tabs.TabPane

export default class ConfigWQIContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listStationAuto: [],
      listStationfixed: [],
      listStationConfig: [],
      stationTypeFixed: [],
      stationTypeAuto: []
    }
  }

  async loadDataAuto() {
    const rs = await stationAutoApi.getLastLog()
    const listStationAuto = _.get(rs, 'data', [])
    const stationTypeAuto = []
    const keys = []
    const data = _.forEach(
      listStationAuto,
      ({ stationType: { key, name } }) => {
        if (!_.includes(keys, key)) {
          keys.push(key)
          stationTypeAuto.push({ text: name, value: key })
        }
      }
    )
    this.setState({ listStationAuto, stationTypeAuto })
  }

  async loadDataStationFixed() {
    const rs = await stationFixedApi.getStationFixeds({}, {})

    const listStationfixed = _.get(rs, 'data', [])

    const stationTypeFixed = []
    const keys = []
    const data = _.forEach(
      listStationfixed,
      ({ stationType: { key, name } }) => {
        if (!_.includes(keys, key)) {
          keys.push(key)
          stationTypeFixed.push({ text: name, value: key })
        }
      }
    )

    this.setState({ listStationfixed, stationTypeFixed })
  }

  async loadDataConfigStation() {
    const rs = await stationConfigApi.getStationsConfig({}, {})
    this.setState({ listStationConfig: _.get(rs, 'data', []) })
  }

  componentDidMount() {
    this.loadDataAuto()
    this.loadDataStationFixed()
    this.loadDataConfigStation()
  }

  handleSuccess = () => {
    this.refreshLoadData()
  }

  async refreshLoadData() {
    this.loadDataAuto()
    this.loadDataStationFixed()
    this.loadDataConfigStation()
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Tabs defaultActiveKey="tabAuto">
          <TabPane
            tab={
              <span>
                <Icon type="reconciliation" />
                {translate('configWQI.stationAuto')}
              </span>
            }
            key="tabAuto"
          >
            <TabsStationAuto
              listStationAuto={this.state.listStationAuto}
              listStationConfig={this.state.listStationConfig}
              handleSuccess={this.handleSuccess}
              stationTypeAuto={this.state.stationTypeAuto}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="cluster" />
                {translate('configWQI.stationFixed')}
              </span>
            }
            key="tabFixed"
          >
            <TabsStationFixed
              listStationFixed={this.state.listStationfixed}
              listStationConfig={this.state.listStationConfig}
              handleSuccess={this.handleSuccess}
              stationTypeFixed={this.state.stationTypeFixed}
            />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
