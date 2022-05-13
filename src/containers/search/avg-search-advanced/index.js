import { Button, Col, Form, Menu, Row, Tooltip } from 'antd'
import OrganizationApi from 'api/OrganizationApi'
import Clearfix from 'components/elements/clearfix'
import { FilterList, ModalSaveFilter } from 'components/filter'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { translate as t, translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _, { get, isEqual } from 'lodash'
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
import {
  addBreadcrumbFilter,
  updateBreadcrumbFilter,
} from 'utils/breadcrumbFilter'
import { replaceVietnameseStr } from 'utils/string'
import Breadcrumb from './breadcrumb'
import DataSearch from './data'
import FormFilter from './form/ModalForm'
import SearchForm from './form/SearchForm'

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .label {
    color: #a1a1a1;
    font-size: 15px;
  }
`

const ListFilter = [
  {
    allowed: true,
    createAt: '2022-04-06T08:46:46.338Z',
    name: 'Kinh Test 01',
    params: {
      frequent: undefined,
      isFilter: false,
      measuringList: 'pH,Temp',
      provinceKey: '',
      rangeTime: 1,
      standardKey: undefined,
      stationAuto: 'TramNuocLanThap',
      type: 15,
    },
    stationType: {
      _id: '5f75aee3684ff600114d96aa',
      key: 'Waste_Water',
      name: 'Nước Thải',
    },
    type: 'Average',
    _id: '624d56fc00bc21bdeea38cf8',
  },
  {
    allowed: true,
    createAt: '2022-04-06T08:46:46.338Z',
    name: 'Kinh Test 02',
    params: {
      frequent: undefined,
      isFilter: false,
      measuringList: 'pH,TSS',
      provinceKey: '',
      rangeTime: 15,
      standardKey: undefined,
      stationAuto: 'TramNuocLanThap',
      type: 60,
    },
    stationType: {
      _id: '5f75aee3684ff600114d96aa',
      key: 'Waste_Water',
      name: 'Nước Thải',
    },
    type: 'Average',
    _id: '624d56fc00bc21bdeea38c787',
  },
]

@Form.create()
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
    this.searchFormRef = React.createRef()
    this.testRef = React.createRef()

    this.state = {
      now: moment(),
      visible: false,
      confirmLoading: false,
      initialData: false,

      flagResetForm: false,

      allowSave: true,

      isSearchingData: false,
      isSearchingStation: false,
      searchFormData: {},

      filteredConfigFilter: [],
      configFilter: [],
      standardsVN: [],
      qcvns: [],
      visibleModalSave: false,

      stationKeys: props.stations.length
        ? props.stations.map(station => station.key)
        : [],
      stationsData: props.stations.length
        ? this.getStationsData(props.stations)
        : [],

      filterList: ListFilter,
      filterListSearched: ListFilter,
      highlightText: '',
      activeKeyMenu: '',
    }
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

  handleOnChangeSearchField = () => {
    this.setState({ isSearchingData: false })
  }

  getStationsData = stations => {
    if (!stations.length) return []
    return stations.map((station, index) => ({
      index,
      _id: get(station._id),
      key: station.key,
      name: station.name,
      view: true,
      measuringData: station.measuringList.sort(
        (a, b) => a.numericalOrder - b.numericalOrder
      ),
      measuringList: station.measuringList.map(measuring => measuring.key),
    }))
  }

  handleChangeStationsData = (stationsData, searchFormData) => {
    this.setState({
      stationsData: this.getStationsData(stationsData),
      isSearchingData: true,
      searchFormData,
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

  handleOnClickSaveFilter = () => {
    this.setState({
      visibleModalSave: true,
    })
  }

  handleOnCancelSaveFilter = () => {
    this.setState({
      visibleModalSave: false,
    })
  }

  handelOnSubmitSaveFilter = async () => {
    const { form } = this.props
    const value = await form.validateFields()
    console.log({ value })
  }

  handleOnChangeSearch = event => {
    const { filterList } = this.state
    const value = event.target.value

    const newFilterListSearched = filterList.filter(({ name }) => {
      name = replaceVietnameseStr(name)

      return name.includes(replaceVietnameseStr(value))
    })

    this.setState({
      highlightText: value,
      filterListSearched: newFilterListSearched,
    })
  }

  handleOnClickFilter = (filterId, filterItem) => {
    const { breadcrumbs, updateBreadcrumb, addBreadcrumb, history } = this.props
    const { params } = filterItem
    const { form } = this.searchFormRef.current.props
    const { handleSearch } = this.searchFormRef.current.forwardRef.current

    const url = `${slug.avgSearchAdvanced.base}?filterId=${filterId}`

    if (breadcrumbs.length === 2) {
      updateBreadcrumbFilter(updateBreadcrumb, url, filterItem.name)
    } else {
      addBreadcrumbFilter(addBreadcrumb, url, filterItem.name)
    }

    history.push(url, { filterId })

    const valuesForm = {
      ...params,
      stationAuto: params.stationAuto.split(','),
      measuringList: params.measuringList.split(','),
    }

    form.setFieldsValue(valuesForm)
    this.setState(
      {
        activeKeyMenu: filterId,
      },
      () => {
        handleSearch()
      }
    )
  }

  componentDidUpdate = (prevProps, prevState) => {
    // const { filterDefault } = this.state
    const { location } = this.props

    if (!isEqual(prevProps.location, location)) {
      if (!location.state) {
        // this.searchFormRef.current.setFieldsValue(filterDefault)
        this.setState({
          filterItem: {},
          activeKeyMenu: null,
          // standardObjectList: {},
        })

        // this.handleOnSearch()
      }
    }
  }
  render() {
    const {
      isSearchingData,
      searchFormData,
      visible,
      confirmLoading,
      stationsData,
      visibleModalSave,
      filterListSearched,
      highlightText,
      activeKeyMenu,
    } = this.state
    const { formData, values, wrapperProps, form } = this.props
    console.log({ ref: this.searchFormRef })

    return (
      <PageContainer
        {...wrapperProps}
        backgroundColor="#fafbfb"
        right={
          <Button type="primary" onClick={this.handleOnClickSaveFilter}>
            {t('storageFilter.button.saveFilter')}
          </Button>
        }
      >
        <Breadcrumb items={['list']} />
        <Row
          style={{ marginLeft: '-24px', marginRight: '-24px' }}
          type="flex"
          gutter={[32, 0]}
        >
          <FilterList
            list={filterListSearched}
            onChangeSearch={this.handleOnChangeSearch}
            highlightText={highlightText}
            onClickMenuItem={this.handleOnClickFilter}
            selectedKeys={[activeKeyMenu]}
          />

          <Col style={{ flex: 1, overflowX: 'hidden' }}>
            <SearchForm
              onChangeStationData={this.handleChangeStationsData}
              initialValues={formData}
              onChangeField={this.handleOnChangeSearchField}
              wrappedComponentRef={this.searchFormRef}
            />
            <Clearfix height={16} />
            <DataSearch
              stationsData={stationsData}
              type={values.type}
              isSearchingData={isSearchingData}
              searchFormData={searchFormData}
            />
            <Clearfix height={40} />
          </Col>
        </Row>
        <FormFilter
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          onCreate={this.handleCreateFilter}
        />
        <ModalSaveFilter
          form={form}
          visible={visibleModalSave}
          onCancel={this.handleOnCancelSaveFilter}
          onSubmitSaveFilter={this.handelOnSubmitSaveFilter}
        />
      </PageContainer>
    )
  }
}
