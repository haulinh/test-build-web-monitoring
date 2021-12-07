import { Button, Col, Row } from 'antd'
import DataInsight from 'api/DataInsight'
import BoxShadowStyle from 'components/elements/box-shadow'
import Clearfix from 'components/elements/clearfix/index'
import Heading from 'components/elements/heading'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import ROLE from 'constants/role'
import createLang, { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment-timezone'
import React from 'react'
import { connect } from 'react-redux'
import { getTimes, getTimesUTC } from 'utils/datetime'
import { getParamArray } from 'utils/params'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import TabList from './tab-list'
import DataAnalyze from './tab-list/tab-table-data-list/data-analyze'

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
}

@protectRole(ROLE.DATA_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
@connect(state => ({
  locale: state.language.locale,
}))
@createLang
export default class MinutesDataSearch extends React.Component {
  state = {
    summary: [],
    data: [],
    pagination: {},
    standards: [],
    loadingData: false,
    loadingSummary: false,
  }
  searchFormRef = React.createRef()

  getQueryParam = () => {
    const values = this.searchFormRef.current.getFieldsValue()
    const { standards } = this.state

    const times = getTimes(values[fields.rangesDate])
    const { from, to } = getTimesUTC(times)
    const params = {
      ...values,
      from,
      to,
      [fields.measuringList]: getParamArray(values[fields.measuringList]),
      [fields.filterBy]: getParamArray(values[fields.filterBy]),
      page: 1,
      itemPerPage: 50,
      standards: getParamArray(standards),
    }
    return params
  }

  handleOnSearch = async () => {
    const { stationKey, ...queryParams } = this.getQueryParam()
    this.setState({ loadingData: true, loadingSummary: true })

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
            pagination: res.pagination,
            loadingSummary: false,
          })
        })
        .catch(e => {
          this.setState({ loadingSummary: false })
        })

      DataInsight.getDataOriginal(stationKey, {
        ...queryParams,
        [fields.facetFields]: 'data',
      })
        .then(res => this.setState({ data: res.data, loadingData: false }))
        .catch(e => this.setState({ loadingData: false }))
      return
    }

    try {
      const res = await DataInsight.getDataOriginal(stationKey, {
        ...queryParams,
      })

      this.setState({
        summary: res.summary,
        pagination: res.pagination,
        data: res.data,
        loadingData: false,
        loadingSummary: false,
      })
    } catch (error) {
      this.setState({ loadingData: false, loadingSummary: false })
    }
  }

  onChangeQcvn = standards => {
    this.setState({ standards }, () => {
      this.handleOnSearch()
    })
  }

  getMeasuringList = () => {
    const measuringList = this.searchFormRef.current.getFieldValue(
      fields.measuringList
    )

    return measuringList || []
  }

  render() {
    const { data, summary, loadingData, loadingSummary } = this.state

    const measuringList = this.searchFormRef.current
      ? this.getMeasuringList()
      : []

    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />

        <Clearfix height={16} />
        <BoxShadowStyle>
          <Heading
            rightChildren={
              <Button
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
          <SearchFrom ref={this.searchFormRef} />
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
              fieldValue="key"
              mode="multiple"
              maxTagCount={3}
              maxTagTextLength={18}
              onChange={this.onChangeQcvn}
            />
          </Col>
        </Row>

        <TabList
          loading={loadingData}
          dataStationAuto={data}
          measuringList={measuringList}
        />
      </PageContainer>
    )
  }
}
