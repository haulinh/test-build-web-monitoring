import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import wqiApi from 'api/WqiApi'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import * as _ from 'lodash'
import { message, Spin } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
// import moment from "moment-timezone";

@protectRole(ROLE.STATISTIC.AQI)
@queryFormDataBrowser(['submit'])
@autobind
export default class WQIStatisticsDay extends React.Component {
  state = {
    dataWQI: [],
    searchFormData: {},
    lines: [],
    isLoading: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
  }

  handleSubmitSearch(searchFormData) {
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({
      isLoading: true,
      isHaveData: true,
    })

    // let listStationId = searchFormData.stationID

    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      listKey: searchFormData.listStation,
    }

    // console.log(params,searchFormData,"-----")
    let dataWQI = await wqiApi.fetchWqiDaybyListStation({ ...params })
    // console.log(dataWQI, "dataWQI")
    if (dataWQI && _.get(dataWQI, 'data', []).length === 0) {
      swal({
        type: 'warning',
        title: translate('dataSearchFrom.table.emptyText'),
      })
    }

    this.setState({
      isLoading: false,
      dataWQI: _.reverse(_.get(dataWQI, 'data', [])),
      searchFormData: searchFormData,
    })
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true,
    })
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      listKey: _.get(this.state.searchFormData, 'listStation', ''),
    }
    let res = await wqiApi.exportFileWqiDaybyListStation({ ...params })
    if (res && res.success) window.location = res.data
    else message.error('Export Error') //message.error(res.message)

    this.setState({
      isExporting: false,
    })
  }

  async handleManually() {
    this.setState({
      isManually: true,
    })
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      listKey: _.get(this.state.searchFormData, 'listStation', ''),
    }

    let res = await wqiApi.fetchWQIProcessCalDay({ ...params })
    if (res && res.success) {
      message.success('success')
      this.loadData(this.state.pagination, this.state.searchFormData)
    } else {
      message.error('Error')
    }

    this.setState({
      isManually: false,
    })
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Spin
          size="large"
          tip={translate('dataSearchFrom.tab.statusExport')}
          spinning={this.state.isExporting}
        >
          <Breadcrumb items={['list']} />
          <SearchFrom
            onSubmit={this.handleSubmitSearch}
            searchNow={this.props.formData.searchNow}
          />
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <TabList
              isLoading={this.state.isLoading}
              dataWQI={this.state.dataWQI}
              pagination={this.state.pagination}
              onExportExcel={this.handleExportExcel}
              nameChart={this.state.searchFormData.name}
              isExporting={this.state.isExporting}
              onManually={this.handleManually}
              isManually={this.state.isManually}
            />
          ) : null}
        </Spin>
      </PageContainer>
    )
  }
}
