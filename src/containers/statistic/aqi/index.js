import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import dataStationFixedApi from 'api/DataStationFixedApi'
import aqiApi from 'api/AqiApi'
import Clearfix from 'components/elements/clearfix/index'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import { message, Spin } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'

@protectRole(ROLE.STATION_FIXED_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class AQIStatistics extends React.Component {
  state = {
    dataAQI: [],
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
    console.log(searchFormData)
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({
      isLoading: true,
      isHaveData: true
    })
 
    const key = searchFormData.key
    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      type: 'H'

    }
    let dataAQI = await aqiApi.fetchAqiHistory(key, params)
    console.log(dataAQI.data)
    // if (
    //   dataAQI &&
    //   (Array.isArray(dataAQI.data) && dataAQI.data.length === 0)
    // ) {
    //   swal({
    //     type: 'success',
    //     title: translate('dataSearchFrom.table.emptyText')
    //   })
    // }

    // this.setState({
    //   isLoading: false,
    //   dataAQI: dataAQI.data,
    //   searchFormData: searchFormData,
    //   pagination: {
    //     ...pagination,
    //     total:
    //       dataAQI && dataAQI.pagination
    //         ? dataAQI.pagination.totalItem
    //         : 0
    //   }
    // })
  }

  handleChangePage(pagination) {
    this.loadData(pagination, this.state.searchFormData)
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true
    })
    let res = await dataStationFixedApi.exportData(this.state.searchFormData)
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
            onSubmit={this.handleSubmitSearch}
            searchNow={this.props.formData.searchNow}
          />
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <TabList
              isLoading={this.state.isLoading}
              dataAnalyzeStationAuto={this.state.dataAnalyzeStationAuto}
              dataAQI={this.state.dataAQI}
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
