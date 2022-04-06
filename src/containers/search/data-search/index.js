import { Button, Col, Form as FormAnt, message, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import DataInsight from 'api/DataInsight'
import BoxShadowStyle from 'components/elements/box-shadow'
import Clearfix from 'components/elements/clearfix/index'
import Heading from 'components/elements/heading'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import { FilterList, ModalSaveFilter } from 'components/filter'
import { ACTION_TYPE, MODULE_TYPE } from 'components/filter/constants'
import ROLE from 'constants/role'
import createLang, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _, { isEmpty, isEqual } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { getTimes, getTimesUTC } from 'utils/datetime'
import { downFileExcel } from 'utils/downFile'
import { getParamArray } from 'utils/params'
import { replaceVietnameseStr } from 'utils/string'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import TabList from './tab-list'
import DataAnalyze from './tab-list/tab-table-data-list/data-analyze'
import { withRouter } from 'react-router-dom'
import slug from 'constants/slug'
import { connectAutoDispatch } from 'redux/connect'
import {
  addBreadcrumb,
  deleteBreadcrumb,
  updateBreadcrumb,
} from 'shared/breadcrumb/action'
import { translate as t } from 'hoc/create-lang'

export const fields = {
  stationKey: 'stationKey',
  stationType: 'stationType',
  rangesDate: 'rangesDate',
  dataType: 'dataType',
  filterBy: 'filterBy',
  isExceeded: 'isExceeded',
  province: 'province',
  measuringList: 'measuringList',
  facetFields: 'facetFields',
  from: 'from',
  to: 'to',
}

export const ITEM_PER_PAGE = 50

@withRouter
@connectAutoDispatch(
  state => ({
    breadcrumbs: state.breadcrumbs,
  }),
  { updateBreadcrumb, addBreadcrumb, deleteBreadcrumb }
)
@protectRole(ROLE.DATA_SEARCH.VIEW)
@connect(state => ({
  locale: state.language.locale,
  stationAutoByKey: _.keyBy(state.stationAuto.list, 'key'),
}))
@createLang
@FormAnt.create()
export default class MinutesDataSearch extends React.Component {
  state = {
    summary: [],
    data: [],
    page: 1,
    totalItem: null,
    standards: [],
    filterList: [],
    filterListSearched: [],
    filterItem: {},
    filterId: '',
    standardObjectList: [],
    loadingData: false,
    qcvnSelected: [],
    loadingSummary: false,
    loadingExport: false,
    visibleModalSave: false,
    highlightText: '',
    filterDefault: {},
  }
  searchFormRef = React.createRef()

  componentDidMount = () => {
    const { history } = this.props
    this.getFilterList()
    history.push(slug.dataSearch.base)
  }

  componentWillUnmount = () => {
    const { deleteBreadcrumb } = this.props
    deleteBreadcrumb({
      id: 'detail',
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { filterDefault } = this.state
    const { location } = this.props

    if (!isEqual(prevProps.location, location)) {
      if (!location.state) {
        this.searchFormRef.current.setFieldsValue(filterDefault)
        this.setState({
          filterItem: {},
        })

        this.handleOnSearch()
      }
    }
  }

  getFilterList = async () => {
    try {
      const response = await CalculateApi.getFilterList({
        type: MODULE_TYPE.ORIGINAL,
      })

      this.setState({
        filterList: response,
        filterListSearched: response,
      })
    } catch (error) {
      console.error({ error })
    }
  }

  getValuesForm = e => {
    if (!e) return null
    if (e.hasOwnProperty('valuesForm')) return e.valuesForm
    return null
  }

  getQueryParam = e => {
    const valuesForm = this.getValuesForm(e)
    const values = valuesForm || this.searchFormRef.current.getFieldsValue()
    const { standards, page } = this.state

    const times = getTimes(values[fields.rangesDate])
    const { from, to } = getTimesUTC(times)
    const params = {
      ...values,
      from,
      to,
      [fields.measuringList]: getParamArray(values[fields.measuringList]),
      [fields.filterBy]: getParamArray(values[fields.filterBy]),
      page,
      itemPerPage: ITEM_PER_PAGE,
      standards: getParamArray(standards),
    }
    return params
  }

  getMeasuringList = () => {
    const measuringList = this.searchFormRef.current.getFieldValue(
      fields.measuringList
    )

    return measuringList || []
  }

  getStationAuto = () => {
    const stationKey = this.searchFormRef.current.getFieldValue(
      fields.stationKey
    )

    return stationKey || ''
  }

  handleOnSearch = async valuesForm => {
    const { filterItem } = this.state

    const valueForm = await this.searchFormRef.current.validateFields()

    const { stationKey, rangesDate, ...queryParams } = this.getQueryParam(
      valuesForm
    )

    if (isEmpty(filterItem)) {
      this.setState({
        filterDefault: valueForm,
      })
    }

    this.setState({
      loadingData: true,
      loadingSummary: true,
    })

    const over1Year =
      moment(queryParams.to).diff(moment(queryParams.from), 'year') > 1
    if (over1Year) {
      DataInsight.getDataOriginal(stationKey, {
        ...queryParams,
        [fields.facetFields]: 'summary,pagination',
      })
        .then(res => {
          this.setState({
            summary: res.summary,
            totalItem: res.pagination.totalItem,
            loadingSummary: false,
          })
        })
        .catch(e => {
          console.error({ e })
          this.setState({ loadingSummary: false })
        })

      DataInsight.getDataOriginal(stationKey, {
        ...queryParams,
        [fields.facetFields]: 'data',
      })
        .then(res => {
          this.setState({
            data: res.data,
            loadingData: false,
          })
        })
        .catch(e => {
          console.error({ e })
          this.setState({ loadingData: false })
        })

      return
    }

    try {
      const res = await DataInsight.getDataOriginal(stationKey, {
        ...queryParams,
      })
      this.setState({
        summary: res.summary,
        data: res.data,
        totalItem: _.get(res, 'pagination.totalItem'),
        loadingData: false,
        loadingSummary: false,
      })
    } catch (error) {
      console.error({ error })
      this.setState({ loadingData: false, loadingSummary: false })
    }
  }

  exportExcel = async () => {
    const { locale, stationAutoByKey } = this.props
    const { stationKey, rangesDate, ...queryParams } = this.getQueryParam()

    await this.searchFormRef.current.validateFields()

    this.setState({ loadingExport: true })
    try {
      const result = await DataInsight.exportDataOriginal(stationKey, {
        ...queryParams,
        lang: locale,
      })
      this.setState({ loadingExport: false })
      downFileExcel(result.data, stationAutoByKey[stationKey].name)
    } catch (error) {
      this.setState({ loadingExport: true })
      console.error({ error })
    }
  }

  onChangeQcvn = (standards, listQcvn) => {
    const qcvnSelected = standards.map(key => {
      return {
        ...listQcvn.find(qcvn => qcvn.key === key),
      }
    })

    this.setState({ standards, qcvnSelected })
  }

  handleOnFetchSuccessQCVN = standardObjectList => {
    this.setState({ standardObjectList })
  }

  onClickSaveFilter = async () => {
    await this.searchFormRef.current.validateFields()

    this.setState({ visibleModalSave: true })
  }

  onCancelModal = () => {
    this.setState({ visibleModalSave: false })
  }

  getParamsFilter = () => {
    const { form } = this.props

    const valueFormSearch = this.searchFormRef.current.getFieldsValue()

    const measuringList = valueFormSearch.measuringList.join(',')

    const filterName = form.getFieldValue('name')

    const queryParams = {
      type: MODULE_TYPE.ORIGINAL,
      name: filterName.trim(),
      params: {
        ...valueFormSearch,
        measuringList,
      },
    }

    return queryParams
  }

  onSubmitSaveFilter = async () => {
    const { form } = this.props
    const { filterId } = this.state

    const { action } = await form.validateFields()

    const queryParams = this.getParamsFilter()

    try {
      if (action === ACTION_TYPE.UPDATE) {
        this.setState({ filterItem: queryParams })
        await CalculateApi.updateFilter(filterId, queryParams)
        message.success(t('storageFilter.message.updateSuccess'))
      } else {
        await CalculateApi.createFilter(queryParams)

        message.success(t('storageFilter.message.saveSuccess'))
      }

      this.getFilterList()
      this.setState({ visibleModalSave: false })
    } catch (error) {
      console.error({ error })
    }
  }
  onClickFilter = (filterId, filterItem) => {
    const { breadcrumbs, updateBreadcrumb, addBreadcrumb, history } = this.props

    const url = `${slug.dataSearch.base}/${filterId}`
    if (breadcrumbs.length === 2) {
      updateBreadcrumb({
        id: 'detail',
        icon: '',
        href: url,
        name: filterItem.name,
        autoDestroy: true,
      })
    } else {
      addBreadcrumb({
        id: 'detail',
        icon: '',
        href: url,
        name: filterItem.name,
        autoDestroy: true,
      })
    }
    history.push(url, { filterId })

    const params = filterItem.params

    this.searchFormRef.current.setFieldsValue({
      ...params,
      measuringList: params.measuringList.split(','),
    })

    this.setState({ filterItem, filterId }, () => this.handleOnSearch())
  }

  onDeleteFilter = async filterId => {
    const { filterList } = this.state

    try {
      await CalculateApi.deleteFilter(filterId)
      const newFilterList = filterList.filter(filter => filter._id !== filterId)

      this.setState({
        filterList: newFilterList,
        filterListSearched: newFilterList,
      })
      message.success(t('storageFilter.message.deleteSuccess'))
    } catch (error) {
      console.error({ error })
    }
  }

  onChangeSearch = event => {
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

  setPage = page => this.setState({ page }, () => this.handleOnSearch())

  render() {
    const {
      data,
      summary,
      loadingData,
      loadingSummary,
      page,
      totalItem,
      loadingExport,
      standards,
      filterListSearched,
      filterList,
      qcvnSelected,
      standardObjectList,
      visibleModalSave,
      highlightText,
      filterItem,
    } = this.state

    const { form } = this.props

    const isUpdateFilter = !_.isEmpty(filterItem)

    const measuringList = this.searchFormRef.current
      ? this.getMeasuringList()
      : []
    const stationKey = this.searchFormRef.current ? this.getStationAuto() : ''

    return (
      <PageContainer
        {...this.props.wrapperProps}
        right={
          <Button type="primary" onClick={this.onClickSaveFilter}>
            {t('storageFilter.button.saveFilter')}
          </Button>
        }
        backgroundColor={'#fafbfb'}
      >
        <Breadcrumb items={['list']} />

        <Row type="flex" style={{ marginLeft: '-24px', marginRight: '-24px' }}>
          <FilterList
            list={filterListSearched}
            onChangeSearch={this.onChangeSearch}
            highlightText={highlightText}
            onClickMenuItem={this.onClickFilter}
            key={filterList}
            onDeleteFilter={this.onDeleteFilter}
          />
          <Col style={{ flex: 1, overflowX: 'hidden' }}>
            <Clearfix height={16} />
            <BoxShadowStyle>
              <Heading
                rightChildren={
                  <Button
                    loading={loadingData || loadingSummary}
                    type="primary"
                    icon="search"
                    size="small"
                    onClick={this.handleOnSearch}
                  >
                    {this.props.lang.t('addon.search')}
                  </Button>
                }
                textColor="#ffffff"
                isBackground
                fontSize={14}
                style={{ padding: '8px 16px' }}
              >
                {this.props.lang.t('addon.search')}
              </Heading>
              <SearchFrom
                ref={this.searchFormRef}
                onSearch={this.handleOnSearch}
              />
            </BoxShadowStyle>

            <Clearfix height={16} />
            <DataAnalyze
              loading={loadingSummary}
              dataAnalyzeStationAuto={summary}
              locale={{
                emptyText: translate('dataSearchFrom.table.emptyText'),
              }}
            />

            <Clearfix height={16} />
            <Row
              gutter={12}
              style={{ marginLeft: 16 }}
              type="flex"
              align="middle"
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {translate('dataAnalytics.standardViews')}
              </span>
              <Col span={8}>
                <SelectQCVN
                  onFetchSuccess={this.handleOnFetchSuccessQCVN}
                  fieldValue="key"
                  mode="multiple"
                  maxTagCount={3}
                  maxTagTextLength={18}
                  onChange={this.onChangeQcvn}
                />
              </Col>
            </Row>

            <TabList
              qcvnSelected={qcvnSelected}
              loadingExport={loadingExport}
              exportExcel={this.exportExcel}
              totalItem={totalItem}
              page={page}
              stationKey={stationKey}
              standards={standards}
              standardObjectList={standardObjectList}
              setPage={this.setPage}
              loading={loadingData}
              dataStationAuto={data}
              measuringList={measuringList}
            />
          </Col>
        </Row>
        <ModalSaveFilter
          filterName={filterItem.name}
          visible={visibleModalSave}
          key={visibleModalSave}
          centered
          isUpdate={isUpdateFilter}
          onCancel={this.onCancelModal}
          onSubmitSaveFilter={this.onSubmitSaveFilter}
          form={form}
        />
      </PageContainer>
    )
  }
}
