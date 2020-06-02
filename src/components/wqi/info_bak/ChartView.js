import React from 'react'
import Chart from 'react-highcharts'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import { Card } from 'antd'
import levels from 'constants/wqi-level'

export default class ChartView extends React.Component {
  getConfig = () => {
    const data = []
    _.forEachRight(this.props.wqiDays, ({ receivedAt, value }) => {
      const y = value
      let color = 'green'
      const tmp = _.find(levels, ({ min, max }) => _.inRange(y, min, max))
      if (tmp) {
        color = tmp.color
      }
      data.push({
        name: moment(receivedAt).format('HH'),
        y,
        color,
      })
    })
    return {
      chart: {
        type: 'column',
        height: 150,
      },
      credits: {
        enabled: false,
      },
      title: {
        align: 'left',
        text: this.props.title,
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function() {
              return this.y === 0 ? '' : this.y
            },
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: 'VN WQI: <b>{point.y}',
      },
      series: [
        {
          name: 'WQI',
          colorByPoint: true,
          data,
        },
      ],
    }
  }

  render() {
    return (
      <Card style={{ marginTop: 16 }}>
        <Chart config={this.getConfig()} />
      </Card>
    )
  }
}
