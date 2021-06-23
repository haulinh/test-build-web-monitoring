import React from 'react'
import Highcharts from 'react-highcharts'

class Chart extends React.Component {
  chartConfig = (data = []) => {
    const groupData = data.reduce((prev, item) => ({
      ...prev,
      [item.datetime]: [...(prev[item.datetime] || []), {y: Math.round(item.wqiResult.wqi), color: item.wqiResult.level.backgroundColor}]
    }), {})

    const series = Object.keys(groupData).map(item => ({
      name: item,
      data: groupData[item]
    }))

    return {
      title: {
        text: ''
      },
      chart: {
        type: 'column',
      },
      xAxis: [{
        categories: Array.from(new Set(data.map(item => item.point.name))),
        labels: {y: 40}
      }],
      yAxis: {
        title: {text: 'WQI'}
      },
      plotOptions: {
        dataLabels: {
          enabled: true
        },
        ignoreNulls: 'normal'
      },
      series
    }
  }
  render() {
    const {data} = this.props
    return (
      <div>
        <Highcharts config={this.chartConfig(data)} />
      </div>
    )
  }
}

export default Chart
