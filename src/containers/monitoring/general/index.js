import { Anchor } from 'antd'
import CategoriesApi from 'api/CategoryApi'
import StationAutoApi from 'api/StationAuto'
import ListLoaderCp from 'components/content-loader/list-loader'
import Clearfix from 'components/elements/clearfix'
import HeaderFilter from 'components/monitoring/filter'
import {
  GROUP_OPTIONS,
  ORDER_OPTIONS
} from 'components/monitoring/filter/options'
import Header from 'components/monitoring/head'
import StationTypeList from 'components/monitoring/station-type-group/station-type-list'
import monitoringFilter from 'constants/monitoringFilter'
import ROLE from 'constants/role'
import { getStatusPriority, STATUS_STATION } from 'constants/stationStatus'
import { warningLevels } from 'constants/warningLevels'
import { autobind } from 'core-decorators'
import createContentLoader from 'hoc/content-loader'
import { removeAccents, translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import * as _ from 'lodash'
import queryString from 'query-string'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { getMonitoringFilter } from 'utils/localStorage'
import { replaceVietnameseStr } from 'utils/string'
import HeaderView from '../../../components/monitoring/header-view'


const { Link } = Anchor

const ContainerHeader = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
`

const ListLoader = createContentLoader({
  component: <ListLoaderCp />,
  isAutoLoader: true,
  items: 5,
})(null)

export const defaultFilter = {
  group: GROUP_OPTIONS[0].value,
  order: ORDER_OPTIONS[0].value,
  stationType: '',
  search: '',
}
@connect(state => ({
  language: _.get(state, 'language.locale'),
}))
@withRouter
@queryFormDataBrowser(['submit'])
@protectRole(ROLE.MONITORING.VIEW)
@autobind
export default class MonitoringGeneral extends React.Component {
  state = {
    isLoading: false,
    isLoadedFirst: false,
    filter: getMonitoringFilter() ? getMonitoringFilter() : defaultFilter,
    data: [],
    province: null,
    followStation: null,
  }

  getStatusItem(item) {
    if (item.status === STATUS_STATION.HIGHTGEST)
      return STATUS_STATION.HIGHTGEST
    if (item.lastLog) {
      let warLevel = warningLevels.GOOD
      let measuringLogs = item.lastLog.measuringLogs
      for (let key in measuringLogs) {
        warLevel = getStatusPriority(warLevel, measuringLogs[key].warningLevel)
      }
      return warLevel
    }
    return STATUS_STATION.DATA_CONNECTED
  }

  appendWarningLevelStationAuto(stationAutoList) {
    return stationAutoList.map(stationAuto => {
      let totalWarning = 0
      if (stationAuto.lastLog && stationAuto.lastLog.measuringLogs) {
        const measuringLogs = stationAuto.lastLog.measuringLogs
        Object.keys(measuringLogs).forEach(key => {
          if (measuringLogs[key].warningLevel) {
            totalWarning++
          }
        })
      }
      return {
        ...stationAuto,
        totalWarning,
        statusAnalytic: this.getStatusItem(stationAuto),
      }
    })
  }

  getTotalWarning(stationAutoList) {
    let totalWarning = 0
    stationAutoList.forEach(item => {
      totalWarning += item.totalWarning
    })
    return totalWarning
  }

  async loadData() {
    this.setState({ isLoading: false })
    let dataStationTypes = await CategoriesApi.getStationTypes({
      page: 1,
      itemPerPage: 10,
    })
    let dataStationAutos = await StationAutoApi.getLastLog()
    dataStationAutos = _.get(dataStationAutos, 'data', [])

    // // MARK  logic focus trạm từ trang map
    // if (this.state.followStation) {
    //   dataStationAutos = _.filter(dataStationAutos, item => {
    //     return item.key === this.state.followStation
    //   })
    //   // console.log(dataStationAutos, 'dataStationAutos')
    // }

    const tmp = _.get(dataStationTypes, 'data', [])
    if (tmp && tmp.length > 0) {
      const dataMonitoring = _.map(tmp, stationType => {
        const stationAutoList = _.filter(
          dataStationAutos,
          stationAuto => stationAuto.stationType.key === stationType.key
        )
        return {
          stationType,
          stationAutoList: this.appendWarningLevelStationAuto(stationAutoList),
          totalWarning: this.getTotalWarning(
            this.appendWarningLevelStationAuto(stationAutoList)
          ),
        }
      })

      this.setState({
        data: dataMonitoring.length > 0 ? dataMonitoring : this.state.data,
        isLoading: true,
      })
    }
  }

  getFollowStation = stations => {
    if (this.state.followStation) {
      const aa = _.find(stations, function(o) {
        return (o.key = this.state.followStation)
      })
      return aa
    } else {
      return stations
    }
  }

  startTimer() {
    clearInterval(this.timer)
    this.timer = setInterval(this.loadData.bind(this), 60000)
  }

  stopTimer() {
    clearInterval(this.timer)
  }

  async componentWillMount() {
    if (this.props.location) {
      const query = queryString.parse(this.props.location.search)
      if (query)
        this.handleChangeFilter({ ...this.state.filter, stationType: query.Id })
    }
    // NOTE lấy mã trạm từ url
    if (this.props.formData) {
      // console.log(this.props.formData, "monitoring formData")
      this.setState({
        followStation: _.get(this.props.formData, 'stationAuto', ''),
      })
    }
    await this.loadData()
    this.setState({
      isLoadedFirst: true,
    })
    this.startTimer()
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  handleChangeFilter(filter) {
    this.setState({ filter }, this.forceUpdate)
    // MARK set localstore khi filter => tạm thời k xử dụng
    // setMonitoringFilter(filter)
  }

  handleProvinceChange = province => {
    this.setState({
      province,
    })
  }

  renderHeader(total, countGood) {
    const stationStatus = translate('dashboard.activeStationPer', {
      good: countGood,
      total,
    })
    return (
      <ContainerHeader>
        <HeaderView
          stationStatus={stationStatus}
          onChange={this.handleProvinceChange}
        />
        <Header>
          <HeaderFilter
            filter={this.state.filter}
            onChange={this.handleChangeFilter}
          />
        </Header>
      </ContainerHeader>
    )
  }

  sortNameList(data, key, asc = true, sortByValue = false) {
    if (sortByValue) {
      // MARK  old:  return _.orderBy(data, [key, 'statusAnalytic'], [asc ? 'asc' : 'desc', 'desc'])
      return _.orderBy(data, ['statusAnalytic'], ['asc'])
    }
   
    if (key === 'name') {
      return _.orderBy(data, [item =>  removeAccents(this.props.language, item.name.toLowerCase())], [asc ? 'asc' : 'desc'])
    }
    return _.orderBy(data, [key], [asc ? 'asc' : 'desc'])
  }

  unGroupStation(stationTypeList) {
    if (stationTypeList.length === 0) return []
    let newStationAutoList = []
    stationTypeList.forEach(stationType => {
      stationType.stationAutoList.forEach(stationAuto => {
        newStationAutoList = [...newStationAutoList, stationAuto]
      })
    })
    if (this.state.filter.order === monitoringFilter.ORDER.NAME) {
      newStationAutoList = this.sortNameList(newStationAutoList, 'name')
    }
    return [
      {
        stationType: {
          ...stationTypeList[0],
          name: translate('dataSearchFrom.form.all'),
        },
        stationAutoList: newStationAutoList,
      },
    ]
  }

  getFilterProvince = dataList => {
    let total = 0
    let countGood = 0
    const stationTypeList = _.map(
      dataList,
      ({ stationAutoList, totalWarning, stationType }) => {
        const rs = _.filter(
          stationAutoList || [],
          ({ name, province, status }) => {
            let hasFilterName = true
            if (this.state.filter.search) {
              hasFilterName = _.includes(
                replaceVietnameseStr(name).toLowerCase(),
                replaceVietnameseStr(this.state.filter.search).toLowerCase()
              )
            }

            let hasStation =
              hasFilterName &&
              (!this.state.province ||
                _.isEqual(
                  _.get(province, 'key', ''),
                  _.get(this.state.province, 'key', '')
                ))
            if (hasStation) {
              total = total + 1
              countGood = countGood + (_.isEqual(status, 'DATA_CONNECTED') ? 1 : 0)
            }

            return hasStation
          }
        )
        return {
          stationAutoList: rs,
          totalWarning,
          stationType,
        }
      }
    )

    return {
      total,
      countGood,
      stationTypeList,
    }
  }

  getData() {
    const dataResult = this.getFilterProvince(this.state.data)
    let stationTypeList = dataResult.stationTypeList
    // filter by STATION TYPE
    if (
      this.state.filter.stationType &&
      this.state.filter.stationType !== 'ALL'
    ) {
      stationTypeList = stationTypeList.filter(
        stationType =>
          stationType.stationType.key === this.state.filter.stationType
      )
    }
    // filter by UNGROUP
    if (this.state.filter.group === monitoringFilter.GROUP.UNGROUP) {
      stationTypeList = this.unGroupStation(stationTypeList)
    }

    // filter by ORDER NAME
    if (this.state.filter.order === monitoringFilter.ORDER.NAME) {
      stationTypeList = this.sortNameList(
        stationTypeList,
        'stationType.name'
      ).map(stationType => {
        return {
          ...stationType,
          stationType: stationType.stationType,
          stationAutoList: this.sortNameList(
            stationType.stationAutoList,
            'name'
          ),
        }
      })
    }

    // filter by values
    if (this.state.filter.order === monitoringFilter.ORDER.NUMBER) {
      stationTypeList = this.sortNameList(
        stationTypeList,
        'totalWarning',
        true,
        true
      ).map(stationType => {
        return {
          ...stationType,
          stationType: stationType.stationType,
          stationAutoList: this.sortNameList(
            stationType.stationAutoList,
            'totalWarning',
            false,
            true
          ),
        }
      })
    }

    return {
      stationTypeList,
      total: dataResult.total,
      countGood: dataResult.countGood,
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.followStation &&
      this.state.followStation !== prevState.followStation
    ) {
      setTimeout(() => {
        if (this.comptAnchor) {
          this.comptAnchor.handleClick()
        }
      }, 500)
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.comptAnchor) {
        this.comptAnchor.handleClick()
      }
    }, 1000)
  }

  componentWillReceiveProps = nextProps => {
    if (
      !_.isEqual(
        nextProps.formData.stationAuto,
        this.props.formData.stationAuto
      )
    ) {
      this.setState({
        followStation: _.get(nextProps.formData, 'stationAuto', ''),
      })
    }
  }

  render() {
    const result = this.getData()
    return (
      <PageContainer
        style={{ height: '100%' }}
        isLoading={!this.state.isLoadedFirst}
        backgroundColor="#fafbfb"
        headerCustom={this.renderHeader(result.total, result.countGood)}
        componentLoading={
          <div>
            <ListLoader />
          </div>
        }
      >
        {/* NOTE Qui chinh: feature focus toi tram can xem */}
        {this.state.followStation && (
          <Anchor
            // targetOffset={window.innerHeight / 2}
            style={{ display: 'none' }}
            offsetTop={140}
          >
            <Link
              ref={link => (this.comptAnchor = link)}
              href={`#${this.state.followStation || ''}`}
              title={this.state.followStation || ''}
            />
          </Anchor>
        )}
        <Clearfix height={16} />
        <StationTypeList
          filter={this.state.filter}
          data={result.stationTypeList}
        />
        <Clearfix height={64} />
      </PageContainer>
    )
  }
}
