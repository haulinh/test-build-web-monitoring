import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix/index'
import TabList from './tab-list/index'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form/index'
import { message, Spin } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import swal from 'sweetalert2'
import { translate } from 'hoc/create-lang'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { isEqual as _isEqual } from 'lodash'
import _ from 'lodash'
import AuthApi from 'api/AuthApi'
import OrganizationApi from 'api/OrganizationApi'

@protectRole(ROLE.AVG_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
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
      pageSize: 50,
    },
    configFilter: [],
  }

  componentDidMount() {
    this.getDataOrganization()
  }

  getDataOrganization = async () => {
    const userInfo = await AuthApi.getMe()
    const id = _.get(userInfo, 'data.organization._id', 'vasoft')
    const organizationInfo = await OrganizationApi.getOrganization(id)
    this.setState({
      configFilter: _.get(organizationInfo, ['data', 'configFilter']),
    })
  }

  handleSubmitSearch = searchFormData => {
    this.loadData(this.state.pagination, searchFormData)
  }

  loadData = async (pagination, searchFormData) => {
    this.setState({
      isLoading: true,
      isHaveData: true,
    })
    let paginationQuery = pagination
    if (!_isEqual(searchFormData, this.state.searchFormData)) {
      paginationQuery = {
        ...paginationQuery,
        current: 1,
      }
    }

    const dataStationAuto = await DataStationAutoApi.getDataStationAutoAvg(
      {
        page: paginationQuery.current,
        itemPerPage: paginationQuery.pageSize,
      },
      searchFormData
    )
    if (dataStationAuto.error) {
      // console.log('ERROR', dataStationAuto)
      message.error('ERROR')
      return
    }
    if (!dataStationAuto.data.length) {
      swal({
        type: 'success',
        title: translate('avgSearchFrom.table.emptyText'),
      })
    }
    this.setState({
      isLoading: false,
      dataStationAuto: dataStationAuto.success ? dataStationAuto.data : [],
      measuringData: searchFormData.measuringData,
      measuringList: searchFormData.measuringList,
      searchFormData: searchFormData,
      pagination: {
        ...paginationQuery,
        total: dataStationAuto.success
          ? dataStationAuto.pagination.totalItem
          : 0,
      },
    })
  }

  handleChangePage(pagination) {
    this.loadData(pagination, this.state.searchFormData)
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true,
    })

    // console.log(this.state.searchFormData,"this.state.searchFormData")
    let res = await DataStationAutoApi.getDataStationAutoExportAvg(
      this.state.searchFormData
    )
    if (res.success) window.location = res.data
    else message.error(res.message)

    this.setState({
      isExporting: false,
    })
  }

  handleClick = e => {
    console.log('click ', e)
  }

  render() {
    // console.log(this.props.formData.searchNow,  "this.props.formData.searchNow")
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Spin size="large" tip="Exporting..." spinning={this.state.isExporting}>
          <Breadcrumb items={['list']} />
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
