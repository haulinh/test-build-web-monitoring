import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import aqiDataStationAuto from 'api/DataStationAutoApi'
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

@protectRole(ROLE.STATISTIC.PER_REC_DATA)
@queryFormDataBrowser(['submit'])
@autobind
export default class PercentReceivedDataContainer extends React.Component {
  state = {
    dataSource: [],
    searchFormData: {},
    dataFrequency: null,
    stationName: null,
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

    const key = searchFormData.key
    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      dataFrequency: searchFormData.dataFrequency,
    }
    let listData = await aqiDataStationAuto.fetchDataStatistict(key, {
      ...params,
    })
    if (
      listData &&
      (Array.isArray(listData.data) && listData.data.length === 0)
    ) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText'),
      })
    }

    this.setState({
      isLoading: false,
      dataSource: _.get(listData, 'data', []),
      searchFormData: searchFormData,
      dataFrequency: searchFormData.dataFrequency,
    })
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true,
    })
    const key = _.get(this.state.searchFormData, 'key', '')
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      dataFrequency: _.get(this.state.searchFormData, 'dataFrequency', 5),
      stationName: _.get(this.state.searchFormData, 'stationName', ''),
    }
    let res = await aqiDataStationAuto.exportDataStatistict(key, { ...params })
    if (res && res.success) window.location = res.data
    else message.error('Export Error') //message.error(res.message)

    this.setState({
      isExporting: false,
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
              dataSource={this.state.dataSource}
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
