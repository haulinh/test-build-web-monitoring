import { Button, Col, Dropdown, Menu, message, Row, Spin, Tooltip } from 'antd'
import DataStationAutoApi from 'api/DataStationAutoApi'
import OrganizationApi from 'api/OrganizationApi'
import Clearfix from 'components/elements/clearfix'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import update from 'immutability-helper'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { toggleNavigation } from 'redux/actions/themeAction'
import { connectAutoDispatch } from 'redux/connect'
import {
  addBreadcrumb,
  deleteBreadcrumb,
  updateBreadcrumb,
} from 'shared/breadcrumb/action'
import styled from 'styled-components'
import { replaceVietnameseStr } from 'utils/string'
import Breadcrumb from './breadcrumb'
import FormFilter from './form/ModalForm'
import SearchFrom from './form/SearchForm'
import StationForm from './form/StationForm'
import FilterListMenu from './menu'
import StationList from './station-list'

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
    breadcrumbs: state.breadcrumbs,
  }),
  { toggleNavigation, updateBreadcrumb, addBreadcrumb, deleteBreadcrumb }
)
@protectRole(ROLE.AVG_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
export default class AvgSearchAdvanced extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      now: moment(),
      visible: false,
      confirmLoading: false,
      initialData: false,

      flagResetForm: false,

      allowSave: true,

      isSearchingData: false,
      isSearchingStation: false,

      filteredConfigFilter: [],
      configFilter: [],
      standardsVN: [],

      stationKeys: props.stations.length
        ? props.stations.map(station => station.key)
        : [],
      stationsData: props.stations.length
        ? this.getStationsData(props.stations)
        : [],
    }
  }

  setNow = newNow => {
    this.setState({
      now: newNow,
    })
  }

  componentDidMount() {
    this.getDataOrganization()
    // this.props.toggleNavigation(false)
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
    if (this.props.formData.filterId !== nextProps.formData.filterId) {
      const filter = this.state.configFilter.find(
        filter => filter._id === nextProps.formData.filterId
      )
      if (filter) {
        const searchObj = JSON.parse(decodeURIComponent(filter.searchUrl))
        searchObj.searchNow = true
        searchObj.filterId = filter._id
        if (nextProps.breadcrumbs.length === 2) {
          this.props.updateBreadcrumb({
            id: 'detail',
            icon: '',
            href:
              slug.avgSearchAdvanced.base +
              '?formData=' +
              encodeURIComponent(JSON.stringify(searchObj)),
            name: filter.name,
            autoDestroy: true,
          })
        } else {
          this.props.addBreadcrumb({
            id: 'detail',
            icon: '',
            href:
              slug.avgSearchAdvanced.base +
              '?formData=' +
              encodeURIComponent(JSON.stringify(searchObj)),
            name: filter.name,
            autoDestroy: true,
          })
        }
      } else {
        this.props.deleteBreadcrumb({ id: 'detail' })
      }
    }
  }

  getIsEdit = () => {
    const values = _.clone(this.props.values)
    const formData = _.clone(this.props.formData)
    if (formData.rangesDate !== 'ranges') {
      delete values.fromDate
      delete values.toDate
    }
    return !_.isEqual(values, formData) && !!values.filterId
  }

  getAllowSave = () => {
    return (
      // !!this.props.values.stationType &&
      this.state.allowSave && !this.props.values.filterId
    )
  }

  getDataOrganization = async () => {
    const organizationInfo = await OrganizationApi.getOrganization(
      this.props.organizationId
    )

    this.setState(
      {
        configFilter: _.get(organizationInfo, ['data', 'configFilter']),
        filteredConfigFilter: _.get(organizationInfo, ['data', 'configFilter']),
      },
      () => {
        if (this.props.formData.filterId) {
          const filter = this.state.configFilter.find(
            filter => filter._id === this.props.formData.filterId
          )
          if (filter) {
            const searchObj = JSON.parse(decodeURIComponent(filter.searchUrl))
            searchObj.searchNow = true
            searchObj.filterId = filter._id
            if (this.props.breadcrumbs.length === 2) {
              this.props.updateBreadcrumb({
                id: 'detail',
                icon: '',
                href:
                  slug.avgSearchAdvanced.base +
                  '?formData=' +
                  encodeURIComponent(JSON.stringify(searchObj)),
                name: filter.name,
                autoDestroy: true,
              })
            } else {
              this.props.addBreadcrumb({
                id: 'detail',
                icon: '',
                href:
                  slug.avgSearchAdvanced.base +
                  '?formData=' +
                  encodeURIComponent(JSON.stringify(searchObj)),
                name: filter.name,
                autoDestroy: true,
              })
            }
          }
        }
      }
    )
  }

  componentWillUnmount() {
    this.props.deleteBreadcrumb({ id: 'detail' })
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

  handleSearchAvgData = newNow => {
    // console.log("Big component => handleSearchAvgData" + newNow.format('DD/MM/YYYY HH:mm:ss'))
    if (!this.state.stationKeys.length) {
      // message.warn(translate('avgSearchFrom.table.emptyText'))
      return
    }

    this.setState(
      {
        now: newNow,
      },

      () => this.setState({ isSearchingData: true })
    )
  }

  handleSearchStation = searchStationData => {
    // console.log("Search station")
    // console.log(JSON.stringify(searchStationData, null, 2))
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
    const isEdit = this.getIsEdit()
    // const allowSave = this.getAllowSave()
    if (isEdit) {
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
    // if (!allowSave) return null
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
    const rawValues = _.clone(this.props.values)
    delete rawValues.searchNow
    delete rawValues.filterId
    if (rawValues.rangesDate !== 'ranges') {
      delete rawValues.fromDate
      delete rawValues.toDate
    }
    if (rawValues.stationType === '') {
      rawValues.stationType = 'ALL'
    }
    form.validateFields((err, values) => {
      if (err) return
      let params = {
        name: (values.name || '').trim(),
        searchUrl: encodeURIComponent(JSON.stringify(rawValues)),
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
    const rawValues = _.clone(this.props.values)
    delete rawValues.searchNow
    delete rawValues.filterId
    if (rawValues.rangesDate !== 'ranges') {
      delete rawValues.fromDate
      delete rawValues.toDate
    }
    let params = {
      name: filter.name,
      searchUrl: encodeURIComponent(JSON.stringify(rawValues)),
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

  handleDeleteFilter = async _id => {
    const indexDelete = this.state.filteredConfigFilter.findIndex(
      configFilterItem => configFilterItem._id === _id
    )
    this.setState(prevState =>
      update(prevState, {
        filteredConfigFilter: { $splice: [[indexDelete, 1]] },
        configFilter: { $splice: [[indexDelete, 1]] },
      })
    )
    const { data } = await OrganizationApi.deleteFilter(
      this.props.organizationId,
      _id
    )
    if (data) message.success(translate('dataSearchFilterForm.update.success'))
  }

  onChangeQcvn = (qcvnIds, list) => {
    const qcvnSelected = list.filter(item => qcvnIds.includes(item._id))

    this.setState({
      standardsVN: qcvnSelected.map(qcvn => qcvn.key),
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
            handleDeleteFilter={this.handleDeleteFilter}
            configFilter={this.state.filteredConfigFilter}
            handleSearch={this.handleSearch}
            filterId={this.props.formData.filterId}
          />
          <Col style={{ flex: 1, overflowX: 'hidden' }}>
            <SearchFrom
              flagResetForm={this.state.flagResetForm}
              onSubmit={this.handleSearchAvgData}
              onSearchStationAuto={this.handleSearchStation}
              initialValues={this.props.formData}
              searchNow={this.props.formData.searchNow}
              // advanced operator
              stationKeys={this.state.stationKeys}
              stations={this.props.stations}
              now={this.state.now}
              setNow={this.setNow}
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
                formData={this.props.formData}
              />
            </Spin>
            <Clearfix height={40} />
            <Row type="flex" align="middle">
              <Col
                span={4}
                style={{
                  textAlign: 'right',
                  paddingRight: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {translate('dataAnalytics.standardViews')}
              </Col>
              <Col span={20}>
                <SelectQCVN
                  mode="multiple"
                  maxTagCount={3}
                  maxTagTextLength={18}
                  onChange={this.onChangeQcvn}
                />
              </Col>
            </Row>
            <Clearfix height={40} />
            {this.state.isSearchingData && this.state.stationsData.length && (
              <StationList
                standardsVN={this.state.standardsVN}
                stationsData={this.state.stationsData}
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
