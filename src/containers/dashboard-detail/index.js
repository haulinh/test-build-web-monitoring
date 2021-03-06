import React, { Component } from 'react'
import { Spin } from 'antd'
import * as _ from 'lodash'
import ReactFullpage from '@fullpage/react-fullpage'
import styled from 'styled-components'

import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import createContentLoader from 'hoc/content-loader'
import ListLoaderCp from 'components/content-loader/list-loader'
import BoxLoaderCp from 'components/content-loader/box-loader'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import SummaryList from 'components/dashboard/summary/summary-list'
import HeaderView from '../../components/dashboard/header-view'
// import ChartStatisticalRatio from '../../components/dashboard/chart/chart-statistical-ratio'
import ChartList from 'components/dashboard/chart/chart-row-list'
import Clearfix from 'components/elements/clearfix'
import { getStationTypes } from 'api/CategoryApi'
import { getLastLog } from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import { STATUS_STATION, getStatusPriority } from 'constants/stationStatus'
import { getContent } from 'components/language/language-content'
import { connect } from 'react-redux'

// NOTE  every 1min will get last log
const GET_LAST_LOG_INTERVAL_TIME = 1000 * 60

let getLastLogIntervalID = null

const HeaderWrapper = styled.div`
  width: 100% !important;
  z-index: 100;
  position: relative;
  top: -33;
`

const ListLoader = createContentLoader({
  component: <ListLoaderCp />,
  isAutoLoader: true,
  items: 5,
})(null)

const BoxLoader = createContentLoader({
  component: <BoxLoaderCp />,
  isAutoLoader: true,
  items: 4,
  colSize: 3,
})(null)

@protectRole(ROLE.DASHBOARD_2.VIEW)
@connect(state => ({
  languageContents: state.language.languageContents,
}))
export default class OverviewDashboard extends Component {
  state = {
    isGroupProvince: null,
    stationStatus: '',
    stationTypeList: [],
    stationList: [],
    stationCount: {},
    stationNotUse: {},
    rows: {},
    lineSeries: {},
    isLoaded: false,
    province: null,
    groupLastLog: null,
    isGetLastLogLoading: false,
  }

  getLastLog = async (province, provinceKey, rows, stationCount) => {
    this.setState({ isGetLastLogLoading: true })

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

    let groupProvince = _.groupBy(dataLastLog, 'province.key')
    let isGroupProvince = Object.keys(groupProvince).length > 1

    const goodCount = _.filter(
      dataLastLog,
      ({ status }) => status === 'DATA_CONNECTED'
    ).length
    this.setState({
      isGroupProvince: isGroupProvince,
      province: provinceKey,
      stationList: dataLastLog,
      rows,
      stationCount,
      groupLastLog,
      stationStatus: translate('dashboard.activeStationPer', {
        good: goodCount,
        total: _.size(dataLastLog),
      }),
      isGetLastLogLoading: false,
    })
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
      isLoaded: true,
    })

    // NOTE  l???y last log 1 l???n, sau ???? c??? m???i gi??y l???i l???y last log
    this.getLastLog(province, provinceKey, rows, stationCount)
    if (getLastLogIntervalID) clearInterval(getLastLogIntervalID)
    getLastLogIntervalID = setInterval(() => {
      this.getLastLog(province, provinceKey, rows, stationCount)
      this.getSummaryList()
    }, GET_LAST_LOG_INTERVAL_TIME)
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
      '#e74c3c',
    ]
    let arrayIcon = [
      '/images/dashboard/cloud.png',
      '/images/dashboard/groundwater.png',
      '/images/dashboard/surfaceWater.png',
      '/images/dashboard/wasteWater.png',
      '/images/dashboard/cloud.png',
      '/images/dashboard/groundwater.png',
      '/images/dashboard/surfaceWater.png',
      '/images/dashboard/wasteWater.png',
    ]

    return this.state.stationTypeList.map((item, index) => ({
      _id: item._id,
      statusStation: this.timKiemStatusQuaLastLog(
        this.state.groupLastLog[item.key]
      ),
      color: item.color ? item.color : arrayColor[index], //arrayColor[index],
      name: item.name,
      key: item.key,
      image: item.icon ? item.icon : arrayIcon[index],
      number: this.state.stationCount[item.key],
      totalStationGood: this.state.rows[item.key].filter(
        ({ status }) => status === 'DATA_CONNECTED'
      ).length,
    }))
  }

  timKiemStatusQuaLastLog = (dataLog = []) => {
    let resStatus = STATUS_STATION.DATA_CONNECTED

    const me = this
    _.forEach(dataLog, function(item) {
      // NOTE  check status tr???m tru???c
      if (
        item.status === STATUS_STATION.HIGHTGEST ||
        item.status === STATUS_STATION.NOT_USE
      ) {
        resStatus = STATUS_STATION.HIGHTGEST
        return false // break loop lodash
      }

      // NOTE  check lastLog
      let statusMeasuring = me.timKiemStatusQuaMeasuringLog(
        item.lastLog.measuringLogs
      )
      resStatus = getStatusPriority(resStatus, statusMeasuring)
    })

    return resStatus
  }

  timKiemStatusQuaMeasuringLog = (measuringLogs = {}) => {
    let resWarningLevel = null
    _.forEach(measuringLogs, function(item, key) {
      resWarningLevel = getStatusPriority(resWarningLevel, item.warningLevel)
    })
    return resWarningLevel
  }

  getChartList() {
    const { languageContents } = this.props
    const result = _.map(this.state.stationTypeList, item => {
      if (this.state.stationCount[item.key] === 0) {
        return null
      }
      return {
        key: item.key,
        title: getContent(languageContents, {
          type: 'StationType',
          itemId: item._id,
          field: 'name',
          value: item.name,
        }),
        totalStation: this.state.stationCount[item.key],
        stationList: this.state.rows[item.key],
      }
    })

    return _.compact(result)
  }

  handleProvinceChange = province => {
    this.setState({ province, isGetLastLogLoading: true }, () => {
      this.getStationInfo(province)
    })
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
        <HeaderWrapper className="header--wrapper">
          <div style={{ background: '#FBFBFB', padding: '16px 0px 0px' }}>
            <HeaderView
              stationStatus={this.state.stationStatus}
              onChange={this.handleProvinceChange}
            />
            {!this.state.groupLastLog && <BoxLoader />}
            {this.state.groupLastLog && (
              <Spin spinning={this.state.isGetLastLogLoading}>
                <SummaryList data={this.getSummaryList()} />
              </Spin>
            )}
          </div>
        </HeaderWrapper>

        <ReactFullpage
          render={({ state, fullpageApi }) => {
            return (
              <ReactFullpage.Wrapper>
                <ChartList data={this.getChartList()} />
              </ReactFullpage.Wrapper>
            )
          }}
        />
      </PageContainer>
    )
  }
}
