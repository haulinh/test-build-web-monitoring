import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
// import { measurePublished } from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
// import TabList from './approved-data/tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './approved-data/search-form'
import TableList from './approved-data/tables/'
import { Row, Spin } from 'antd'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import _, { get, size, isEmpty, forEach, isNumber } from 'lodash'
import moment from 'moment-timezone'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { getConfigApi } from 'config'
import PageInfo from 'components/pageInfo'
import { QAQC_TABLES } from 'constants/qaqc'

@protectRole(ROLE.QAQC.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class QaQcContainer extends React.Component {
  state = {
    selectedTable: QAQC_TABLES.original,
    dataStationAuto: [],
    measuringList: [], // danh sach do user lựa chọn
    measuringData: [], // danh sach full cua station
    searchFormData: {},
    lines: [],
    isLoading: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
    dataUpdate: {},
    dataSelected: { checked: false, list: [] },
    published: {},
  }

  render() {
    return (
      <div>
        {getConfigApi().isAdvanced
          ? this._renderPageContent()
          : this._renderPageInfo()}
      </div>
    )
  }

  _renderPageContent() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Spin spinning={false} title="Đang xử lý...">
          <Row>
            <SearchFrom
              initialValues={this.props.formData}
              measuringData={this.props.formData.measuringData}
              onSubmit={this.handleSubmitSearch}
              changeDataType={this._handleChangeDataType}
              searchNow={this.props.formData.searchNow}
            />
          </Row>
          {this.state.isHaveData && (
            <Row style={{ paddingTop: 8 }}>
              <TableList
                dataSource={this.state.dataStationAuto}
                measuringData={this.state.measuringData}
                measuringList={this.state.measuringList}
                selectedTable={this.state.selectedTable}
              />
            </Row>
          )}
        </Spin>
      </PageContainer>
    )
  }

  _renderPageInfo() {
    return <PageInfo />
  }

  _handleChangeDataType(type) {
    // show từng table cụ thể theo loại dữ liệu
    this.setState({ selectedTable: type })
  }

  handleSubmitSearch(searchFormData, published) {
    let outOfRange = {}
    forEach(
      get(searchFormData, 'measuringData', []),
      ({ minRange, maxRange, key }) => {
        let val = {}
        if (isNumber(minRange)) val.minRange = minRange
        if (isNumber(maxRange)) val.maxRange = maxRange

        if (!isEmpty(val)) {
          outOfRange[key] = val
        }
      }
    )
    if (!isEmpty(outOfRange))
      searchFormData.outOfRange = JSON.stringify(outOfRange)
    this.loadData({ ...this.state.pagination, current: 1 }, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({ isLoading: true })

    /* MARK  @mockup MOCKUP API */
    let res = await fetch(
      'https://my.api.mockaroo.com/dataSearch.json?key=b2a3b960'
    )
    let data = await res.json()
    let sortedData = _.orderBy(
      data,
      o => moment(o.receivedAt).valueOf(),
      'desc'
    )
    let dataStationAuto = {
      data: sortedData,
    }

    /* MARK  @mockup KHONG XOA, DO chưa có server nên xài mockup ở trên */
    // let dataStationAuto = await QAQCApi.fetchData(
    //   {
    //     page: pagination.current,
    //     itemPerPage: pagination.pageSize
    //   },
    //   searchFormData
    // )

    let dataStationAutoList = get(dataStationAuto, 'data', [])

    if (size(dataStationAutoList) === 0) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText'),
      })
    }

    this.setState({
      isLoading: false,
      isHaveData: size(dataStationAutoList) !== 0,
      dataStationAuto: dataStationAutoList,
      measuringData: searchFormData.measuringData,
      measuringList: searchFormData.measuringList,
      searchFormData: searchFormData,
      pagination: {
        ...pagination,
        total: get(dataStationAuto, 'pagination.totalItem', 0),
      },
    })
  }
}
