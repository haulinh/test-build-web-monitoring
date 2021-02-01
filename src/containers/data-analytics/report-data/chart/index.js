import React, { Component } from 'react'
import Highcharts from 'highcharts'
import AnalyzeDataContext from 'containers/data-analytics/context'
import { isEmpty } from 'lodash'

class Chart extends Component {
  static contextType = AnalyzeDataContext

  chartInstance

  options = {
    title: {
      text: '',
    },
    yAxis: {
      title: {
        enabled: false,
      },
    },
  }

  // use ref on parent componet
  drawLine = (id, { value, length }, redraw = false) => {
    this.chartInstance.addSeries(
      {
        id,
        name: id,
        type: 'line',
        marker: {
          enabled: false,
        },
        data: Array(length).fill(value),
      },
      redraw
    )
  }

  addSeries = (categories, options) => {
    const series = this.chartInstance.series
    if (!isEmpty(series)) series[0].remove()
    this.chartInstance.xAxis[0].setCategories(categories)
    this.chartInstance.addSeries(options)
  }

  removeCharts = (ids, redraw = false) => {
    ids.forEach(id => {
      const chart = this.chartInstance.get(id)
      if (chart) chart.remove()
    })
    if (redraw) this.chartInstance.redraw()
  }

  getChartSeries = seriesId =>
    !seriesId ? this.chartInstance.series : this.chartInstance.get(seriesId)

  redraw = () => this.chartInstance.redraw()

  componentDidMount() {
    this.chartInstance = Highcharts.chart('chart', this.options)
    this.context.setChart({
      redraw: this.redraw,
      drawLine: this.drawLine,
      addSeries: this.addSeries,
      removeCharts: this.removeCharts,
      getChartSeries: this.getChartSeries,
    })
  }

  render() {
    return <div id="chart" />
  }
}

export default Chart
