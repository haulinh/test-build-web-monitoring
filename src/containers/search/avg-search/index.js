import React from "react"
import { autobind } from "core-decorators"
import PageContainer from "layout/default-sidebar-layout/PageContainer"
import DataStationAutoApi from "api/DataStationAutoApi"
import Clearfix from "components/elements/clearfix/index"
import TabList from "./tab-list/index"
import Breadcrumb from "./breadcrumb"
import SearchFrom from "./search-form/index"
import { message, Spin } from "antd"
import ROLE from "constants/role"
import protectRole from "hoc/protect-role"
import swal from "sweetalert2"
import { translate } from "hoc/create-lang"
import queryFormDataBrowser from "hoc/query-formdata-browser"

@protectRole(ROLE.AVG_SEARCH.VIEW)
@queryFormDataBrowser(["submit"])
@autobind
export default class AvgSearch extends React.Component {
  state = {
    dataStationAuto: [],
    measuringList: [],
    measuringData: [],
    searchFormData: {},
    isLoading: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50
    }
  }

  handleSubmitSearch(searchFormData) {
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({
      isLoading: true,
      isHaveData: true
    })

    const dataStationAuto = await DataStationAutoApi.getDataStationAutoAvg(
      {
        page: pagination.current,
        itemPerPage: pagination.pageSize
      },
      searchFormData
    )
    if (dataStationAuto.error) {
      // console.log('ERRROR', dataStationAuto)
      message.error("ERRROR")
      return
    }
    if (dataStationAuto.data.length === 0) {
      swal({
        type: "success",
        title: translate("avgSearchFrom.table.emptyText")
      })
    }
    this.setState({
      isLoading: false,
      dataStationAuto: dataStationAuto.success ? dataStationAuto.data : [],
      measuringData: searchFormData.measuringData,
      measuringList: searchFormData.measuringList,
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total: dataStationAuto.success
          ? dataStationAuto.pagination.totalItem
          : 0
      }
    })
  }

  handleChangePage(pagination) {
    this.loadData(pagination, this.state.searchFormData)
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true
    })
    let res = await DataStationAutoApi.getDataStationAutoExportAvg(
      this.state.searchFormData
    )
    if (res.success) window.location = res.data
    else message.error(res.message)

    this.setState({
      isExporting: false
    })
  }

  render() {
    // console.log(this.props.formData.searchNow,  "this.props.formData.searchNow")
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={"#fafbfb"}>
        <Spin size="large" tip="Exporting..." spinning={this.state.isExporting}>
          <Breadcrumb items={["list"]} />
          <SearchFrom
            onSubmit={this.handleSubmitSearch}
            initialValues={this.props.formData}
            searchNow={this.props.formData.searchNow}
          />
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <TabList
              isLoading={this.state.isLoading}
              measuringData={this.state.measuringData}
              measuringList={this.state.measuringList}
              dataStationAuto={this.state.dataStationAuto}
              pagination={this.state.pagination}
              onChangePage={this.handleChangePage}
              onExportExcel={this.handleExportExcel}
              nameChart={this.state.searchFormData.name}
              typeReport={`${this.state.searchFormData.type}`}
              isExporting={this.state.isExporting}
            />
          ) : null}
        </Spin>
      </PageContainer>
    )
  }
}
