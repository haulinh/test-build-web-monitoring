import { Button, Checkbox, Form, Popover, Tabs } from 'antd'
import { exportDataPoint, getDataPoint } from 'api/station-fixed/DataPointApi'
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
    },
    addButton: t('dataPointReport.button.add'),
    exportExcelButton: t('dataPointReport.button.exportExcel'),
    dataTab: t('dataPointReport.tab.data'),
    numberOrder: t('dataPointReport.title.numberOrder'),
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
export class StationFixedReport extends React.Component {
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

  queryDataPoint = async pageNumber => {
    const {
      phaseIds,
      pointKeys,
      startDate,
      endDate,
      isExceeded,
      stationTypeId,
      standardsVN,
    } = this.state.queryParam
    this.setState({ loading: true, loadingSearch: true })

    const dataPoints = await getDataPoint({
      point: {
        pointKeys,
      },
      isExceeded,
      filter: {
        order: 'datetime desc',
        where: {
          stationTypeId,
          'phase._id': {
            inq: phaseIds,
          },
          datetime: {
            between: [startDate, endDate],
          },
        },
      },
      standardsVN,
      pageNumber,
      pageSize: PAGE_SIZE,
    })

    this.setState({
      dataPoints: dataPoints,
      total: dataPoints.total,
      loading: false,
      loadingSearch: false,
    })
  }

  handleOnSearch = async (pageNumber = 1) => {
    this.queryDataPoint(this.state.pageNumber)
  }

  handleExportExcel = async () => {
    const {
      phaseIds,
      pointKeys,
      startDate,
      endDate,
      isExceeded,
      stationTypeId,
    } = this.state.queryParam

    const { lang } = this.props

    this.setState({ loadingExport: true })
    const params = {
      title: `${moment(startDate).format('DD/MM/YYYY')} - ${moment(
        endDate
      ).format('DD/MM/YYYY')}`,
      point: {
        pointKeys,
      },
      isExceeded,
      filter: {
        order: 'datetime desc',
        where: {
          stationTypeId,
          'phase._id': {
            inq: phaseIds,
          },
          datetime: {
            between: [startDate, endDate],
          },
        },
      },
      optionalInfo: this.props.form.getFieldsValue(),
      pageNumber: 1,
      pageSize: 9999,
      standardsVN: this.state.queryParam.standardsVN
        ? this.state.queryParam.standardsVN
        : [],
    }
    const res = await exportDataPoint(lang, params)
    this.setState({ loadingExport: false })

    downFileExcel(
      res.data,
      `Dữ liệu liệu trạm quan trắc thủ công từ ${moment(startDate).format(
        'DD-MM-YYYY hh:mm a'
      )} đến ${moment(endDate).format('DD-MM-YYYY hh:mm a')}`
    )
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
