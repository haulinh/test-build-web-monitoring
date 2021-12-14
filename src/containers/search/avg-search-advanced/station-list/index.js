import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { Tabs, message } from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow'
import TabList from '../tab-list'
import { translate } from 'hoc/create-lang'
import { exportExcelMultipleStation } from 'api/DataStationAutoApi'
import { getMe } from 'api/AuthApi'
import DataInsight from 'api/DataInsight'
import {dataStatusOptions} from 'constants/dataStatus'
import {downFileExcel} from 'utils/downFile'

const TableListWrapper = styled(BoxShadow)`
  padding: 0px 16px 16px 16px;
`

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h4 {
    margin-bottom: 0px;
    font-size: 22px;
  }
`

@connect(state => ({
  fromDate: state.form['dataSearchFilterForm'].values.fromDate,
  toDate: state.form['dataSearchFilterForm'].values.toDate,
  advanced: state.form['dataSearchFilterForm'].values.advanced
    ? state.form['dataSearchFilterForm'].values.advanced.filter(
        item =>
          item.measuringKey &&
          item.operator &&
          item.value !== null &&
          typeof item.value !== 'undefined'
      )
    : [],
  dataStatus: state.form['dataSearchFilterForm'].values.dataStatus || [],
  isFilter: state.form['dataSearchFilterForm'].values.isFilter || false,
  locale: state.language.locale,
}))
@autobind
export default class TableList extends React.PureComponent {
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
    return (
      <Tabs
        defaultActiveKey={this.state.tabKey}
        onChange={this.handleChangeTab}
        activeKey={this.state.tabKey}
      >
        {stations.map(station => {
          return this.renderOneStation(station)
        })}
      </Tabs>
    )
  }

  renderOneStation(station) {
    const newMeasuringData = []
    const newMeasuringList = []

    this.state.orderedMeaKey.forEach(meaKey => {
      const indexMatched = station.measuringList.findIndex(
        key => key === meaKey
      )
      if (indexMatched !== -1) {
        newMeasuringData.push(station.measuringData[indexMatched])
        newMeasuringList.push(station.measuringList[indexMatched])
      }
    })

    return (
      <Tabs.TabPane tab={station.name} key={station.key}>
        <TabList
          qcvns={this.props.qcvns}
          isActive={this.state.tabKey === station.key}
          isLoading={this.state.isLoading}
          measuringData={newMeasuringData}
          measuringList={newMeasuringList}
          dataStationAuto={this.state.dataStationAuto}
          pagination={this.state.pagination}
          onChangePage={this.handleChangePage}
          onExportExcel={this.handleExportExcel}
          onExportExcelAll={this.handleExportAllStation}
          nameChart={station.name}
          typeReport={`${this.props.type}`}
          isExporting={this.state.isExporting}
          isExportingAll={this.state.isExportingAll}
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
    if (!stationKey) return
    const station = this.getStation(stationKey)
    // console.log(station, '==station==')
    const { fromDate, toDate } = this.props
    const measuringListUnitStr = station.measuringList.map(item => {
      const itemFind = _.find(station.measuringData, obj => {
        return obj.key === item
      })
      if (itemFind) {
        return encodeURIComponent(_.get(itemFind, 'unit', ''))
      } else {
        return ''
      }
    })
    const searchFormData = {
      fromDate,
      toDate,
      key: station.key,
      name: station.name,
      type: this.props.type,
      measuringListUnitStr,
      measuringList: station.measuringList,
      measuringData: station.measuringData,
      advanced: this.props.advanced,
      dataStatus: this.props.dataStatus,
      isFilter: this.props.isFilter,
      standardsVN: standards ? standards : this.props.standardsVN,
    }
    return searchFormData
  }

  componentDidMount() {
    const stationsData = this.getStationDataView(this.props.stationsData)
    const stationKey = _.get(stationsData, '[0].key', undefined)
    if (!stationKey) return
    this.setState({ tabKey: stationKey }, () => {
      const searchFormData = this.getSearchFormData(stationKey)
      this.loadData(this.state.pagination, searchFormData)
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
    if (!_.isEqual(stationsDataView, prevStationsDataView)) {
      const stationKey = _.get(stationsDataView, '[0].key', undefined)
      if (!stationKey) return
      this.handleChangeTab(stationKey)
      const searchFormData = this.getSearchFormData(stationKey)
      this.setState({ dataStationAuto: [] }, () => {
        this.loadData(this.state.pagination, searchFormData)
      })
    }

    if (!_.isEqual(this.props.standardsVN, nextProps.standardsVN)) {
      const stationsData = this.getStationDataView(this.props.stationsData)
      const stationKey = _.get(stationsData, '[0].key', undefined)
      if (!stationKey) return
      const searchFormData = this.getSearchFormData(
        stationKey,
        nextProps.standardsVN
      )
      this.loadData(this.state.pagination, searchFormData)
    }
  }

  getQueryParams(searchFormData){
    const dataStatus = searchFormData.dataStatus.join(',')
    const defaultStatus = dataStatusOptions.map(item => item.value).join(',')

    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      measuringList: searchFormData.measuringList.join(','),
      standards: searchFormData.standardsVN.join(','),
      isFilter: searchFormData.isFilter,
      status: dataStatus.length === 0 ? defaultStatus : dataStatus,
      groupType: ['month', 'year'].includes(searchFormData.type) ? searchFormData.type : 'custom' ,
      timeInterval: searchFormData.type,
    }

    return params
  }

  async loadData(pagination, searchFormData) {
    let paginationQuery = pagination
    const params = Object.assign(
      this.getQueryParams(searchFormData),
      {
        page: paginationQuery.current,
        itemPerPage: paginationQuery.pageSize,
      }
    )

    this.setState({ isLoading: true }, async () => {
      const dataStationAuto = await DataInsight.getDataAverage(
        searchFormData.key,
        params
      )
      if (dataStationAuto.error) {
        message.error('ERROR')
        return
      }
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
          if (this.state.dataStationAuto.length === 0) {
            return
          }

          const orderedMeaList = this.state.dataStationAuto.map(station => {
            const meaKeys = Object.keys(station.measuringLogs)

            return {
              meaKeys,
              length: meaKeys.length,
            }
          })

          const orderedMea = _.maxBy(orderedMeaList, o => o.length)

          this.setState({
            orderedMeaKey: orderedMea.meaKeys,
          })
        }
      )
    })
  }

  handleChangePage = pagination => {
    // const station = this.getStation(this.state.tabKey)
    const searchFormData = this.getSearchFormData(this.state.tabKey)
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

  async handleExportExcel(){
    const searchFormData = this.getSearchFormData(this.state.tabKey)
    const params = Object.assign(
      this.getQueryParams(searchFormData),
      {lang: this.props.locale || 'en' }
    )
    this.setState({isExporting: true})
    try {
      const result = await DataInsight.exportDataAverage(searchFormData.key, params)
      downFileExcel(result.data, searchFormData.key)
      this.setState({isExporting: false})
    } catch (e) {

      this.setState({isExporting: false})
    }
  }

  async handleExportAllStation() {
    const allKeys = this.props.stationsData.reduce((acc, station) => {
      if (station.view) {
        acc = [...acc, station.key]
      }
      return acc
    }, [])
    let queryData = _.map(allKeys, key => {
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
        const userEmail = _.get(data, 'email', '')
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
    const stations = this.props.stationsData.filter(station => station.view)
    // console.log(stations.length, 'length statuib')
    // const stt = stations.filter(s => s.key === 'NT_XMHT')
    // console.log(JSON.stringify(stt, null, 2), 'station ne')
    // console.log(JSON.stringify(this.state.dataStationAuto, null, 2), '==data ne')
    if (!stations.length) return null
    // console.log("Tablelist " + JSON.stringify(station.measuringData, null, 2))
    return (
      <TableListWrapper>
        <TitleWrapper>
          <h4>{translate('dataSearchFilterForm.table.heading')}</h4>
        </TitleWrapper>

        {this.renderTabStations(stations)}
      </TableListWrapper>
    )
  }
}
