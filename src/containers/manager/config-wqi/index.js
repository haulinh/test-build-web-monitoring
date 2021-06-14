import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import TabsStationAuto from './tabs-station-auto'
// import TabsStationFixed from './tabs-station-fixed'
import stationAutoApi from 'api/StationAuto'
// import stationFixedApi from 'api/StationFixedApi'
import stationConfigApi from 'api/StationConfigApi'
import { translate } from 'hoc/create-lang'
import { Icon, Tabs } from 'antd'
import * as _ from 'lodash'
import Breadcrumb from './breadcrumb'
// import { getConfigApi } from "config"
// import PageInfo from "components/pageInfo"
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import TabsStationFixed from './tabs-station-fixed'

const TabPane = Tabs.TabPane
@protectRole(ROLE.CONFIG_WQI.VIEW)
class ConfigWQIContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listStationAuto: [],
      listStationfixed: [],
      listStationConfig: [],
      stationTypeFixed: [],
      stationTypeAuto: [],
    }
  }

  async loadDataAuto() {
    const rs = await stationAutoApi.getLastLog()
    const listStationAuto = _.get(rs, 'data', [])
    const stationTypeAuto = []
    const keys = []
    _.forEach(listStationAuto, ({ stationType: { key, name } }) => {
      if (!_.includes(keys, key)) {
        keys.push(key)
        stationTypeAuto.push({ text: name, value: key })
      }
    })
    this.setState({ listStationAuto, stationTypeAuto })
  }

  async loadDataConfigStation() {
    const rs = await stationConfigApi.getStationsConfig({}, {})
    this.setState({ listStationConfig: _.get(rs, 'data', []) })
  }

  componentDidMount() {
    this.loadDataAuto()
    // this.loadDataStationFixed()
    this.loadDataConfigStation()
  }

  handleSuccess = () => {
    this.refreshLoadData()
  }

  async refreshLoadData() {
    this.loadDataAuto()
    // this.loadDataStationFixed()
    this.loadDataConfigStation()
  }

  render() {
    return (
      <div>
        <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
          <Breadcrumb items={['list']} />
          <Tabs defaultActiveKey="tabFixed">
            <TabPane
              tab={
                <span>
                  <Icon type="reconciliation" />
                  {translate('configWQI.stationAuto')}
                </span>
              }
              key="tabAuto"
            >
              {this.state.listStationAuto &&
                this.state.listStationAuto.length > 0 && (
                  <TabsStationAuto
                    listStationAuto={this.state.listStationAuto}
                    listStationConfig={this.state.listStationConfig}
                    handleSuccess={this.handleSuccess}
                    stationTypeAuto={this.state.stationTypeAuto}
                  />
                )}
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
              <TabsStationFixed />
            </TabPane> 
          </Tabs>
        </PageContainer>
      </div>
    )
  }
}

export default ConfigWQIContainer
