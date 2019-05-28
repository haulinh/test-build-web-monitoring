import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import aqiApi from 'api/AqiApi'
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

@protectRole(ROLE.STATISTIC.AQI)
@queryFormDataBrowser(['submit'])
@autobind
export default class AQIStatisticsDay extends React.Component {
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
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({
      isLoading: true,
      isHaveData: true
    })
    
    // let listStationId = searchFormData.stationID
    
    const params = {
      from: searchFormData.fromDate,
      to:  searchFormData.toDate,
      listKey: searchFormData.stationID,
      timezoneDay: searchFormData.timezoneDay
    }
    let dataAQI = await aqiApi.fetchAqiDaybyListStation({ ...params })
    // console.log(dataAQI, "dataAQI")
    if (dataAQI && _.get(dataAQI,'data',[]).length === 0 ) {
      swal({
        type: 'warning',
        title: translate('dataSearchFrom.table.emptyText')
      })
    }

    this.setState({
      isLoading: false,
      dataAQI: _.get(dataAQI, 'data', []),
      searchFormData: searchFormData
    })
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true
    })
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      listKey:  _.get(this.state.searchFormData, 'stationID', ''),
      timezoneDay: _.get(this.state.searchFormData, 'timezoneDay', ''),
    }
    let res = await aqiApi.exportFileAqiDaybyListStation( { ...params })
    if (res && res.success) window.location = res.data
    else message.error('Export Error') //message.error(res.message)

    this.setState({
      isExporting: false
    })
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Spin size="large" tip={translate('dataSearchFrom.tab.statusExport')} spinning={this.state.isExporting}>
          <Breadcrumb items={['list']} />
          <SearchFrom  onSubmit={this.handleSubmitSearch} searchNow={this.props.formData.searchNow} />
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <TabList
              isLoading={this.state.isLoading}
              dataAQI={this.state.dataAQI}
              pagination={this.state.pagination}
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
