import React from 'react'

import { Modal } from 'antd'
import * as _ from 'lodash'
import Highcharts from 'react-highcharts'
import { translate } from 'hoc/create-lang'

export default class StatusModalView extends React.Component {
  getConfig = () => {
    const dataLabels = {
      enabled: true,
      color: '#FFFFFF',
      verticalAlign: 'center',
      align: 'center',
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.y}%`
      }
    }

    const seriesReceived = {
      name: translate('dashboard.chartRatio.received'),
      data: [],
      color: '',
      dataLabels
    }
    const seriesNotReceived = {
      name: translate('dashboard.chartRatio.notReceived'),
      data: [],
      color: 'red',
      dataLabels
    }
    let categories = []

    const list = _.get(this.props, ['data', `${this.props.title}`, 'list'], [])

    console.log(list)
    _.forEach(list, ({ name, percent }) => {
      const received = percent || 0
      seriesReceived.data.push(received)
      seriesNotReceived.data.push(100 - received)
      categories.push(name)
    })

    return {
      chart: {
        type: 'column'
      },
      title: {
        text: translate('dashboard.chartRatio.title')
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: ''
        },
        stackLabels: {
          enabled: false
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: {point.y}%'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
            //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          }
        }
      },
      series: [seriesNotReceived, seriesReceived]
    }
  }

  render() {
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          onCancel={this.props.onClose}
          onOk={this.props.onClose}
          okText="OK"
          cancelText="Đóng"
          width={800}
          cancelButtonProps={{ visible: false }}
        >
          <Highcharts config={this.getConfig()} />
        </Modal>
      </div>
    )
  }
}
