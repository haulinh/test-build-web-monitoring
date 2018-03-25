import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix'
import TabList from '../tab-list'
import Breadcrumb from '../breadcrumb'
import SearchFrom from '../search-form'

@autobind
export default class MinutesDataSearch extends React.Component {
  state = {
    dataStationAuto: [],
    measuringList: [],
    searchFormData: {},
    lines: [],
    isLoading: false,
    isHaveData: false,
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

    var dataStationAuto = await DataStationAutoApi.getDataStationAutos(
      {
        page: pagination.current,
        itemPerPage: pagination.pageSize
      },
      searchFormData
    )

    this.setState({
      isLoading: false,
      dataStationAuto: dataStationAuto.data,
      measuringList: searchFormData.measuringData,
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total: dataStationAuto.pagination.totalItem
      }
    })
  }

  handleChangePage(pagination) {
    this.loadData(pagination, this.state.searchFormData)
  }

  async handleExportExcel() {
    DataStationAutoApi.getExportData(this.state.searchFormData)
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <SearchFrom onSubmit={this.handleSubmitSearch} />
        <Clearfix height={16} />
        {this.state.isHaveData ? (
          <TabList
            isLoading={this.state.isLoading}
            measuringList={this.state.measuringList}
            dataStationAuto={this.state.dataStationAuto}
            pagination={this.state.pagination}
            onChangePage={this.handleChangePage}
            onExportExcel={this.handleExportExcel}
          />
        ) : null}
      </PageContainer>
    )
  }
}
