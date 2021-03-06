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
import _, { get, isEmpty, isEqual } from 'lodash'
import moment from 'moment'
import React from 'react'
import { toggleNavigation } from 'redux/actions/themeAction'
import { connectAutoDispatch } from 'redux/connect'
import {
  addBreadcrumb,
  deleteBreadcrumb,
  updateBreadcrumb,
} from 'shared/breadcrumb/action'
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

      isSearchingData: false,
      isChangeField: false,
      searchFormData: {},
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
      filterSearch: {},
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
    const {
      handleSearch,
      updateForm,
    } = this.searchFormRef.current.forwardRef.current

    if (!isEqual(prevProps.location, location)) {
      if (!location.state) {
        this.setState(
          {
            filterItem: {},
            filterSearch: {},
            activeKeyMenu: null,
            otherCondition: [],
            filterId: '',
          },
          () => {
            form.setFieldsValue(filterDefault)
            updateForm({ stationAutoKeys: filterDefault.stationAuto })
            handleSearch()
          }
        )
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

  handleOnChangeSearchField = () => {
    this.setState({ isChangeField: true, isSearchingData: false })
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
      isChangeField: false,
      searchFormData,
    })
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
    const { measuringList, stationAuto } = form.getFieldsValue()

    if (isEmpty(measuringList) || isEmpty(stationAuto)) return

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
    const { updateForm } = this.searchFormRef.current.forwardRef.current
    const url = `${slug.avgSearchAdvanced.base}?filterId=${filterId}`

    const breadCrumbsDetail = this.getBreadcrumbDetail({
      url: url,
      name: filterItem.name,
    })

    if (breadcrumbs.length === 2) {
      updateBreadcrumb(breadCrumbsDetail)
    } else {
      addBreadcrumb(breadCrumbsDetail)
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

    updateForm({ stationAutoKeys: stationAuto })

    this.setState({
      activeKeyMenu: filterId,
      filterId,
      filterItem,
      otherCondition,
      filterSearch: valuesForm,
      isSearchingData: true,
    })
  }

  setFilterDefault = filterDefault => {
    this.setState({
      filterDefault,
    })
  }

  getBreadcrumbDetail = ({ url, name }) => {
    return {
      id: 'detail',
      icon: '',
      href: url,
      name,
      autoDestroy: true,
    }
  }

  setLoading = loading => {
    this.setState({ loading })
  }
  render() {
    const {
      isSearchingData,
      isChangeField,
      searchFormData,
      stationsData,
      visibleModalSave,
      filterListSearched,
      highlightText,
      activeKeyMenu,
      loading,
      filterItem,
      filterSearch,
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

          <Col
            style={{
              flex: 1,
              overflowX: 'hidden',
              margin: '0 -15px',
            }}
          >
            <SearchForm
              onChangeStationData={this.handleChangeStationsData}
              otherCondition={otherCondition}
              filterSearch={filterSearch}
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
              isChangeField={isChangeField}
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
