import { Button, Checkbox, Form, Popover, Tabs } from 'antd'
import {
  exportExcelDataStations,
  getDataStations,
} from 'api/station-fixed/DataPointApi'
import ROLE from 'constants/role'
import { translate as t } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { downFileExcel } from 'utils/downFile'
import { getParamArray } from 'utils/params'
import Breadcrumb from './breadcrumb'
import ReportTable from './ReportTable'
import { SearchForm } from './search-form'

export function i18n() {
  return {
    receivedAt: t('dataPointReport.title.receivedAt'),
    phaseName: t('dataPointReport.title.phaseName'),
    pointName: t('dataPointReport.title.pointName'),
    qcvn: {
      isApplying: t('qcvn.form.expired.isApplying'),
      invalid: t('qcvn.invalid'),
    },
    optionalInfo: {
      year: t('dataPointReport.optionalInfo.year'),
      month: t('dataPointReport.optionalInfo.month'),
      symbol: t('dataPointReport.optionalInfo.symbol'),
      weather: t('dataPointReport.optionalInfo.weather'),
      sampler: t('dataPointReport.optionalInfo.sampler'),
      notes: t('dataPointReport.optionalInfo.notes'),
      monitoringPlace: t('dataPointReport.optionalInfo.monitoringPlace'),
      requirements: t('dataPointReport.optionalInfo.requirements'),
      method: t('dataPointReport.optionalInfo.method'),
      chemical: t('dataPointReport.optionalInfo.chemical'),
      conditions: t('dataPointReport.optionalInfo.conditions'),
      equipmentlist: t('dataPointReport.optionalInfo.equipmentlist'),
      analyst: t('dataPointReport.optionalInfo.analyst'),
      placeOfAnalysis: t('dataPointReport.optionalInfo.placeOfAnalysis'),
      createdAt: t('dataPointReport.optionalInfo.createdAt'),
    },
    addButton: t('dataPointReport.button.add'),
    exportExcelButton: t('dataPointReport.button.exportExcel'),
    dataTab: t('dataPointReport.tab.data'),
    numberOrder: t('dataPointReport.title.numberOrder'),
    titleExcel: {
      title: t('dataPointReport.titleExcel.title'),
      to: t('dataPointReport.titleExcel.to'),
    },
  }
}

const optionalInfo = [
  { field: 'year', checked: false },
  { field: 'month', checked: false },
  { field: 'symbol', checked: false },
  { field: 'weather', checked: false },
  { field: 'sampler', checked: false },
  { field: 'notes', checked: false },
  { field: 'monitoringPlace', checked: false },
  { field: 'requirements', checked: false },
  { field: 'method', checked: false },
  { field: 'chemical', checked: false },
  { field: 'conditions', checked: false },
  { field: 'equipmentlist', checked: false },
  { field: 'analyst', checked: false },
  { field: 'placeOfAnalysis', checked: false },
  { field: 'createdAt', checked: false },
]

export const PAGE_SIZE = 50

const { TabPane } = Tabs

const OptionalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: inherit;
  }
`

const Flex = styled.div`
  display: flex;
`
@protectRole(ROLE.STATION_FIXED_SEARCH.VIEW)
@connect(state => ({
  lang: state.language.locale,
}))
@Form.create()
export default class StationFixedReport extends React.Component {
  state = {
    dataPoints: [],
    loading: false,
    total: 0,
    queryParam: {},
    pageNumber: 1,
    loadingSearch: false,
    loadingExport: false,
    standardsVNObject: {},
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.queryParam, this.state.queryParam)) {
      this.setState({ pageNumber: 1 })
    }
  }

  isDisableExportExcel = () => _.isEmpty(this.state.dataPoints)

  operations = () => (
    <Flex>
      <Popover content={this.content()} placement="bottom" trigger="click">
        <Button icon="profile" style={{ marginRight: '8px' }}>
          {i18n().addButton}
        </Button>
      </Popover>
      {protectRole(ROLE.STATION_FIXED_SEARCH.EXPORT)(
        <Button
          disabled={this.isDisableExportExcel()}
          loading={this.state.loadingExport}
          onClick={this.handleExportExcel}
          type="primary"
        >
          {i18n().exportExcelButton}
        </Button>
      )}
    </Flex>
  )

  content = () => {
    const { form } = this.props
    return (
      <Form>
        <OptionalInfoContainer
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {optionalInfo.map(item => (
            <div key={item.key} style={{ marginBottom: '8px' }}>
              {form.getFieldDecorator(item.field)(
                <Checkbox>{i18n().optionalInfo[item.field]}</Checkbox>
              )}
            </div>
          ))}
        </OptionalInfoContainer>
      </Form>
    )
  }

  setQueryParam = queryParam => {
    this.setState({ queryParam })
  }

  getQueryParams = () => {
    const { pageNumber, queryParam } = this.state
    const {
      stationKeys,
      startDate,
      endDate,
      isExceeded,
      standardsVN,
    } = queryParam

    const params = {
      pageNumber,
      from: startDate.toDate(),
      itemPerPage: PAGE_SIZE,
      to: endDate.toDate(),
      isExceeded,
      stationKeys: stationKeys.join(','),
      standardsVN: getParamArray(standardsVN),
    }

    return params
  }

  handleOnSearch = async () => {
    const params = this.getQueryParams()

    this.setState({
      loading: true,
      loadingSearch: true,
    })

    try {
      const response = await getDataStations(params)

      this.setState({
        loading: false,
        loadingSearch: false,
        dataPoints: response,
        total: response.total,
      })
    } catch (error) {
      console.error({ error })

      this.setState({
        loading: false,
        loadingSearch: false,
      })
    }
  }

  handleExportExcel = async () => {
    const { lang } = this.props
    const params = this.getQueryParams()
    const { startDate, endDate } = params

    const title = `${moment(startDate).format('DD/MM/YYYY')} - ${moment(
      endDate
    ).format('DD/MM/YYYY')}`
    const maxNumber = Number.MAX_SAFE_INTEGER

    const newParams = {
      ...params,
      itemPerPage: maxNumber,
      title,
      optionalInfo: this.props.form.getFieldsValue(),
    }

    const titleExcel = `${i18n().titleExcel.title} ${moment(startDate).format(
      'DD-MM-YYYY hh:mm a'
    )} ${i18n().titleExcel.to} ${moment(endDate).format('DD-MM-YYYY hh:mm a')}`

    try {
      const response = await exportExcelDataStations(lang, newParams)
      downFileExcel(response.data, titleExcel)
    } catch (error) {
      console.error({ error })
    }
  }

  setStandardVNObject = value => {
    this.setState({ standardsVNObject: value })
  }

  render() {
    const {
      dataPoints,
      total,
      loadingSearch,
      pageNumber,
      loading,
      standardsVNObject,
    } = this.state
    const pagination = {
      current: this.state.pageNumber,
      total: total,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.setState({ pageNumber: page })
      },
    }

    return (
      <PageContainer>
        <Breadcrumb items={['base']} />
        <SearchForm
          ref={this.searchFormRef}
          loadingSearch={loadingSearch}
          setQueryParam={this.setQueryParam}
          onSearch={this.handleOnSearch}
          setStandardVNObject={this.setStandardVNObject}
        />
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab={i18n().dataTab} key="1" />
        </Tabs>
        <ReportTable
          standardsVNObject={standardsVNObject}
          form={this.props.form}
          dataPoints={dataPoints}
          pageNumber={pageNumber}
          pagination={pagination}
          loading={loading}
        />
      </PageContainer>
    )
  }
}
