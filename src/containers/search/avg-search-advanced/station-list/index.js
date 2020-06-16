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
  }

  static defaultProps = {
    stationsData: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      tabKey: props.stationsData[0] && props.stationsData[0].key,
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

  getParams = station => {
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
    const params = {
      fromDate: this.convertDateToString(fromDate),
      toDate: this.convertDateToString(toDate),
      key: station.key,
      name: station.key,
      type: this.props.type,
      measuringListUnitStr,
      measuringList: station.measuringList,
      measuringData: station.measuringData,
    }
    return params
  }

  componentDidMount() {
    const station = this.getData(this.props.stationsData[0].key)
    const params = this.getParams(station)
    this.loadData(this.state.pagination, params)
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

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.tabKey !== this.state.tabKey) {
      const station = this.getData(this.state.tabKey)
      const params = this.getParams(station)
      let pagination = {
        ...this.state.pagination,
        current: 1,
      }
      this.loadData(pagination, params)
    }
  }

  handleChangePage = pagination => {
    const station = this.getData(this.state.tabKey)
    const params = this.getParams(station)

    this.loadData(pagination, params)
  }

  convertDateToString = date => {
    return moment(date, 'YYYY-MM-DD HH:mm').toISOString()
  }

  getStationsByKeys = () => {
    if (!this.props.stations.length) return
    const stations = this.props.stations.filter(station =>
      this.props.stationKeys.includes(station.key)
    )
    return stations
  }

  handleChangeTab = tabKey => {
    this.setState({ tabKey })
  }

  handleExportExcel() {
    const station = this.getData(this.state.tabKey)
    const searchFormData = this.getParams(station)
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
