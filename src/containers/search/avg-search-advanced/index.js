import React from 'react'
import { Spin, Row, Col, message, Button, Menu, Dropdown, Tooltip } from 'antd'
import _ from 'lodash'
import styled from 'styled-components'
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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .label {
    color: #a1a1a1;
    font-size: 15px;
  }
`

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

      flagResetForm: false,

      allowSave: true,
      isEdit: false,

      isSearchingData: false,
      isSearchingStation: false,

      searchData: {},
      filteredConfigFilter: [],
      configFilter: [],

      stationKeys: props.stations.length
        ? props.stations.map(station => station.key)
        : [],
      stationsData: props.stations.length
        ? this.getStationsData(props.stations)
        : [],
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
    if (!_.isEqual(nextProps.values, this.props.formData)) {
      if (nextProps.formData.filterId) {
        this.setState({ allowSave: true, isEdit: true })
      }
      this.setState({ allowSave: true })
    } else {
      this.setState({ allowSave: false, isEdit: false })
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

  handleSearchAvgData = searchData => {
    if (!this.state.stationKeys.length) {
      message.warn(translate('avgSearchFrom.table.emptyText'))
      return
    }
    if (!searchData) {
      this.setState({ isSearchingData: true })
      return
    }
    this.setState({ isSearchingData: true, searchData })
  }

  handleChangeSearchData = searchData => {
    this.setState({ searchData })
  }

  handleSearchStation = searchStationData => {
    return new Promise(resolve => {
      this.setState({ isSearchingStation: true }, async () => {
        const {
          data: stationKeys,
        } = await DataStationAutoApi.searchStationAuto(searchStationData)
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
    const { form } = this.formRef.props
    form.resetFields()
    this.setState({ visible: false })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  resetForm = () => {
    this.setState(prevState => ({ flagResetForm: !prevState.flagResetForm }))
  }

  menu = () => {
    return (
      <Menu style={{ width: 130 }}>
        <Menu.Item style={{ padding: '8px 12px' }} onClick={this.showModal}>
          <Tooltip
            placement="left"
            title={translate('dataSearchFilterForm.tooltip.saveNew')}
          >
            <div>{translate('addon.save')}</div>
          </Tooltip>
        </Menu.Item>
        <Menu.Item style={{ padding: '8px 12px' }} onClick={this.resetForm}>
          <Tooltip
            placement="left"
            title={translate('dataSearchFilterForm.tooltip.reset')}
          >
            <div>{translate('addon.reset')}</div>
          </Tooltip>
        </Menu.Item>
      </Menu>
    )
  }

  rightChildren() {
    if (!this.state.allowSave) return null
    if (this.state.isEdit) {
      return (
        <Flex>
          <span className="label">{translate('addon.edited')}</span>
          <Clearfix width={32} />
          <Button.Group>
            <Tooltip
              placement="top"
              title={translate('dataSearchFilterForm.tooltip.update')}
            >
              <Button
                type="primary"
                icon="save"
                size="default"
                onClick={this.handleUpdateFilter}
              >
                {translate('addon.update')}
              </Button>
            </Tooltip>
            <Dropdown overlay={this.menu()}>
              <Button type="primary" icon="down" />
            </Dropdown>
          </Button.Group>
        </Flex>
      )
    }
    return (
      <Tooltip
        placement="top"
        title={translate('dataSearchFilterForm.tooltip.save')}
      >
        <Button
          type="primary"
          icon="save"
          size="default"
          onClick={this.showModal}
        >
          {translate('addon.save')}
        </Button>
      </Tooltip>
    )
  }

  handleCreateFilter = () => {
    const { form } = this.formRef.props
    const { organizationId } = this.props
    form.validateFields((err, values) => {
      delete this.props.values.searchNow
      delete this.props.values.filterId
      if (err) return
      let params = {
        name: values.name,
        searchUrl: encodeURIComponent(JSON.stringify(this.props.values)),
      }
      this.setState({ confirmLoading: true }, async () => {
        let {
          data,
          error,
          message: messageErr,
        } = await OrganizationApi.createFilter(organizationId, params)
        if (error && messageErr === 'CONFIG_FILTER_NAME_EXISTED') {
          this.setState({
            confirmLoading: false,
          })
          form.setFields({
            name: {
              value: values.name,
              errors: [
                new Error(translate('avgSearchFrom.filterForm.name.isExist')),
              ],
            },
          })
        }
        if (data && data._id) {
          message.success(translate('dataSearchFilterForm.create.success'))
          this.setState({
            confirmLoading: false,
            allowSave: false,
            visible: false,
            configFilter: data.configFilter,
            filteredConfigFilter: data.configFilter,
          })
          form.resetFields()
        }
      })
    })
  }

  handleUpdateFilter = () => {
    const filter = this.state.configFilter.find(
      filter => filter._id === this.props.formData.filterId
    )
    const { organizationId } = this.props

    delete this.props.values.searchNow
    delete this.props.values.filterId
    let params = {
      name: filter.name,
      searchUrl: encodeURIComponent(JSON.stringify(this.props.values)),
    }
    this.setState({ confirmLoading: true }, async () => {
      let { data } = await OrganizationApi.updateFilter(
        organizationId,
        filter._id,
        params
      )
      this.setState({
        confirmLoading: false,
        allowSave: false,
      })
      if (data._id) {
        message.success(translate('dataSearchFilterForm.update.success'))
        this.setState({
          visible: false,
          configFilter: data.configFilter,
          filteredConfigFilter: data.configFilter,
        })
      }
    })
  }

  render() {
    return (
      <PageContainer
        {...this.props.wrapperProps}
        backgroundColor="#fafbfb"
        right={this.rightChildren()}
      >
        <Breadcrumb items={['list']} />
        <Row
          style={{ marginLeft: '-24px', marginRight: '-24px' }}
          type="flex"
          gutter={[32, 0]}
        >
          <FilterListMenu
            configFilter={this.state.filteredConfigFilter}
            handleSearch={this.handleSearch}
            filterId={this.props.formData.filterId}
          />
          <Col style={{ flex: 1, overflowX: 'hidden' }}>
            <SearchFrom
              flagResetForm={this.state.flagResetForm}
              onSubmit={this.handleSearchAvgData}
              onSearchStationAuto={this.handleSearchStation}
              onChangeSearchData={this.handleChangeSearchData}
              initialValues={this.props.formData}
              searchNow={this.props.formData.searchNow}
              // advanced operator
              stationKeys={this.state.stationKeys}
              stations={this.props.stations}
            />
            <Clearfix height={16} />
            <Spin
              size="large"
              tip="Searching..."
              spinning={this.state.isSearchingStation}
            >
              <StationForm
                onChangeStationsData={this.handleChangeStationsData}
                onSearchAvgData={this.handleSearchAvgData}
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
