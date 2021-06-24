import React from 'react'

import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'

Exporting(Highcharts)

class Chart extends React.Component {
  chartOptions = {
    title: {
      text: ''
    },
    chart: {
      type: 'column',
    },
    yAxis: {
      title: {text: 'WQI'}
    },
    xAxis: {
      type: 'category',
    },
    plotOptions: {
      series: {
        minPointLength: 1,
      }, 
      dataLabels: {
        enabled: true
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

  componentDidMount() {
    this.chart = Highcharts.chart('chart', this.chartOptions)
  }

  renderChart = (data = []) => {
    this.removeAllChart();
    data.map(item => this.chart.addSeries(item, false));
    this.chart.redraw()
  }

  removeAllChart = (redraw = false) => {
    while (this.chart.series.length > 0) {
      this.chart.series[0].remove(redraw)
    }
  }


  render() {
    return (
      <div id="chart" />
    )
  }
}

export default Chart
