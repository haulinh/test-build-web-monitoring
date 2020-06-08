import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix/index'
import TabList from './tab-list/index'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form/index'
import { message, Spin, Typography, Row, Col, Button, Menu } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import swal from 'sweetalert2'
import { translate } from 'hoc/create-lang'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { isEqual as _isEqual } from 'lodash'
import styled from 'styled-components'

const i18n = {
  titleSubMenuAvgData: translate('avgSearchFrom.search.subMenuAvgData.title'),
  dataSearch: translate('avgSearchFrom.search.subMenuAvgData.dataSearch'),
  titleSubMenuFilters: translate('avgSearchFrom.search.subMenuFilters'),
}

const mockFilters = [
  {
    id: '0ace8a0b-9f51-5b48-9380-94d7acbe9d54',
    name: 'trung bình ngay',
  },
  { id: '6d9c0789-9aa9-525d-8db4-9aae1758031e', name: 'trung bình 8 giờ max' },
  { id: '8e8db8f1-3219-5764-b420-bafa317b1d90', name: 'Tung Tung Report' },
  { id: 'e3b451e8-4ed6-51a4-afe5-b58ce1cce2ec', name: 'other filter' },
]

const { SubMenu } = Menu

const SideFilters = styled.div`
  position: fixed;
`

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
  }

  handleSubmitSearch(searchFormData) {
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
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
      // console.log('ERRROR', dataStationAuto)
      message.error('ERRROR')
      return
    }
    if (dataStationAuto.data.length === 0) {
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
          <Row>
            <Col span={3}>
              <Clearfix height={16} />
              <SideFilters>
                <Menu
                  style={{ width: 200 }}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                >
                  <SubMenu key="sub2" title={i18n.titleSubMenuAvgData}>
                    <Menu.Item key="1">{i18n.dataSearch}</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub1" title={i18n.titleSubMenuFilters}>
                    {mockFilters.map(filter => (
                      <Menu.Item key={filter.id}>{filter.name}</Menu.Item>
                    ))}
                  </SubMenu>
                </Menu>
              </SideFilters>
            </Col>
            <Col span={21}>
              <React.Fragment>
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
              </React.Fragment>
            </Col>
          </Row>
        </Spin>
      </PageContainer>
    )
  }
}
