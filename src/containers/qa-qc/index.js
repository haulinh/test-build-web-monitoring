import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import QAQCApi from '../../api/QAQCApi'
import Clearfix from 'components/elements/clearfix/index'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
// import DataAnalyze from './tab-list/tab-table-data-list/data-analyze'
import { Spin } from 'antd'
// import ROLE from 'constants/role'
// import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import { get, size } from 'lodash'

// @protectRole(ROLE.DATA_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class QaQcContainer extends React.Component {
  state = {
    dataStationAuto: [],
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
    },
    dataUpdate: {}
  }

  handleSubmitSearch(searchFormData) {
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData, dataUpdate = {}) {
    this.setState({
      isLoading: true,
      //isHaveData: true
    })

    let dataStationAuto = await QAQCApi.fetchData(
      {
        page: pagination.current,
        itemPerPage: pagination.pageSize
      },
      searchFormData
    )

    const dataStationAutoList = get(dataStationAuto, 'data', [])

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
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total: get(dataStationAuto, 'pagination.totalItem', 0)
      },
      dataUpdate,
      isHaveData: size(dataStationAutoList) > 0
    })
  }

  onChangeData = dataUpdate => {
    this.setState({ dataUpdate })
  }

  handleChangePage(pagination) {
    this.loadData(pagination, this.state.searchFormData, this.state.dataUpdate)
  }

  onApprovedData = async ()  => {
    this.setState({
      isExporting: true
    })
    await QAQCApi.putData(this.state.searchFormData, this.state.dataUpdate)
    //if (res && res.success) window.location = res.data
    //else message.error('Export Error') //message.error(res.message)
    this.setState({
      isExporting: false
    })
  }

  onUnApprovedData = async ()  => {
    this.setState({
      isExporting: true
    })
    await QAQCApi.deleteData(this.state.searchFormData, this.state.dataUpdate)
    //if (res && res.success) window.location = res.data
    //else message.error('Export Error') //message.error(res.message)
    this.setState({
      isExporting: false
    })
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Spin
          size="large"
          tip={translate(get(this.state,'searchFormData.dataType', 'value') === 'value' ? 'qaqc.approved' :  'qaqc.unApprove')}
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
            <TabList
              dataUpdate={this.state.dataUpdate}
              isLoading={this.state.isLoading}
              measuringData={this.state.measuringData}
              measuringList={this.state.measuringList}
              dataStationAuto={this.state.dataStationAuto}
              pagination={this.state.pagination}
              dataFilterBy={ get(this.state,'searchFormData.dataFilterBy', []) }
              onChangePage={this.handleChangePage}
              onApprovedData={this.onApprovedData}
              onChangeData={this.onChangeData}
              nameChart={this.state.searchFormData.name}
              isExporting={this.state.isExporting}
              onUnApprovedData={this.onUnApprovedData}
              valueField={ get(this.state,'searchFormData.dataType', 'value') }
            />
         ) : null}        
         
         </Spin>
      </PageContainer>
    )
  }
}
