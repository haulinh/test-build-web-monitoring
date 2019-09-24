import React from "react"
import { autobind } from "core-decorators"
import PageContainer from "layout/default-sidebar-layout/PageContainer"
// import { measurePublished } from 'api/StationAuto'
import DataStationAutoApi from 'api/DataStationAutoApi'
import QAQCApi from 'api/QAQCApi'
import { translate } from "hoc/create-lang"
// import TabList from './approved-data/tab-list'
import Breadcrumb from "../breadcrumb"
import SearchFrom from "./search-form"
import TableList from "./tables"
import { Spin } from "antd"
import queryFormDataBrowser from "hoc/query-formdata-browser"
import swal from "sweetalert2"
import _, { get, size, isEmpty, forEach, isNumber } from "lodash"
// import moment from "moment-timezone"
import ROLE from "constants/role"
import protectRole from "hoc/protect-role"
import { getConfigApi } from "config"
import PageInfo from "components/pageInfo"
import { QAQC_TABLES } from "constants/qaqc"

@protectRole(ROLE.QAQC.VIEW)
@queryFormDataBrowser(["submit"])
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
    return (
      <div>
        {getConfigApi().isAdvanced
          ? this._renderPageContent()
          : this._renderPageInfo()}
      </div>
    )
  }

  _renderPageContent() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={"#fafbfb"}>
        <Breadcrumb items={["list"]} />
        <Spin spinning={false}>
          <SearchFrom
            initialValues={this.props.formData}
            measuringData={this.props.formData.measuringData}
            onSubmit={this.handleSubmitSearch}
            changeDataType={this._handleChangeDataType}
          />
          {!this.state.isLoading && (
            <TableList
              dataSource={this.state.dataStationAuto}
              measuringData={this.state.measuringData}
              measuringList={this.state.measuringList}
              selectedTable={this.state.selectedTable}
              pagination={this.state.pagination}
            />
          )}
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
      get(searchFormData, "measuringData", []),
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

    this.loadData({ ...this.state.pagination, current: 1 }, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({ isLoading: true })
    pagination = {
      page : pagination.current, itemPerPage : pagination.pageSize
    }

    let dataStationAuto = []

    if (searchFormData.dataType != QAQC_TABLES.original) {

      const query = _.pick(searchFormData,['fromDate','toDate', 'dataType','key','measuringList','stationAutoType'])
      console.log(searchFormData,"searchFormData")
      console.log(pagination.pageSize,"pagination.pageSize")
      const res = await QAQCApi.fetchData(pagination,query )
      if(res.success){
        dataStationAuto = res
      }
      
    }else{
      const query = _.pick(searchFormData,['fromDate','toDate','key','measuringList'])
      const res = await DataStationAutoApi.getDataStationAutos(pagination,query )
      if(res.success){
        dataStationAuto = res
      }
    }

    let dataStationAutoList = get(dataStationAuto, "data", [])

    if (size(dataStationAutoList) === 0) {
      swal({
        type: "success",
        title: translate("dataSearchFrom.table.emptyText")
      })
    }

    this.setState({
      isLoading: false,
      dataStationAuto: dataStationAutoList,
      measuringData: searchFormData.measuringData,
      measuringList: searchFormData.measuringList,
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total: get(dataStationAuto, "pagination.totalItem", 0)
      }
    })
  }
}
