import React from 'react'
import Chart from 'react-highcharts'
import * as _ from 'lodash'
import levels from 'constants/aqi-level'

export default class ChartView extends React.Component {
  getConfig = () => {
    const data = []
    const categories = []

    _.mapKeys(this.props.aqiMeasure, (value, key) => {
      let color = 'green'
      const tmp = _.find(levels, ({ min, max }) => _.inRange(value, min, max))
      if (tmp) {
        color = tmp.color
      }
      data.push({
        name: key,
        y: value,
        color
      })
      categories.push(key)

      return key
    })

    return {
      chart: {
        inverted: true,
        polar: false,
        width: 250
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: function () {
            //   return '{point.y}'
            // }
            formatter: function() {
              return this.y === 0 ? '' : this.y
            }
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{point.key}</span><br>',
        pointFormat: 'VN AQI: <b>{point.y}'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories
      },

      series: [
        {
          type: 'column',
          colorByPoint: true,
          data,
          showInLegend: false
        }
      ]
    }
  }

  render() {
    return <Chart config={this.getConfig()} />
  }
}
