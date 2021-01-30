import React, { Component } from 'react'
import styled from 'styled-components'

import FilterForm from './filter'
import ReportData from './report-data'
import { AnalyzeDataProvider } from './context'
import { CHART_TYPE } from './report-data/chart-type'
import { OPERATOR } from './filter/select-operator'
import { isEmpty } from 'lodash'

const i18n = {
  measuredValue: 'Giá trị đo',
}

const Container = styled.div`
  padding: 24px;
`
class DataAnalytics extends Component {
  chart

  state = {
    data: {},
    measure: null,
    dataType: OPERATOR.AVG,
    chartType: CHART_TYPE.COLUMN,
  }

  onData = (data, dataType) => {
    if (isEmpty(data)) return
    const measure = Object.keys(data)[0]
    this.setState({ data, dataType, measure }, this.onReDrawChart)
  }

  onReDrawChart = (params = {}) => {
    let { data, measure, dataType, chartType } = this.state
    measure = params.measure || measure
    dataType = params.dataType || dataType
    chartType = params.chartType || chartType

    const series = (data[measure] || []).map(item => item.analyzeData[dataType])
    const categories = (data[measure] || []).map(item => item.stationName)
    this.chart.addSeries(categories, {
      type: chartType,
      data: series,
      name: i18n.measuredValue,
    })
    this.setState({ measure, dataType, chartType })
  }

  onDrawLine = qcvns => {
    const { measure: measureKey } = this.state
    if (!measureKey) return
    qcvns.forEach(qcvn => {
      const { measuringList, name } = qcvn
      const measure =
        (measuringList || []).find(item => item.key === measureKey) || {}

      const maxLimitId = `${name} - max limit`
      if (measure.maxLimit || measure.maxLimit === 0)
        this.chart.drawLine(maxLimitId, { value: measure.maxLimit, length: 3 })
    })

    // this.chart.redraw()
  }

  setChart = chart => {
    this.chart = chart
  }

  render() {
    const { data } = this.state
    return (
      <AnalyzeDataProvider
        value={{
          setChart: this.setChart,
          chart: this.chart,
        }}
      >
        <Container>
          <FilterForm onData={this.onData} onReDrawChart={this.onReDrawChart} />
          <ReportData
            data={data}
            onReDrawChart={this.onReDrawChart}
            onDrawLine={this.onDrawLine}
          />
        </Container>
      </AnalyzeDataProvider>
    )
  }
}

export default DataAnalytics
