import { Button, Col, Row } from 'antd'
import DataInsight from 'api/DataInsight'
import BoxShadowStyle from 'components/elements/box-shadow'
import Clearfix from 'components/elements/clearfix/index'
import Heading from 'components/elements/heading'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import ROLE from 'constants/role'
import createLang, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { getTimes, getTimesUTC } from 'utils/datetime'
import { getParamArray } from 'utils/params'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import TabList from './tab-list'
import DataAnalyze from './tab-list/tab-table-data-list/data-analyze'
import { downFileExcel } from 'utils/downFile'

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

@protectRole(ROLE.DATA_SEARCH.VIEW)
@connect(state => ({
  locale: state.language.locale,
  stationAutoByKey: _.keyBy(state.stationAuto.list, 'key'),
}))
@createLang
export default class MinutesDataSearch extends React.Component {
  state = {
    summary: [],
    data: [],
    page: 1,
    totalItem: null,
    standards: [],
    standardObjectList: [],
    loadingData: false,
    qcvnSelected: [],
    loadingSummary: false,
    loadingExport: false,
  }
  searchFormRef = React.createRef()

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
    // const { form } = this.props
    await this.searchFormRef.current.validateFields()

    const { stationKey, rangesDate, ...queryParams } = this.getQueryParam(
      valuesForm
    )
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
          console.log({ e })
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
          console.log({ e })
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
      console.log({ error })
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
      console.log({ error })
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
      qcvnSelected,
      standardObjectList,
    } = this.state

    const measuringList = this.searchFormRef.current
      ? this.getMeasuringList()
      : []
    const stationKey = this.searchFormRef.current ? this.getStationAuto() : ''

    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />

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
          <SearchFrom ref={this.searchFormRef} onSearch={this.handleOnSearch} />
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
        <Row gutter={12} style={{ marginLeft: 16 }} type="flex" align="middle">
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
      </PageContainer>
    )
  }
}
