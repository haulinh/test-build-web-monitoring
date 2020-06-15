import React from 'react'
import { autobind } from 'core-decorators'
import { message, Spin, Button, Row, Col } from 'antd'
import * as _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import queryString from 'query-string'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix'
import TabList from './tab-list/index'
import Breadcrumb from './breadcrumb'
// import SearchFrom from './search-form/index'
import SearchFrom from './form/SearchForm'
import OrganizationApi from 'api/OrganizationApi'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { toggleNavigation } from 'redux/actions/themeAction'
import FormFilter from './form/ModalForm'
import FilterListMenu from './menu'
import StationForm from './form/StationForm'

@connectAutoDispatch(
  state => ({
    values: _.get(state, 'form.dataSearchFilterForm.values', {}),
    organizationId: _.get(state, 'auth.userInfo.organization._id', 'vasoft'),
    configFilter: _.get(state, 'auth.userInfo.organization.configFilter', []),
    isOpenNavigation: state.theme.navigation.isOpen,
    stations: _.get(state, 'stationAuto.list', []),
  }),
  { toggleNavigation }
)
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
    configFilter: [],
    filteredConfigFilter: [],
    pagination: {
      current: 1,
      pageSize: 50,
    },
  }

  componentDidMount() {
    this.getDataOrganization()
    this.props.toggleNavigation(false)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(this.props.values, prevProps.values) &&
      this.state.allowSave
    ) {
      this.setState({ allowSave: false })
    }
  }

  getDataOrganization = async () => {
    const organizationInfo = await OrganizationApi.getOrganization(
      this.props.organizationId
    )
    this.setState(
      {
        configFilter: _.get(organizationInfo, ['data', 'configFilter']),
      },
      () => this.setState({ filteredConfigFilter: this.state.configFilter })
    )
  }

  handleSubmitSearch = searchFormData => {
    this.loadData(this.state.pagination, searchFormData)
  }

  handleSaveInfoSearch = searchFormData => {
    this.setState({
      measuringData: searchFormData.measuringData || [],
      measuringList: searchFormData.measuringList || [],
      searchFormData: searchFormData,
    })
  }

  handleOnSearchStationAuto = async searchData => {
    const { data } = await DataStationAutoApi.searchStationAuto(searchData)
    console.log(data)
  }

  handleSaveFilter = () => {
    this.setState({ visible: true })
  }

  loadData = async (pagination, searchFormData) => {
    this.setState({
      isLoading: true,
      isHaveData: true,
    })
    let paginationQuery = pagination
    if (!_.isEqual(searchFormData, this.state.searchFormData)) {
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
          encode: true,
          arrayFormat: 'bracket',
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

  handleSearch = searchText => {
    const { configFilter } = this.state
    const filteredConfigFilter = configFilter.filter(({ name }) => {
      name = name.toLowerCase()
      return name.includes(searchText)
    })

    this.setState({
      filteredConfigFilter,
    })
  }

  render() {
    return (
      <PageContainer
        {...this.props.wrapperProps}
        backgroundColor="#fafbfb"
        right={this.rightChildren()}
      >
        <Spin size="large" tip="Exporting..." spinning={this.state.isExporting}>
          <Row
            style={{ marginLeft: '-24px', marginRight: '-24px' }}
            type="flex"
          >
            <FilterListMenu
              configFilter={this.state.filteredConfigFilter}
              handleSearch={this.handleSearch}
            />
            <Col span={this.props.isOpenNavigation ? 24 : 20}>
              <Breadcrumb items={['list']} />
              <SearchFrom
                onSubmit={this.handleSubmitSearch}
                onSaveInfo={this.handleSaveInfoSearch}
                onSearchStationAuto={this.handleOnSearchStationAuto}
                initialValues={this.props.formData}
                searchNow={this.props.formData.searchNow}
              />
              <Clearfix height={16} />
              <StationForm stations={this.props.stations} />
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
            </Col>
          </Row>
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
