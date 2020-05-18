import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
// import { measurePublished } from 'api/StationAuto'
import DataStationAutoApi from 'api/DataStationAutoApi'
import QAQCApi from 'api/QAQCApi'
import { translate } from 'hoc/create-lang'
// import TabList from './approved-data/tab-list'
import Breadcrumb from '../breadcrumb'
import SearchFrom from './search-form'
import TableList from './tables'
import { Spin } from 'antd'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import _, { get, size, isEmpty, forEach, isNumber } from 'lodash'
// import moment from "moment-timezone"
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
// import { getConfigApi } from "config"
import PageInfo from 'components/pageInfo'
import { QAQC_TABLES } from 'constants/qaqc'
import { connect } from 'react-redux'

@protectRole(ROLE.QAQC.VIEW)
@queryFormDataBrowser(['submit'])
@connect(state => ({
  token: get(state, 'auth.token', ''),
  timeZone: get(state, 'auth.userInfo.organization.timeZone', null)
}))
@autobind
export default class QaQcContainer extends React.Component {
  state = {
    selectedTable: QAQC_TABLES.original,
    dataStationAuto: [],
    measuringList: [], // danh sach do user lựa chọn
    measuringData: [], // danh sach full cua station
    searchFormData: {},
    lines: [],
    isLoading: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50
    },
    dataUpdate: {},
    dataSelected: { checked: false, list: [] },
    published: {}
  }

  render() {
    return <div>{this._renderPageContent()}</div>
  }

  handleExportExcel = async () => {
    const { searchFormData } = this.state

    console.log(searchFormData, 'searchFormData')
    let query = {}
    if (searchFormData.dataType !== QAQC_TABLES.original) {
      query = _.pick(searchFormData, [
        'fromDate',
        'toDate',
        'dataType',
        'key',
        'measuringList',
        'stationAutoType'
      ])
      // console.log(searchFormData, "searchFormData")
      let url = QAQCApi.downloadExcel(this.props.token, query)
      //  console.log(url, "url--------")
      window.open(url, '_blank')
    } else {
      query = _.pick(searchFormData, [
        'fromDate',
        'toDate',
        'key',
        'measuringList'
      ])
      let res = await DataStationAutoApi.getExportData(query)
      if (res && res.success) window.location = res.data
    }
  }

  _renderPageContent() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <SearchFrom
          initialValues={this.props.formData}
          measuringData={this.props.formData.measuringData}
          onSubmit={this.handleSubmitSearch}
          // changeDataType={this._handleChangeDataType}
        />
        <Spin spinning={this.state.isLoading}>
          <TableList
            isLoading={this.state.isLoading}
            dataSource={this.state.dataStationAuto}
            measuringData={this.state.measuringData}
            measuringList={this.state.measuringList}
            selectedTable={this.state.selectedTable}
            pagination={this.state.pagination}
            onChangePage={this.handleChangePage}
            submitExcel={this.handleExportExcel}
          />
        </Spin>
      </PageContainer>
    )
  }

  _renderPageInfo() {
    return <PageInfo />
  }

  _handleChangeDataType(type) {
    // show từng table cụ thể theo loại dữ liệu
    this.setState({ selectedTable: type })
  }

  handleSubmitSearch(searchFormData, published) {
    let outOfRange = {}
    forEach(
      get(searchFormData, 'measuringData', []),
      ({ minRange, maxRange, key }) => {
        let val = {}
        if (isNumber(minRange)) val.minRange = minRange
        if (isNumber(maxRange)) val.maxRange = maxRange

        if (!isEmpty(val)) {
          outOfRange[key] = val
        }
      }
    )
    if (!isEmpty(outOfRange))
      searchFormData.outOfRange = JSON.stringify(outOfRange)

    this.loadData({ ...this.state.pagination }, searchFormData)
  }

  handleChangePage(pagination) {
    this.loadData(pagination, this.state.searchFormData)
  }

  async loadData(pagination, searchFormData) {
    // console.log(searchFormData,"searchFormData")
    this.setState({ isLoading: true })

    let dataStationAuto = []

    let query = {}
    if (searchFormData.dataType !== QAQC_TABLES.original) {
      query = _.pick(searchFormData, [
        'fromDate',
        'toDate',
        'dataType',
        'key',
        'measuringList',
        'stationAutoType'
      ])
      // console.log(searchFormData, "searchFormData")

      const res = await QAQCApi.fetchData(
        {
          page: pagination.current,
          itemPerPage: pagination.pageSize
        },
        query
      )
      if (res.success) {
        dataStationAuto = res
      }
    } else {
      query = _.pick(searchFormData, [
        'fromDate',
        'toDate',
        'key',
        'measuringList'
      ])
      const res = await DataStationAutoApi.getDataStationAutos(
        {
          page: pagination.current,
          itemPerPage: pagination.pageSize
        },
        query
      )
      if (res.success) {
        dataStationAuto = res
      }
    }

    let dataStationAutoList = get(dataStationAuto, 'data', [])

    if (size(dataStationAutoList) === 0) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText')
      })
    }

    this.setState({
      isLoading: false,
      dataStationAuto: dataStationAutoList,
      measuringData: searchFormData.measuringData,
      measuringList: searchFormData.measuringList,
      selectedTable: searchFormData.dataType,
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total: get(dataStationAuto, 'pagination.totalItem', 0)
      }
    })
  }
}
