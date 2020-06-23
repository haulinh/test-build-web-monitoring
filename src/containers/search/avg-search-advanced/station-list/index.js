import React from 'react'
import { autobind } from 'core-decorators'
import { Tabs, message } from 'antd'
import _ from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow'
import DataStationAutoApi from 'api/DataStationAutoApi'
import { translate } from 'hoc/create-lang'
import TabList from '../tab-list'

const TableListWrapper = styled(BoxShadow)`
  padding: 0px 16px 16px 16px;
`

@autobind
export default class TableList extends React.PureComponent {
  static propTypes = {
    stationsData: PropTypes.array,
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    searchData: PropTypes.shape({
      fromDate: PropTypes.string,
      toDate: PropTypes.string,
      advanced: PropTypes.array,
    }),
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
      pagination: {
        current: 1,
        pageSize: 50,
      },
    }
  }

  getData = stationKey => {
    const { stationsData } = this.props
    const station = stationsData.find(station => station.key === stationKey)
    return station
  }

  getSearchFormData = stationKey => {
    if (!stationKey) return
    const station = this.getData(stationKey)
    const { fromDate, toDate } = this.props.searchData
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
      fromDate: fromDate,
      toDate: toDate,
      key: station.key,
      name: station.name,
      type: this.props.type,
      measuringListUnitStr,
      measuringList: station.measuringList,
      measuringData: station.measuringData,
      advanced: this.props.searchData.advanced,
    }
    return searchFormData
  }

  componentDidMount() {
    const stationsData = this.getStationDataView(this.props.stationsData)
    const stationKey = _.get(stationsData, '[0].key', undefined)
    if (!stationKey) return
    this.setState({ tabKey: stationKey })
    const searchFormData = this.getSearchFormData(stationKey)
    this.loadData(this.state.pagination, searchFormData)
  }

  getStationDataView = stationsData => {
    return stationsData.filter(station => station.view)
  }

  componentWillReceiveProps(nextProps) {
    const nextStationsDataView = this.getStationDataView(nextProps.stationsData)
    const stationsDataView = this.getStationDataView(this.props.stationsData)
    if (!_.isEqual(nextStationsDataView, stationsDataView)) {
      const stationKey = _.get(nextStationsDataView, '[0].key', undefined)
      if (!stationKey) return
      const searchFormData = this.getSearchFormData(stationKey)
      this.loadData(this.state.pagination, searchFormData)
    }
  }

  async loadData(pagination, searchFormData) {
    let paginationQuery = pagination
    this.setState({ isLoading: true }, async () => {
      const dataStationAuto = await DataStationAutoApi.getDataStationAutoAvg(
        {
          page: paginationQuery.current,
          itemPerPage: paginationQuery.pageSize,
        },
        searchFormData
      )
      if (dataStationAuto.error) {
        message.error('ERROR')
        return
      }
      if (!dataStationAuto.data.length) {
        message.warn(translate('avgSearchFrom.table.emptyText'))
      }
      this.setState({
        isLoading: false,
        dataStationAuto: dataStationAuto.success ? dataStationAuto.data : [],
        pagination: {
          ...paginationQuery,
          total: dataStationAuto.success
            ? dataStationAuto.pagination.totalItem
            : 0,
        },
      })
    })
  }

  handleChangePage = pagination => {
    // const station = this.getData(this.state.tabKey)
    const searchFormData = this.getSearchFormData(this.state.tabKey)
    this.loadData(pagination, searchFormData)
  }

  convertDateToString = date => {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  handleChangeTab = tabKey => {
    this.setState({ tabKey })
    const searchFormData = this.getSearchFormData(tabKey)
    let pagination = {
      ...this.state.pagination,
      current: 1,
    }
    this.loadData(pagination, searchFormData)
  }

  handleExportExcel() {
    // const station = this.getData(this.state.tabKey)
    const searchFormData = this.getSearchFormData(this.state.tabKey)
    this.setState({ isExporting: true }, async () => {
      let res = await DataStationAutoApi.getDataStationAutoExportAvg(
        searchFormData
      )
      if (res.success) window.open(res.data, '_blank')
      else message.error(res.message)

      this.setState({
        isExporting: false,
      })
    })
  }

  render() {
    const stations = this.props.stationsData.filter(station => station.view)
    if (!stations.length) return null
    return (
      <TableListWrapper>
        <Tabs
          defaultActiveKey={this.state.tabKey}
          onChange={this.handleChangeTab}
        >
          {stations.map(station => (
            <Tabs.TabPane tab={station.name} key={station.key}>
              <TabList
                isLoading={this.state.isLoading}
                measuringData={station.measuringData}
                measuringList={station.measuringList}
                dataStationAuto={this.state.dataStationAuto}
                pagination={this.state.pagination}
                onChangePage={this.handleChangePage}
                onExportExcel={this.handleExportExcel}
                nameChart={station.name}
                typeReport={`${station.name}`}
                isExporting={this.state.isExporting}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </TableListWrapper>
    )
  }
}
