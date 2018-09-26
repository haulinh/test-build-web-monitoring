import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix/index'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import DataAnalyze from './tab-list/tab-table-data-list/data-analyze'
import { message, Spin } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'

@protectRole(ROLE.DATA_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class MinutesDataSearch extends React.Component {
  state = {
    dataStationAuto: [],
    dataAnalyzeStationAuto: [],
    measuringList: [],
    measuringData: [],
    searchFormData: {},
    lines: [],
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

    let dataStationAuto = await DataStationAutoApi.getDataStationAutos(
      {
        page: pagination.current,
        itemPerPage: pagination.pageSize
      },
      searchFormData
    )
    console.log('dataStationAuto: ', dataStationAuto)
    if (
      dataStationAuto &&
      (Array.isArray(dataStationAuto.data) && dataStationAuto.data.length === 0)
    ) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText')
      })
    }

    let dataAnalyzeStationAuto = await DataStationAutoApi.getDataAnalyzeStationAutos(
      searchFormData
    )

    this.setState({
      isLoading: false,
      dataAnalyzeStationAuto: dataAnalyzeStationAuto.success
        ? dataAnalyzeStationAuto.data
        : [],
      dataStationAuto: dataStationAuto.data,
      measuringData: searchFormData.measuringData,
      measuringList: searchFormData.measuringList,
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total:
          dataStationAuto && dataStationAuto.pagination
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
    let res = await DataStationAutoApi.getExportData(this.state.searchFormData)
    if (res && res.success) window.location = res.data
    else message.error('Export Error') //message.error(res.message)

    this.setState({
      isExporting: false
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
            initialValues={this.props.formData}
            measuringData={this.props.formData.measuringData}
            onSubmit={this.handleSubmitSearch}
            searchNow={this.props.formData.searchNow}
          />
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <DataAnalyze
              dataAnalyzeStationAuto={this.state.dataAnalyzeStationAuto}
              locale={{
                emptyText: translate('dataSearchFrom.table.emptyText')
              }}
            />
          ) : null}
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <TabList
              isLoading={this.state.isLoading}
              dataAnalyzeStationAuto={this.state.dataAnalyzeStationAuto}
              measuringData={this.state.measuringData}
              measuringList={this.state.measuringList}
              dataStationAuto={this.state.dataStationAuto}
              pagination={this.state.pagination}
              onChangePage={this.handleChangePage}
              onExportExcel={this.handleExportExcel}
              nameChart={this.state.searchFormData.name}
              isExporting={this.state.isExporting}
            />
          ) : null}
        </Spin>
      </PageContainer>
    )
  }
}
