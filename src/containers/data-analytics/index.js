import React, { Component } from 'react'
import styled from 'styled-components'
import { get, isEmpty } from 'lodash'
import { translate as t } from 'hoc/create-lang'
import dataInsightApi from 'api/DataInsight'

import FilterForm from './filter'
import ReportData from './report-data'
import { AnalyzeDataProvider } from './context'
import { CHART_TYPE } from './report-data/chart-type'
import { OPERATOR } from './filter/select-operator'

const i18n = {
  title: t('menuApp.monitoring.dataAnalytics'),
  measuredValue: t('dataAnalytics.measuredValue'),
}

const Title = styled.div`
  padding: 8px 24px;
  font-size: 22px;
  font-weight: 600;
  color: #3b3b3b
  border-bottom: 1px solid rgb(238, 238, 238);
`
const Container = styled.div`
  padding: 24px;
  overflow-x: hidden;
`
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
    paramFilter: {},
  }

  setLoading = isLoadingData => this.setState({ isLoadingData })

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

    this.setState({ measure, dataType, chartType }, () =>
      this.onChangeQcvn(qcvns)
    )

    if (![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)) return

    const getDescription = item => {
      if (dataType === OPERATOR.MIN) return item.analyzeData.timeHaveMinValue
      if (dataType === OPERATOR.MAX) return item.analyzeData.timeHaveMaxValue
      return null
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
        name: i18n.measuredValue,
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

  onFetchReceiveTime = async measure => {
    const { data, dataType, from, to } = this.state
    this.setState({ measure })

    this.onReDrawChart({ measure })

    if (![OPERATOR.MAX, OPERATOR.MIN].includes(dataType)) return

    if (
      !isEmpty(get(data[measure], '[0].analyzeData.timeHaveMinValue', [])) ||
      !isEmpty(get(data[measure], '[0].analyzeData.timeHaveMaxValue', []))
    ) {
      return
    }

    const result = await dataInsightApi.getReceiveTime({
      to,
      from,
      measure,
      stations: data[measure].map(item => item.stationKey).join(','),
      values: data[measure].map(item => item.analyzeData[dataType]).join(','),
    })

    const chart = this.chart.getChartSeries('mainChart')

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
              timeHaveMinValue: result[item.stationKey],
              timeHaveMaxValue: result[item.stationKey],
            },
          })),
        },
      })
      this.chart.getChartSeries('mainChart').setData(
        data[measure].map(item => ({
          y: item.analyzeData[dataType],
          description: result[item.stationKey],
        })),
        true
      )
      clearInterval(timeInterval)
    }, 200)
  }

  chartId = (name, type) => `${name}_${type}`

  setChart = chart => {
    this.chart = chart
  }

  setParamFilter = paramFilter => {
    this.setState({
      paramFilter,
    })
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
    } = this.state

    return (
      <AnalyzeDataProvider
        value={{
          setChart: this.setChart,
          chart: this.chart,
        }}
      >
        <Title>{i18n.title}</Title>
        <Container>
          <FilterForm
            isLoadingData={isLoadingData}
            onData={this.onData}
            onReDrawChart={this.onReDrawChart}
            setLoading={this.setLoading}
            setParamFilter={this.setParamFilter}
          />
          <ReportData
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
        </Container>
      </AnalyzeDataProvider>
    )
  }
}

export default DataAnalytics
