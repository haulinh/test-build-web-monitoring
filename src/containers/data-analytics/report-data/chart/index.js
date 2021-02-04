import React, { Component } from 'react'
import moment from 'moment'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'


import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import AnalyzeDataContext from 'containers/data-analytics/context'
import { isEmpty } from 'shared/components/DataTable/src/util'


Exporting(Highcharts)
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
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.2f}',
        },
      },
    },
    tooltip: {
      formatter: function(tooltip) {
        if (!this.point.description)
          return tooltip.defaultFormatter.call(this, tooltip)
        if (this.point.description === 'qcvn') {
          return `${this.series.name}: <b>${this.point.y}</b>`
        }
        return `
          <div>
            ${this.point.description
              .map(item => moment(item).format(DD_MM_YYYY_HH_MM))
              .join('<br />')}
          </div>
        `
      },
    },
    exporting: {
      chartOptions: {
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
            },
          },
        },
      },
      fallbackToExportServer: false,
    },
  }

  // use ref on parent componet
  drawLine = ({ id, name, value }, redraw = false) => {
    const chart = this.chartInstance.get('mainChart')
    if (!this.chartInstance.get(id))
      this.chartInstance.addSeries(
        {
          id,
          name,
          type: 'line',
          marker: {
            enabled: false,
          },
          data: Array(chart.data.length)
            .fill(value)
            .map(item => ({ y: item, description: 'qcvn' })),
        },
        redraw
      )
  }

  addSeries = (categories, options, redraw = false) => {
    if (this.chartInstance.get('mainChart'))
      this.chartInstance.get('mainChart').remove(false)
    this.chartInstance.xAxis[0].setCategories(categories)
    this.chartInstance.addSeries(options, redraw)
  }

  removeCharts = (ids, redraw = false) => {
    if (isEmpty(ids)) {
      this.chartInstance.series.forEach(chart => chart.remove(false))
    } else
      ids.forEach(id => {
        const chart = this.chartInstance.get(id)
        if (chart) chart.remove(false)
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
