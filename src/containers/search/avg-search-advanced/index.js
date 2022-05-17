import { Button, Col, Form, message, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import Clearfix from 'components/elements/clearfix'
import { FilterList, ModalSaveFilter } from 'components/filter'
import { ACTION_TYPE, MODULE_TYPE } from 'components/filter/constants'
import ROLE from 'constants/role'
import slug from 'constants/slug'
import { translate as t } from 'hoc/create-lang'
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
import {
  addBreadcrumbFilter,
  updateBreadcrumbFilter,
} from 'utils/breadcrumbFilter'
import { replaceVietnameseStr } from 'utils/string'
import Breadcrumb from './breadcrumb'
import { listFilter } from './constants'
import DataSearch from './data'
import SearchForm from './form/SearchForm'

@Form.create()
@connectAutoDispatch(
  state => ({
    values: _.get(state, 'form.dataSearchFilterForm.values', {}),
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

    this.state = {
      now: moment(),
      loading: false,
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

      filterList: [],
      filterListSearched: [],
      highlightText: '',
      activeKeyMenu: '',
      filterDefault: {},
      filterItem: {},
      filterId: '',
      otherCondition: [],
    }
  }

  componentDidMount() {
    const { history } = this.props
    const {
      location: { state },
    } = history

    if (state) history.push(slug.avgSearchAdvanced.base)
    this.getFilterList()
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { filterDefault } = this.state
    const { location } = this.props
    const { form } = this.searchFormRef.current.props
    const { handleSearch } = this.searchFormRef.current.forwardRef.current

    if (!isEqual(prevProps.location, location)) {
      if (!location.state) {
        form.setFieldsValue(filterDefault)
        this.setState({
          filterItem: {},
          activeKeyMenu: null,
          otherCondition: [],
          filterId: '',
        })

        handleSearch()
      }
    }
  }

  componentWillUnmount() {
    this.props.deleteBreadcrumb({ id: 'detail' })
  }

  initialData = props => {
    if (!props.formData.searchNow) {
      const stationsData = this.getStationsData(props.stations)
      const stationKeys = props.stations.map(station => station.key)
      this.setState({ stationsData, stationKeys, initialData: true })
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

  getFilterList = async () => {
    try {
      const response = await CalculateApi.getFilterList({
        type: MODULE_TYPE.AVERAGE,
      })
      this.setState({
        filterList: response,
        filterListSearched: response,
      })
    } catch (error) {
      console.error({ error })
    }
  }

  handleOnClickSaveFilter = async () => {
    const { form } = this.searchFormRef.current.props
    await form.validateFields()
    this.setState({
      visibleModalSave: true,
    })
  }

  handleOnCancelSaveFilter = () => {
    const { form } = this.props
    this.setState({
      visibleModalSave: false,
    })
    form.resetFields()
  }

  getParamsFilter = () => {
    const { form: formSearch } = this.searchFormRef.current.props
    const { form } = this.props

    const filterName = form.getFieldValue('name')
    const {
      stationAuto,
      measuringList,
      ...otherValues
    } = formSearch.getFieldsValue()

    const paramsFilter = {
      name: filterName.trim(),
      params: {
        ...otherValues,
        stationKeys: stationAuto.join(','),
        measuringList: measuringList.join(','),
      },
      type: MODULE_TYPE.AVERAGE,
    }

    return paramsFilter
  }

  handleOnDeleteFilter = async filterId => {
    const { filterList } = this.state

    try {
      await CalculateApi.deleteFilter(filterId)
      const newFilterList = filterList.filter(filter => filter._id !== filterId)

      this.setState({
        filterList: newFilterList,
        filterListSearched: newFilterList,
        filterItem: {},
      })
      message.success(t('storageFilter.message.deleteSuccess'))
    } catch (error) {
      console.error({ error })
    }
  }

  handelOnSubmitSaveFilter = async () => {
    const { filterId } = this.state
    const { form } = this.props
    const { action } = await form.validateFields()

    const queryParams = this.getParamsFilter()

    try {
      if (action === ACTION_TYPE.UPDATE) {
        this.setState({ filterItem: queryParams })
        await CalculateApi.updateFilter(filterId, queryParams)
        message.success(t('storageFilter.message.updateSuccess'))
      } else {
        const response = await CalculateApi.createFilter(queryParams)
        this.handleOnClickFilter(response._id, response)
        this.setState({
          activeKeyMenu: response._id,
        })

        message.success(t('storageFilter.message.saveSuccess'))
      }

      this.getFilterList()
      this.setState({ visibleModalSave: false })
    } catch (error) {
      console.error({ error })
    }
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
    const {
      handleSearch,
      onStationAutoChange,
    } = this.searchFormRef.current.forwardRef.current
    const url = `${slug.avgSearchAdvanced.base}?filterId=${filterId}`

    if (breadcrumbs.length === 2) {
      updateBreadcrumbFilter(updateBreadcrumb, url, filterItem.name)
    } else {
      addBreadcrumbFilter(addBreadcrumb, url, filterItem.name)
    }

    history.push(url, { filterId })

    const stationAuto = params.stationKeys.split(',')
    const valuesForm = {
      ...params,
      stationAuto,
      measuringList: params.measuringList.split(','),
    }

    const otherCondition = listFilter().filter(
      filter => filterItem.params[filter.key]
    )

    onStationAutoChange(stationAuto)

    this.setState(
      {
        activeKeyMenu: filterId,
        filterId,
        filterItem,
        otherCondition,
      },
      () => {
        setTimeout(() => {
          form.setFieldsValue(valuesForm)
          handleSearch()
        })
      }
    )
  }

  setFilterDefault = filterDefault => {
    this.setState({
      filterDefault,
    })
  }

  setLoading = loading => {}
  render() {
    const {
      isSearchingData,
      searchFormData,
      stationsData,
      visibleModalSave,
      filterListSearched,
      highlightText,
      activeKeyMenu,
      loading,
      filterItem,
      otherCondition,
    } = this.state
    const { values, wrapperProps, form } = this.props
    const isUpdateFilter = !_.isEmpty(filterItem)

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
            onDeleteFilter={this.handleOnDeleteFilter}
          />

          <Col style={{ flex: 1, overflowX: 'hidden' }}>
            <SearchForm
              onChangeStationData={this.handleChangeStationsData}
              otherCondition={otherCondition}
              onChangeField={this.handleOnChangeSearchField}
              wrappedComponentRef={this.searchFormRef}
              setFilterDefault={this.setFilterDefault}
              loading={loading}
            />
            <Clearfix height={16} />
            <DataSearch
              stationsData={stationsData}
              type={values.type}
              isSearchingData={isSearchingData}
              searchFormData={searchFormData}
              setLoadingButton={this.setLoading}
            />
            <Clearfix height={40} />
          </Col>
        </Row>

        <ModalSaveFilter
          filterName={filterItem.name}
          form={form}
          visible={visibleModalSave}
          onCancel={this.handleOnCancelSaveFilter}
          centered
          key={visibleModalSave}
          isUpdate={isUpdateFilter}
          onSubmitSaveFilter={this.handelOnSubmitSaveFilter}
        />
      </PageContainer>
    )
  }
}
