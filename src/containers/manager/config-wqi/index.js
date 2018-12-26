import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import TabsStationAuto from './tabs-station-auto'
import TabsStationFixed from './tabs-station-fixed'
import stationAutoApi from 'api/StationAuto'
import stationFixedApi from 'api/StationFixedApi'
import stationConfigApi from 'api/StationConfigApi'
import stationTypeApi from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import {Icon, Tabs} from 'antd'
import * as _ from 'lodash'
import Breadcrumb from './breadcrumb'


const TabPane = Tabs.TabPane;

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
    this.setState({ listStationAuto: _.get(rs, 'data', [])})
  }
  async loadDataStationFixed() {
    const rs = await stationFixedApi.getStationFixeds({},{})
    this.setState({ listStationfixed: _.get(rs, 'data', [])})
  }
  async loadDataConfigStation () {
    const rs = await stationConfigApi.getStationsConfig({},{})
    this.setState({ listStationConfig: _.get(rs, 'data', [])})
  }

  async getStationTypeAuto() {
    const filterStationType = []
    const rs = await stationTypeApi.getStationTypes({}, {isAuto: true})
    _.forEach(rs.data, (item) => {
        filterStationType.push({
          text: item.name,
          value: item.key
        })
    })
    this.setState({stationTypeAuto: filterStationType})
  }

  async getStationTypeFixed() {
    const filterStationType = []
    const rs = await stationTypeApi.getStationTypes({}, {isAuto: false})
    _.forEach(rs.data, (item) => {
        filterStationType.push({
          text: item.name,
          value: item.key
        })
    })
    this.setState({stationTypeFixed: filterStationType})
  }

  componentDidMount() {
    this.loadDataAuto()
    this.loadDataStationFixed()
    this.loadDataConfigStation ()
    this.getStationTypeAuto()
    this.getStationTypeFixed()
  }

  handleSuccess = () => {
    this.refeshLoadData()
  }

  async refeshLoadData(){
    this.loadDataAuto()
    this.loadDataStationFixed()
    this.loadDataConfigStation ()
    this.getStationTypeAuto()
    this.getStationTypeFixed()
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
          <Tabs defaultActiveKey="tabAuto">
            <TabPane tab={<span><Icon type="reconciliation" />{translate('configWQI.stationAuto')}</span>} key="tabAuto" >
               <TabsStationAuto 
                    listStationAuto={this.state.listStationAuto}
                    listStationConfig = {this.state.listStationConfig}
                    handleSuccess = {this.handleSuccess}
                    stationTypeAuto= {this.state.stationTypeAuto}
               />
            </TabPane >
            <TabPane tab={<span><Icon type="cluster" />{translate('configWQI.stationFixed')}</span>} key="tabFixed">
              <TabsStationFixed 
                    listStationFixed={this.state.listStationfixed}
                    listStationConfig = {this.state.listStationConfig}
                    handleSuccess = {this.handleSuccess}
                    stationTypeFixed= {this.state.stationTypeFixed}
              />
            </TabPane>
          </Tabs>        
      </PageContainer>
    )
  }
}
