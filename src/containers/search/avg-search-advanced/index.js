import React from 'react'
import { Spin, Row, Col, message, Button } from 'antd'
import _ from 'lodash'
import { translate } from 'hoc/create-lang'
import StationList from './station-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './form/SearchForm'
import StationForm from './form/StationForm'
import DataStationAutoApi from 'api/DataStationAutoApi'
import OrganizationApi from 'api/OrganizationApi'
import { toggleNavigation } from 'redux/actions/themeAction'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { connectAutoDispatch } from 'redux/connect'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { replaceVietnameseStr } from 'utils/string'
import Clearfix from 'components/elements/clearfix'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import FilterListMenu from './menu'
import FormFilter from './form/ModalForm'

@connectAutoDispatch(
  state => ({
    values: _.get(state, 'form.dataSearchFilterForm.values', {}),
    organizationId: _.get(state, 'auth.userInfo.organization._id', 'vasoft'),
    isOpenNavigation: state.theme.navigation.isOpen,
    stations: _.get(state, 'stationAuto.list', []),
    stationAuto: state.stationAuto,
  }),
  { toggleNavigation }
)
@protectRole(ROLE.AVG_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
export default class AvgSearchAdvanced extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmLoading: false,
      initialData: false,

      isSearchingData: false,
      isSearchingStation: false,

      searchData: {},
      filteredConfigFilter: [],
      configFilter: [],

      stationKeys: [],
      stationsData: [],
    }
  }

  componentDidMount() {
    this.getDataOrganization()
    this.props.toggleNavigation(false)
  }

  initialData = props => {
    if (!props.formData.searchNow) {
      const stationsData = this.getStationsData(props.stations)
      const stationKeys = props.stations.map(station => station.key)
      this.setState({ stationsData, stationKeys, initialData: true })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stations.length !== nextProps.stations.length) {
      if (!this.state.initialData) {
        this.initialData(nextProps)
      }
    }
    if (!_.isEqual(this.props.values, nextProps.values)) {
      if (this.state.isSearchingData) this.setState({ isSearchingData: false })
    }
  }

  getDataOrganization = async () => {
    const organizationInfo = await OrganizationApi.getOrganization(
      this.props.organizationId
    )
    this.setState({
      configFilter: _.get(organizationInfo, ['data', 'configFilter']),
      filteredConfigFilter: _.get(organizationInfo, ['data', 'configFilter']),
    })
  }

  getStationsData = stations => {
    if (!stations.length) return []
    return stations.map((station, index) => ({
      index,
      _id: station._id,
      key: station.key,
      name: station.name,
      view: true,
      measuringData: station.measuringList.sort(
        (a, b) => a.numericalOrder - b.numericalOrder
      ),
      measuringList: station.measuringList.map(measuring => measuring.key),
    }))
  }

  handleChangeStationsData = stationsData => {
    this.setState({ stationsData })
  }

  handleSubmitSearch = searchData => {
    if (!this.state.stationKeys.length) {
      message.warn(translate('avgSearchFrom.table.emptyText'))
      return
    }
    this.setState({ isSearchingData: true, searchData })
  }

  handleSearchStation = searchData => {
    return new Promise(resolve => {
      this.setState({ isSearchingStation: true }, async () => {
        const {
          data: stationKeys,
        } = await DataStationAutoApi.searchStationAuto(searchData)
        if (stationKeys) {
          this.setState({ stationKeys, isSearchingStation: false })
          resolve(stationKeys)
        }
      })
    })
  }

  handleSearch = searchText => {
    const { configFilter } = this.state
    const filteredConfigFilter = configFilter.filter(({ name }) => {
      name = replaceVietnameseStr(name)
      return name.includes(replaceVietnameseStr(searchText))
    })

    this.setState({
      filteredConfigFilter,
    })
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  rightChildren() {
    // if (!this.state.allowSave) return null
    return (
      <Button
        type="primary"
        icon="save"
        size="default"
        onClick={this.showModal}
      >
        {translate('addon.save')}
      </Button>
    )
  }

  handleCreateFilter = () => {
    const { form } = this.formRef.props
    const { organizationId } = this.props
    form.validateFields((err, values) => {
      delete this.props.values.searchNow
      if (err) return
      let params = {
        name: values.name,
        searchUrl: encodeURIComponent(JSON.stringify(this.props.values)),
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
          this.setState({
            configFilter: data.configFilter,
            filteredConfigFilter: data.configFilter,
          })
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

  render() {
    return (
      <PageContainer
        {...this.props.wrapperProps}
        backgroundColor="#fafbfb"
        right={this.rightChildren()}
      >
        <Row
          style={{ marginLeft: '-24px', marginRight: '-24px' }}
          type="flex"
          gutter={[32, 0]}
        >
          <FilterListMenu
            configFilter={this.state.filteredConfigFilter}
            handleSearch={this.handleSearch}
          />
          <Col span={this.props.isOpenNavigation ? 24 : 19}>
            <Breadcrumb items={['list']} />
            <SearchFrom
              onSubmit={this.handleSubmitSearch}
              onSearchStationAuto={this.handleSearchStation}
              initialValues={this.props.formData}
              searchNow={this.props.formData.searchNow}
            />
            <Clearfix height={16} />
            <Spin
              size="large"
              tip="Searching..."
              spinning={this.state.isSearchingStation}
            >
              <StationForm
                onChangeStationsData={this.handleChangeStationsData}
                stations={this.props.stations}
                stationKeys={this.state.stationKeys}
              />
            </Spin>
            <Clearfix height={40} />
            {this.state.isSearchingData && this.state.stationsData.length && (
              <StationList
                stationsData={this.state.stationsData}
                searchData={this.state.searchData}
                type={this.props.values.type}
              />
            )}
          </Col>
        </Row>
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
