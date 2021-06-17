import React from 'react'
import Highcharts from 'react-highcharts'

class Chart extends React.Component {
  chartConfig = (data = []) => {
    const groupData = data.reduce((prev, item) => ({
      ...prev,
      [item.time]: [...(prev[item.time] || []), item.wqi]
    }), {})
    const series = Object.keys(groupData).map(item => ({
      name: item,
      data: groupData[item]
    })) 
    return {
      chart: {
        type: 'column',
      },
      xAxis: [{
        categories: Array.from(new Set(data.map(item => item.name))),
        labels: {
          y: 40
        }
      }],
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
