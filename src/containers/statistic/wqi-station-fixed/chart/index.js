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
      labels: {y: 40}
    },
    plotOptions: {
      dataLabels: {
        enabled: true
      },
      ignoreNulls: 'normal'
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
    const groupData = data.reduce((prev, item) => ({
      ...prev,
      [item.datetime]: [...(prev[item.datetime] || []), {y: Math.round(item.wqiResult.wqi), color: item.wqiResult.level.backgroundColor}]
    }), {})

    const series = Object.keys(groupData).map(item => ({
      id: item,
      name: item,
      data: groupData[item]
    }))
    const categories = Array.from(new Set(data.map(item => item.point.name)))
    //remove all before insert new series
    this.removeAll();
    this.chart.xAxis[0].setCategories(categories, false);
    series.map(item => this.chart.addSeries(item, false));
    this.chart.redraw()
  }

  removeAll = (redraw = false) => {
    while(this.chart.series.length > 0) {
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
