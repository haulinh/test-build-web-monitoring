import { Modal } from 'antd'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import React from 'react'
import Highcharts from 'react-highcharts'
import { DATA_COLOR } from 'themes/color'


export default class StatusModalView extends React.Component {
  getConfig = () => {
    const dataLabels = {
      enabled: true,
      color: '#000',
      verticalAlign: 'center',
      align: 'center',
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.y}`
      },
    }

    const seriesReceived = {
      name: translate('dashboard.chartRatio.received'),
      data: [],
      color: DATA_COLOR.GOOD,
      dataLabels,
    }
    const seriesNotReceived = {
      name: translate('dashboard.chartRatio.notReceived'),
      data: [],
      color: DATA_COLOR.DATA_LOSS,
      dataLabels,
    }
    let categories = []

    const list = _.get(this.props, ['data', `${this.props.title}`, 'list'], [])

    _.forEach(list, ({ name, percent }) => {
      const received = percent || 0
      seriesReceived.data.push(received)
      seriesNotReceived.data.push(100 - received)
      categories.push(name)
    })

    return {
      chart: {
        type: 'column',
      },
      title: {
        text: translate('dashboard.chartRatio.title'),
      },
      xAxis: {
        categories,
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: `${translate('dashboard.unit')} (%)`,
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
        },
        lineWidth: 1,
        lineColor: '#ccc',
        stackLabels: {
          enabled: false,
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{series.name}: {point.y}%',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          },
          pointPadding: 0,
          borderWidth: 0,
        },
      },
      series: [seriesNotReceived, seriesReceived],
    }
  }

  render() {
    return (
      <div>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          onCancel={this.props.onClose}
          footer={null}
          width={800}
          cancelButtonProps={{ visible: false }}
        >
          <Highcharts config={this.getConfig()} />
        </Modal>
      </div>
    )
  }
}
