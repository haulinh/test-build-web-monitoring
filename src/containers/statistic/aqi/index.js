import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import aqiApi from 'api/AqiApi'
import Clearfix from 'components/elements/clearfix/index'
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
export default class AQIStatistics extends React.Component {
  state = {
    dataAqiHours: [],
    dataAqiDays: [],
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
 
    const key = searchFormData.key
    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate
    }
    let dataAQI = await aqiApi.fetchAqiHistory(key, {...params})
    const aqiHours = _.groupBy(_.get(dataAQI, 'data', []), item => item.type === 'H')
    const aqiDays = _.groupBy(_.get(dataAQI, 'data', []), item => item.type === 'D')  
    if (
      dataAQI &&
      (Array.isArray(dataAQI.data) && dataAQI.data.length === 0) 
    ) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText')
      })
    }

    this.setState({
      isLoading: false,
      dataAqiHours: _.get(aqiHours,'true',[]),
      dataAqiDays: _.get(aqiDays,'true',[]),
      searchFormData: searchFormData
    })
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true
    })
    // let res = await dataStationFixedApi.exportData(this.state.searchFormData)
    // if (res && res.success) window.location = res.data
    // else message.error('Export Error') //message.error(res.message)

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
              dataAqiHours={this.state.dataAqiHours}
              dataAqiDays={this.state.dataAqiDays}
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
