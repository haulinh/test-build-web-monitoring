import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import QAQCApi from 'api/QAQCApi'
import { measurePublished } from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import { Spin, message } from 'antd'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import { get, size, isEmpty, forEach, isNumber, union, filter, includes } from 'lodash'
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
    dataUpdate: {},
    dataSelected: { checked: false, list: [] },
    published: {}
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
    this.loadData(
      { ...this.state.pagination, current: 1 },
      searchFormData,
      {},
      { checked: false, list: [] },
      published
    )
  }

  async loadData(pagination, searchFormData, dataUpdate, dataSelected, published) {
    this.setState({
      isLoading: true,
      published
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
      dataSelected,
      isHaveData: size(dataStationAutoList) > 0
    })
  }

  // UPDATE CODE

  handleChangePage = pagination => {
    this.loadData(
      pagination,
      this.state.searchFormData,
      this.state.dataUpdate,
      this.state.dataSelected,
      this.state.published
    )
  }

  handerPublished = async (published) => {
    this.setState({ published })
    await measurePublished(published._id, {measureList: get(published, 'publishedList', [])})
  }

  updateRow = (dataStationAuto, dataChange) => {
    this.setState({dataStationAuto, dataChange})
  }

  handleRowChecked = (type, checked) => {
    const dataSelected = get(this.state, 'dataSelected', { checked: false, list: [] })
    if (type === '__ALL__') {
      dataSelected.checked = checked
      dataSelected.list = []
    } else {
      if (includes(dataSelected.list, type)) {
        dataSelected.list = filter(dataSelected.list, _id => _id !== type)
      } else {
        dataSelected.list = union(dataSelected.list, [type])
      }
    }

    this.setState({ dataSelected })
  }

  handleApproved = async (options, putType = undefined) => {
    let body = {}
    if (!isEmpty(options)) {
      body.manualOptions = options
      body.measuringData = this.state.measuringData
    }

    if (putType) {
      body.putType = putType
    }

    if (!isEmpty(this.state.dataUpdate)) {
      body.dataUpdate = this.state.dataUpdate
    }

    if (!isEmpty(this.state.dataSelected)) {
      body.dataSelected = this.state.dataSelected
    }
    const rs = await QAQCApi.putData(this.state.searchFormData, body)

    //if (res && res.success) window.location = res.data
    //else message.error('Export Error') //message.error(res.message)
    if (rs && rs.success) {
      message.success(translate('qaqc.msg.success'))
      this.loadData(
        this.state.pagination,
        this.state.searchFormData,
        {},
        { checked: false, list: [] },
        this.state.published
      )
    } else {
      message.error(translate('qaqc.msg.failure'))
    }
  }

  handleRemoved = () => {
    this.handleApproved(undefined, 'REMOVE')
  }

  handleRestoreData = () => {
    this.handleApproved(undefined, 'RESTORE')
  }

  handleUnApprove = () => {
    this.handleApproved(undefined, 'UN_APPROVE')
  }

  handleManualApproved = options => {
    this.handleApproved(options, 'MANUAL_APPROVE')
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Spin spinning={false} title='Đang xử lý...'>
          <SearchFrom
            initialValues={this.props.formData}
            measuringData={this.props.formData.measuringData}
            onSubmit={this.handleSubmitSearch}
            searchNow={this.props.formData.searchNow}
          />
          {
            this.state.dataStationAuto.length > 0 && 
            <TabList 
              data={this.state.dataStationAuto}
              searchFormData={this.state.searchFormData}
              pagination={this.state.pagination}
              onChangePage={this.handleChangePage}
              dataChange={this.state.dataChange}
              handleSave={this.updateRow}
              dataSelected={this.state.dataSelected}
              onRowChecked={this.handleRowChecked}
              onApproved={this.handleApproved}
              onRemoved={this.handleRemoved}
              onRestoreData={this.handleRestoreData}
              onUnApprove={this.handleUnApprove}
              onManualApproved={this.handleManualApproved}
            />
          }
        </Spin>
      </PageContainer>
    )
  }
}
