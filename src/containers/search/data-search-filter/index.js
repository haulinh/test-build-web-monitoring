import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix/index'
import TabList from './tab-list/index'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form/index'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import OrganizationApi from 'api/OrganizationApi'
import { message, Spin, Button } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { isEqual as _isEqual } from 'lodash'
import FormFilter from './form'
import queryString from 'query-string'

@connect(state => ({
  values: _.get(state, 'form.dataSearchFilterForm.values', {}),
  organizationId: _.get(state, 'auth.userInfo.organization._id', ''),
}))
@protectRole(ROLE.AVG_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class AvgSearch extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
    dataStationAuto: [],
    measuringList: [],
    measuringData: [],
    searchFormData: {},
    isLoading: false,
    allowSave: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
  }

  handleSubmitSearch = searchFormData => {
    this.loadData(this.state.pagination, searchFormData)
  }

  handleSaveFilter = searchFormData => {
    this.setState({ visible: true })
  }

  loadData = async (pagination, searchFormData) => {
    this.setState({
      isLoading: true,
      isHaveData: true,
    })
    let paginationQuery = pagination
    if (!_isEqual(searchFormData, this.state.searchFormData)) {
      this.setState({ allowSave: true })
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
      message.warn(translate('avgSearchFrom.table.emptyText'))
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

  handleChangePage = pagination => {
    this.loadData(pagination, this.state.searchFormData)
  }

  handleExportExcel = async () => {
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

  rightChildren() {
    if (!this.state.allowSave) return null
    return (
      <Button
        type="primary"
        icon="save"
        size="default"
        onClick={this.handleSaveFilter}
      >
        {translate('addon.save')}
      </Button>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(this.props.values, prevProps.values) &&
      this.state.allowSave
    ) {
      this.setState({ allowSave: false })
    }
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleCreateFilter = () => {
    const { form } = this.formRef.props
    const { organizationId } = this.props
    form.validateFields((err, values) => {
      if (err) return
      let params = {
        name: values.name,
        searchUrl: queryString.stringify(this.props.values, {
          encode: false,
          arrayFormat: 'comma',
          skipNull: true,
          skipEmptyString: true,
        }),
      }
      this.setState({ confirmLoading: true }, async () => {
        let { data, error } = await OrganizationApi.createFilter(
          organizationId,
          params
        )
        this.setState({
          confirmLoading: false,
          allowSave: false,
        })
        if (data._id) {
          message.success(translate('dataSearchFilterForm.create.success'))
          this.setState({ visible: false })
          form.resetFields()
        }
        if (error && data.message === 'CONFIG_FILTER_NAME_EXISTED') {
          form.setFields({
            name: {
              value: values.name,
              errors: [
                new Error(translate('dataSearchFilterForm.create.nameIsExist')),
              ],
            },
          })
        }
      })
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  render() {
    // console.log(this.props.formData.searchNow,  "this.props.formData.searchNow")
    return (
      <PageContainer
        {...this.props.wrapperProps}
        backgroundColor={'#fafbfb'}
        right={this.rightChildren()}
      >
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
        <FormFilter
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          onCreate={this.handleCreateFilter}
        />
      </PageContainer>
    )
  }
}
