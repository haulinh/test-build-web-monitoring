import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { get, isEmpty } from 'lodash'
import dataInsightApi from 'api/DataInsight'
import { translate as t } from 'hoc/create-lang'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

import FilterForm from './filter'
import ReportData from './report-data'
import { AnalyzeDataProvider } from './context'
import { CHART_TYPE } from './report-data/chart-type'
import { OPERATOR } from './filter/select-operator'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { Row, Col, Button, Modal, Form } from 'antd'
import Breadcrum from './breadcrum'
import CalculateApi from 'api/CalculateApi'
import { ModalSaveFilter, FilterList } from 'components/filter'

function i18n() {
  return {
    title: t('menuApp.monitoring.dataAnalytics'),
    measuredValue: t('dataAnalytics.measuredValue'),
  }
}

const MODULE_TYPE = 'Analytic'

@Form.create()
class DataAnalytics extends Component {
  chart

  state = {
    data: {},
    qcvns: [],
    measure: null,
    measuringList: {},
    dataType: OPERATOR.AVG,
    chartType: CHART_TYPE.COLUMN,
    isLoadingData: false,
    isShowQcvn: true,
    paramFilter: {},
    filterList: [],
    visibleModalSave: false,
  }

  formSearchRef = React.createRef()

  setLoading = isLoadingData => this.setState({ isLoadingData })

  componentDidMount = async () => {
    try {
      const response = await CalculateApi.getFilterList({ type: MODULE_TYPE })

      this.setState({ filterList: response })
    } catch (error) {
      console.error({ error })
    }
  }

  onData = (result, { dataType, from, to }) => {
    if (isEmpty(result.data)) {
      this.chart.removeCharts([], true)
      this.setState({
        measure: null,
        data: result.data || {},
        measuringList: result.measuringList,
      })
      return
    }
    const measure = Object.keys(result.data)[0]
    this.setState(
      {
        from,
        to,
        data: result.data,
        dataType,
        measure,
        measuringList: result.measuringList,
      },
      () => this.onFetchReceiveTime(measure)
    )
  }

  removeAllLine = () => {
    const { qcvns } = this.state
    qcvns.forEach(item => {
      const { name } = item
      this.chart.removeCharts([
        this.chartId(name, 'min'),
        this.chartId(name, 'max'),
      ])
    })
  }

  onReDrawChart = (params = {}) => {
    this.removeAllLine()

    let { data, measure, dataType, chartType, qcvns } = this.state
    measure = params.measure || measure
    dataType = params.dataType || dataType
    chartType = params.chartType || chartType

    this.setState({ measure, dataType, chartType }, () => {
      this.onChangeQcvn(qcvns)
      this.chart.setTitle({
        text: this.getChartTitle(),
      })
    })

    if (![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)) return

    const getDescription = item => {
      if (![OPERATOR.MAX, OPERATOR.MIN].includes(dataType)) return null
      return item.analyzeData.times || []
    }
    const series = (data[measure] || []).map(item => ({
      y: item.analyzeData[dataType],
      description: getDescription(item),
    }))
    const categories = (data[measure] || []).map(item => item.stationName)
    this.chart.addSeries(
      categories,
      {
        id: 'mainChart',
        data: series,
        type: chartType,
        name: i18n().measuredValue,
        enableMouseTracking: [OPERATOR.MIN, OPERATOR.MAX].includes(dataType),
      },
      true
    )
  }

  onChangeQcvn = (qcvns, redraw = true) => {
    const { chartType, measure: measureKey, qcvns: oldQcvns } = this.state
    this.setState({ qcvns })
    if (![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)) return
    if (!measureKey) return
    // remove line
    oldQcvns.forEach(qcvn => {
      const { name } = qcvn
      if (!qcvns.find(item => item.name === name)) {
        this.chart.removeCharts([
          this.chartId(name, 'max'),
          this.chartId(name, 'min'),
        ])
      }
    })

    // add line
    qcvns.forEach(qcvn => {
      const { name, measuringList } = qcvn
      const measure = measuringList.find(measure => measure.key === measureKey)
      if (!measure) return
      if (measure.maxLimit || measure.maxLimit === 0)
        this.chart.drawLine({
          name,
          id: this.chartId(name, 'max'),
          value: measure.maxLimit,
        })
      if (measure.minLimit || measure.minLimit === 0)
        this.chart.drawLine({
          name,
          id: this.chartId(name, 'min'),
          value: measure.minLimit,
        })
    })
    if (redraw) this.chart.redraw()
  }

