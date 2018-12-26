import React, { Component } from 'react'
import createContentLoader from 'hoc/content-loader'
import ListLoaderCp from 'components/content-loader/list-loader'
import BoxLoaderCp from 'components/content-loader/box-loader'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import SummaryList from 'components/dashboard/summary/summary-list'
import HeaderView from '../../components/dashboard/header-view'
import ChartStatisticalRatio from '../../components/dashboard/chart/chart-statistical-ratio'
import ChartList from 'components/dashboard/chart/chart-row-list'
import Clearfix from 'components/elements/clearfix'
import { getStationTypes } from 'api/CategoryApi'
import { getLastLog } from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'

const ListLoader = createContentLoader({
  component: <ListLoaderCp />,
  isAutoLoader: true,
  items: 5
})(null)

const BoxLoader = createContentLoader({
  component: <BoxLoaderCp />,
  isAutoLoader: true,
  items: 4,
  colSize: 3
})(null)

export default class OverviewDashboard extends Component {
  state = {
    stationStatus: '',
    stationTypeList: [],
    stationList: [],
    stationCount: {},
    stationNotUse: {},
    rows: {},
    lineSeries: {},
    isLoaded: false,
    province: null
  }

  getStationInfo = async province => {
    let provinceKey = null
    let stationTypes = await getStationTypes({}, { isAuto: true })
    let stationTypeList = _.get(stationTypes, 'data', [])

    let stationCount = {}
    let rows = {}
    let lineSeries = {}

    stationTypeList.forEach(({ key }) => {
      stationCount[key] = 0
      rows[key] = []
      lineSeries[key] = []
    })

    this.setState({
      stationTypeList,
      stationCount,
      rows,
      lineSeries,
      isLoaded: true
    })

    let stationLastLog = await getLastLog()
    let dataLastLog = []

    if (province && province.key) {
      provinceKey = province.key
      dataLastLog = _.filter(
        _.get(stationLastLog, 'data', []),
        item => _.get(item, 'province.key', '') === provinceKey
      )
    } else {
      dataLastLog = _.get(stationLastLog, 'data', [])
    }

    let groupLastLog = _.groupBy(dataLastLog, 'stationType.key')
    _.forEach(_.keys(groupLastLog), key => {
      rows[key] = groupLastLog[key]
      stationCount[key] = _.size(rows[key])
    })

    const goodCount = _.filter(dataLastLog, ({ status }) => status === 'GOOD')
      .length
    this.setState({
      province: provinceKey,
      stationList: dataLastLog,
      rows,
      stationCount,
      stationStatus: translate('dashboard.activeStationPer', {
        good: goodCount,
        total: _.size(dataLastLog)
      })
    })
  }

  async componentDidMount() {
    this.getStationInfo(null)
  }

  getSummaryList() {
    let arrayColor = [
      '#1dce6c',
      '#389bff',
      '#7ece23',
      '#e74c3c',
      '#1dce6c',
      '#389bff',
      '#7ece23',
      '#e74c3c'
    ]
    let arrayIcon = [
      '/images/dashboard/cloud.png',
      '/images/dashboard/groundwater.png',
      '/images/dashboard/surfaceWater.png',
      '/images/dashboard/wasteWater.png',
      '/images/dashboard/cloud.png',
      '/images/dashboard/groundwater.png',
      '/images/dashboard/surfaceWater.png',
      '/images/dashboard/wasteWater.png'
    ]
    return this.state.stationTypeList.map((item, index) => ({
      color: item.color ? item.color : arrayColor[index], //arrayColor[index],
      name: item.name,
      key: item.key,
      image: item.icon ? item.icon : arrayIcon[index],
      number: this.state.stationCount[item.key],
      totalStationGood: this.state.rows[item.key].filter(
        ({ status }) => status === 'GOOD'
      ).length
    }))
  }

  getChartList() {
    return _.map(this.state.stationTypeList, item => ({
      key: item.key,
      title: item.name,
      totalStation: this.state.stationCount[item.key],
      stationList: this.state.rows[item.key]
    }))
  }

  handleProvinceChange = province => {
    this.setState({ province })
    this.getStationInfo(province)
  }

  render() {
    return (
      <PageContainer
        isLoading={!this.state.isLoaded}
        backgroundColor="#fafbfb"
        componentLoading={
          <div>
            <BoxLoader />
            <Clearfix height={24} />
            <ListLoader />
          </div>
        }
        hideTitle
      >
        <HeaderView
          stationStatus={this.state.stationStatus}
          onChange={this.handleProvinceChange}
        />
        <SummaryList data={this.getSummaryList()} />
        <ChartStatisticalRatio
          data={this.state.stationList}
          province={this.state.province}
        />
        {/* this.state.stationList */}
        <ChartList data={this.getChartList()} />
      </PageContainer>
    )
  }
}
