import React from 'react'
import Chart from 'react-highcharts'
import * as _ from 'lodash'
import moment from 'moment'
import levels from 'constants/aqi-level'

export default class ChartView extends React.Component {
  getConfig = () => {
    const data = []
    _.forEachRight(this.props.aqiDays, ({ time, aqiDayOf }) => {
      const y = _.get(aqiDayOf, `${this.props.title}`, 0)
      let color = 'green'
      const tmp = _.find(levels, ({ min, max }) => _.inRange(y, min, max))
      if (tmp) {
        color = tmp.color
      }
      data.push({
        name: moment(time).format('DD'),
        y,
        color
      })
    })

    return {
      chart: {
        type: 'column'
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.props.title
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'VN AQI'
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
            format: '{point.y}'
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: 'VN AQI: <b>{point.y}'
      },
      series: [
        {
          name: 'AQI',
          colorByPoint: true,
          data
        }
      ]
    }
  }

  render() {
    return <Chart config={this.getConfig()} />
  }
}