  onSubmitSaveFilter = () => {
    const { form } = this.props

    const value = form.getFieldsValue()

    const valueFormSearch = this.formSearchRef.current.getFieldsValue()

    console.log({ valueFormSearch })

    console.log({ value })
  }

  onFetchReceiveTime = async measure => {
    const { data, dataType, from, to, paramFilter } = this.state
    this.setState({ measure })

    this.onReDrawChart({ measure })

    if (![OPERATOR.MAX, OPERATOR.MIN].includes(dataType)) return

    if (!isEmpty(get(data[measure], '[0].analyzeData.times', []))) {
      return
    }

    const result = await dataInsightApi.getReceiveTime({
      to,
      from,
      measure,
      stations: data[measure].map(item => item.stationKey).join(','),
      values: data[measure].map(item => item.analyzeData[dataType]).join(','),
      isFilter: paramFilter.isFilter,
    })

    const chart = this.chart.getChartSeries('mainChart')
    const getTimes = list =>
      list.map(item => moment(item).format(DD_MM_YYYY_HH_MM))
    let timeInterval = setInterval(() => {
      if (!chart.finishedAnimating) return
      this.setState({
        measure,
        data: {
          ...data,
          [measure]: data[measure].map(item => ({
            ...item,
            analyzeData: {
              ...item.analyzeData,
              times: getTimes(result[item.stationKey]),
            },
          })),
        },
      })
      this.chart.getChartSeries('mainChart').setData(
        data[measure].map(item => ({
          y: item.analyzeData[dataType],
          description: getTimes(result[item.stationKey]),
        })),
        true
      )
      clearInterval(timeInterval)
    }, 200)
  }

  chartId = (name, type) => `${name}_${type}`

  getChartTitle = () => {
    const { measuringList, measure } = this.state
    if (!measuringList[measure]) return ''
    return `${measuringList[measure].name} ${
      measuringList[measure].unit ? `(${measuringList[measure].unit})` : ''
    }`
  }

  setChart = chart => {
    this.chart = chart
  }

  setParamFilter = paramFilter => {
    this.setState({
      paramFilter,
    })
  }

  toogleSelectQcvns = toogle => {
    this.setState({ isShowQcvn: toogle })
  }

  onClickSaveFilter = () => {
    this.setState({ visibleModalSave: true })
  }

  onCancelModal = () => {
    this.setState({ visibleModalSave: false })
  }

  render() {
    const {
      data,
      qcvns,
      dataType,
      chartType,
      isLoadingData,
      paramFilter,
      measuringList,
      measure,
      isShowQcvn,
      visibleModalSave,
      filterList,
    } = this.state

    const { form } = this.props

    return (
      <AnalyzeDataProvider
        value={{
          setChart: this.setChart,
          chart: this.chart,
        }}
      >
        <PageContainer
          right={
            <Button type="primary" onClick={this.onClickSaveFilter}>
              Lưu bộ lọc
            </Button>
          }
        >
          {/* <Title>{i18n().title}</Title> */}
          <Breadcrum items={['list']} />
          {/* <Breadcrumb items={['list']} /> */}

          <Row
            type="flex"
            style={{ marginLeft: '-24px', marginRight: '-24px' }}
          >
            <FilterList filterList={filterList} />
            <Col style={{ flex: 1, overflowX: 'hidden' }}>
              <FilterForm
                standardsVN={qcvns.map(qc => qc.key)}
                isLoadingData={isLoadingData}
                onData={this.onData}
                ref={this.formSearchRef}
                onReDrawChart={this.onReDrawChart}
                setLoading={this.setLoading}
                setParamFilter={this.setParamFilter}
                toogleSelectQcvns={this.toogleSelectQcvns}
              />
              <ReportData
                isShowQcvn={isShowQcvn}
                measure={measure}
                measuringList={measuringList}
                paramFilter={paramFilter}
                data={data}
                qcvns={qcvns}
                dataType={dataType}
                chartType={chartType}
                isLoadingData={isLoadingData}
                onReDrawChart={this.onReDrawChart}
                onChangeQcvn={this.onChangeQcvn}
                onFetchReceiveTime={this.onFetchReceiveTime}
              />
            </Col>
          </Row>
        </PageContainer>
        <ModalSaveFilter
          visible={visibleModalSave}
          centered
          onCancel={this.onCancelModal}
          onSubmitSaveFilter={this.onSubmitSaveFilter}
          form={form}
        />
      </AnalyzeDataProvider>
    )
  }
}

export default DataAnalytics
