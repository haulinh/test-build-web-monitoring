import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { Tabs, message } from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow'
import DataStationAutoApi from 'api/DataStationAutoApi'
import TabList from '../tab-list'
import { translate } from 'hoc/create-lang'
import { exportExcelMultipleStation } from 'api/DataStationAutoApi'
import { getMe } from 'api/AuthApi'

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
    stationsData: PropTypes.array,
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
      orderedMeaKey: []
    }
  }

  getStation = stationKey => {
    const { stationsData } = this.props
    let station = stationsData[0]
    if (stationKey) {
      station = stationsData.find(station => station.key === stationKey)
    }

    return station
  }

  getSearchFormData = stationKey => {
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
      isFilter: this.props.isFilter
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
  }

  async loadData(pagination, searchFormData) {
    // console.log({ searchFormData })
    let paginationQuery = pagination
    this.setState({ isLoading: true }, async () => {
      const dataStationAuto = await DataStationAutoApi.getDataStationAutoAvg_v2(
        {
          page: paginationQuery.current,
          itemPerPage: paginationQuery.pageSize,
        },
        searchFormData
      )
      // console.log(JSON.stringify(searchFormData, null, 2), 'searchFormData')
      // console.log(JSON.stringify(dataStationAuto, null, 2), 'dataStationAuto from api')
      if (dataStationAuto.error) {
        message.error('ERROR')
        return
      }
      this.setState({
        isLoading: false,
        dataStationAuto: dataStationAuto && dataStationAuto.data,
        pagination: {
          ...paginationQuery,
          total:
            dataStationAuto && dataStationAuto.pagination
              ? dataStationAuto.pagination.totalItem
              : 0,
        },
      }, () => {
        const orderedMeaList = this.state.dataStationAuto.map(station => {
          const meaKeys = Object.keys(station.measuringLogs)

          return {
            meaKeys,
            length: meaKeys.length
          }
        })
        // console.log(orderedMeaList, '===orderedMea')
        const orderedMea = _.maxBy(orderedMeaList, o => o.length)
        // console.log(orderedMea, '==orderedMea')
        this.setState({
          orderedMeaKey: orderedMea.meaKeys
        })
      })
    })
  }

  handleChangePage = pagination => {
    // const station = this.getStation(this.state.tabKey)
    const searchFormData = this.getSearchFormData(this.state.tabKey)
    this.loadData(pagination, searchFormData)
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

  handleExportExcel = () => {
    const searchFormData = this.getSearchFormData(this.state.tabKey)
    // console.log({ searchFormData })
    this.setState({ isExporting: true }, async () => {
      let res = await DataStationAutoApi.getDataStationAutoExportAvg({
        ...searchFormData,
        language: this.props.locale || 'EN',
      })
      if (res.success) window.open(res.data, '_blank')
      else if (res.code === 16945) {
        message.error(translate('avgSearchFrom.error.dataTooMuch'))
      } else {
        message.error(res.message)
      }

      this.setState({
        isExporting: false,
      })
    })
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
    // const stt = stations.filter(s => s.key === 'NT_XMHT')
    // console.log(JSON.stringify(stt, null, 2), 'station ne')
    // console.log(JSON.stringify(this.state.dataStationAuto, null, 2), '==data ne')
    if (!stations.length) return null
    // console.log("Tablelist " + JSON.stringify(station.measuringData, null, 2))
    return (
      <TableListWrapper>
        <TitleWrapper>
          <h4>{translate('dataSearchFilterForm.table.heading')}</h4>

          {/* {stations.length === 1 && (
            <Button
              icon="file-excel"
              style={{ float: 'right', margin: '5px' }}
              loading={this.state.isExporting}
              type="primary"
              onClick={this.handleExportExcel}
            >
              {translate('avgSearchFrom.tab.exportExcel')}
            </Button>
          )}

          {stations.length > 1 && (
            <Button
              icon="file-excel"
              style={{ float: 'right', margin: '5px' }}
              loading={this.state.isExportingAll}
              type="primary"
              onClick={this.handleExportAllStation}
            >
              {translate('avgSearchFrom.tab.exportExcelAll')}
            </Button>
          )} */}
        </TitleWrapper>

        <Tabs
          defaultActiveKey={this.state.tabKey}
          onChange={this.handleChangeTab}
          activeKey={this.state.tabKey}
        >
          {
            stations.map(station => {
              const newMeasuringData = []
              const newMeasuringList = []

              this.state.orderedMeaKey.forEach(meaKey => {
                const indexMatched = station.measuringList.findIndex(key => key === meaKey)
                if (indexMatched !== -1) {
                  newMeasuringData.push(station.measuringData[indexMatched])
                  newMeasuringList.push(station.measuringList[indexMatched])
                }
                // console.log(station.measuringList, '=station.measuringList')
                // console.log(indexMatched, '=indexMatched')

              })
              // console.log(newMeasuringList, '==newMeasuringList==')
              // console.log(newMeasuringData, '==newMeasuringData==')
              return newMeasuringList.length > 0 && < Tabs.TabPane tab={station.name} key={station.key} >
                <TabList
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
            })
          }

        </Tabs>
      </TableListWrapper >
    )
  }
}
