import { message, Tabs } from 'antd'
import { getMe } from 'api/AuthApi'
import DataInsight from 'api/DataInsight'
import { exportExcelMultipleStation } from 'api/DataStationAutoApi'
import BoxShadow from 'components/elements/box-shadow'
import { dataStatusOptions } from 'constants/dataStatus'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { find, get, isEmpty, isEqual, map, maxBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { downFileExcel } from 'utils/downFile'
import TabList from '../../tab-list'

const StationDataWrapper = styled(BoxShadow)`
  padding: 0px 16px 16px 16px;
  .ant-tabs-ink-bar {
    background-color: #1890ff !important;
  }
  .ant-tabs-nav .ant-tabs-tab {
    margin: 6px;
    padding: 12px 16px 12px 16px !important;
  }
`

@autobind
export default class StationData extends React.PureComponent {
  static propTypes = {
    standardsVN: PropTypes.array,
    stationsData: PropTypes.array,
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    qcvns: PropTypes.array,
  }

  static defaultProps = {
    stationsData: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      tabKey: '',
      dataStationAuto: [],
      isLoading: false,
      isExporting: false,
      isExportingAll: false,
      pagination: {
        current: 1,
        pageSize: 50,
      },
      orderedMeaKey: [],
    }
  }

  renderTabStations(stations) {
    const { tabKey } = this.state
    return (
      <Tabs
        defaultActiveKey={tabKey}
        onChange={this.handleChangeTab}
        activeKey={tabKey}
      >
        {stations.map(station => {
          return this.renderOneStation(station)
        })}
      </Tabs>
    )
  }

  renderOneStation(station) {
    const { searchFormData, qcvns } = this.props
    const {
      tabKey,
      isLoading,
      dataStationAuto,
      pagination,
      isExporting,
      isExportingAll,
    } = this.state
    const { measuringList } = searchFormData.measuringList.filter(measureForm =>
      station.measuringList.some(
        measureStation => measureStation === measureForm
      )
    )
    const measuringData = station.measuringData.filter(measureStation =>
      searchFormData.measuringList.some(
        measureForm => measureForm === measureStation.key
      )
    )
    return (
      <Tabs.TabPane tab={station.name} key={station.key}>
        <TabList
          qcvns={qcvns}
          isActive={tabKey === station.key}
          isLoading={isLoading}
          measuringData={measuringData}
          measuringList={measuringList}
          dataStationAuto={dataStationAuto}
          pagination={pagination}
          onChangePage={this.handleChangePage}
          onExportExcel={this.handleExportExcel}
          onExportExcelAll={this.handleExportAllStation}
          nameChart={station.name}
          typeReport={`${searchFormData.type}`}
          isExporting={isExporting}
          isExportingAll={isExportingAll}
        />
      </Tabs.TabPane>
    )
  }

  getStation = stationKey => {
    const { stationsData } = this.props
    let station = stationsData[0]
    if (stationKey) {
      station = stationsData.find(station => station.key === stationKey)
    }
    return station
  }

  getSearchFormData = (stationKey, standards) => {
    const { searchFormData, standardsVN } = this.props
    const { advanced, dataStatus, fromDate, toDate, type } = searchFormData
    if (!stationKey) return
    const station = this.getStation(stationKey)

    if (!station) return {}

    const measuringListUnitStr = station.measuringList.map(item => {
      const itemFind = find(station.measuringData, obj => {
        return obj.key === item
      })
      if (itemFind) {
        return encodeURIComponent(get(itemFind, 'unit', ''))
      } else {
        return ''
      }
    })

    const measuringList = searchFormData.measuringList.filter(measureForm =>
      station.measuringList.some(
        measureStation => measureStation === measureForm
      )
    )

    const result = {
      advanced: advanced,
      dataStatus: dataStatus,
      fromDate: fromDate,
      toDate: toDate,
      type: type,
      key: station.key,
      name: station.name,
      measuringListUnitStr,
      measuringList,
      measuringData: station.measuringData,
      standardsVN: standards ? standards : standardsVN,
    }
    return result
  }

  componentDidMount() {
    const { stationsData } = this.props
    const { pagination } = this.state

    const stationsDataView = this.getStationDataView(stationsData)
    const stationKey = get(stationsDataView, '[0].key', undefined)

    if (!stationKey) return

    this.handleChangeTab(stationKey)
    const searchFormData = this.getSearchFormData(stationKey)
    this.setState({ dataStationAuto: [], tabKey: stationKey }, () => {
      this.loadData(pagination, searchFormData)
    })
  }

  getStationDataView = stationsData => {
    return stationsData.filter(station => station.view)
  }

  componentWillReceiveProps(nextProps) {
    const prevStationsDataView = this.getStationDataView(
      this.props.stationsData
    )
    const stationsDataView = this.getStationDataView(nextProps.stationsData)
    if (!isEqual(stationsDataView, prevStationsDataView)) {
      const stationKey = get(stationsDataView, '[0].key', undefined)
      if (!stationKey) return
      this.handleChangeTab(stationKey)
      const searchFormData = this.getSearchFormData(stationKey)
      this.setState({ dataStationAuto: [] }, () => {
        this.loadData(this.state.pagination, searchFormData)
      })
    }

    if (!isEqual(this.props.standardsVN, nextProps.standardsVN)) {
      const stationsData = this.getStationDataView(this.props.stationsData)
      const stationKey = get(stationsData, '[0].key', undefined)
      if (!stationKey) return
      const searchFormData = this.getSearchFormData(
        stationKey,
        nextProps.standardsVN
      )
      this.loadData(this.state.pagination, searchFormData)
    }
  }

  getQueryParams(searchFormData) {
    if (isEmpty(searchFormData)) return {}
    const dataStatus = get(searchFormData, 'dataStatus').join(',')
    const defaultStatus = dataStatusOptions.map(item => item.value).join(',')

    const groupType = ['month', 'year'].includes(searchFormData.type)
      ? searchFormData.type
      : 'custom'
    const status = dataStatus.length === 0 ? defaultStatus : dataStatus
    const timeInterval = Number(searchFormData.type) ? searchFormData.type : 0

    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      measuringList: searchFormData.measuringList.join(','),
      standards: searchFormData.standardsVN.join(','),
      isFilter: searchFormData.isFilter,
      status,
      groupType,
      timeInterval,
    }

    return params
  }

  async loadData(pagination, searchFormData) {
    const { setLoading } = this.props
    let paginationQuery = pagination
    const params = Object.assign(this.getQueryParams(searchFormData), {
      page: paginationQuery.current,
      itemPerPage: paginationQuery.pageSize,
    })

    this.setState({ isLoading: true }, async () => {
      const key = get(searchFormData, ['key'])
      setLoading(true)
      const dataStationAuto = await DataInsight.getDataAverage(key, params)
      if (dataStationAuto.error) {
        message.error('ERROR')
        return
      }
      setLoading(false)
      this.setState(
        {
          isLoading: false,
          dataStationAuto: dataStationAuto && dataStationAuto.data,
          pagination: {
            ...paginationQuery,
            total:
              dataStationAuto && dataStationAuto.pagination
                ? dataStationAuto.pagination.totalItem
                : 0,
          },
        },
        () => {
          const { dataStationAuto } = this.state

          if (dataStationAuto.length === 0) {
            return
          }

          const orderedMeaList = dataStationAuto.map(station => {
            const meaKeys = Object.keys(station.measuringLogs)

            return {
              meaKeys,
              length: meaKeys.length,
            }
          })

          const orderedMea = maxBy(orderedMeaList, o => o.length)

          this.setState({
            orderedMeaKey: orderedMea.meaKeys,
          })
        }
      )
    })
  }

  handleChangePage = pagination => {
    const { tabKey } = this.state
    const searchFormData = this.getSearchFormData(tabKey)
    this.loadData({ ...pagination, pageSize: 50 }, searchFormData)
  }

  handleChangeTab = tabKey => {
    this.setState({ tabKey, dataStationAuto: [] }, () => {
      const searchFormData = this.getSearchFormData(tabKey)
      let pagination = {
        ...this.state.pagination,
        current: 1,
      }
      setTimeout(() => {
        this.loadData(pagination, searchFormData)
      })
    })
  }

  async handleExportExcel() {
    const { tabKey } = this.state
    const searchFormData = this.getSearchFormData(tabKey)
    const params = Object.assign(this.getQueryParams(searchFormData), {
      lang: this.props.locale || 'en',
    })
    this.setState({ isExporting: true })
    try {
      const result = await DataInsight.exportDataAverage(
        searchFormData.key,
        params
      )
      downFileExcel(result.data, searchFormData.name)
      this.setState({ isExporting: false })
    } catch (e) {
      this.setState({ isExporting: false })
    }
  }

  async handleExportAllStation() {
    const { stationsData } = this.props
    const allKeys = stationsData.reduce((acc, station) => {
      if (station.view) {
        acc = [...acc, station.key]
      }
      return acc
    }, [])
    let queryData = map(allKeys, key => {
      let searchFormData = this.getSearchFormData(key)
      searchFormData.from = searchFormData.fromDate
      searchFormData.to = searchFormData.toDate
      searchFormData.measuringList = searchFormData.measuringList.join(',')
      searchFormData.measuringListUnitStr = searchFormData.measuringListUnitStr.join(
        ','
      )
      return searchFormData
    })
    const body = {
      stationsQuery: queryData,
    }
    this.setState({ isExportingAll: true }, async () => {
      let res = await exportExcelMultipleStation(body)
      if (res.success) {
        const { data } = await getMe()
        const userEmail = get(data, 'email', '')
        message.success(
          <span>
            {translate('avgSearchFrom.excelMultiple')} <b>{userEmail}</b>
          </span>,
          10
        )
      } else message.error(res.message)

      this.setState({
        isExportingAll: false,
      })
    })
  }

  render() {
    const { stationsData } = this.props
    const stations = stationsData.filter(station => station.view)

    if (!stations.length) return null
    return (
      <StationDataWrapper>
        {this.renderTabStations(stations)}
      </StationDataWrapper>
    )
  }
}
