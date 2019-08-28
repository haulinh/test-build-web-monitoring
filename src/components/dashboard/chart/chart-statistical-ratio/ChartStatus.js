import React from 'react'
import { autobind } from 'core-decorators'
import { Card, Spin } from 'antd'
import ReactHighcharts from 'react-highcharts'
import * as _ from 'lodash'

import { translate } from 'hoc/create-lang'
import ChartBaseView from './chart-base'
import { COLOR } from 'themes/color'
import { STATUS_STATION } from 'constants/stationStatus'
import { ROUND_DIGIT } from 'constants/format-number'

@autobind
export default class ChartStatusView extends React.PureComponent {
  configStatusChartSemi = (dataGroup, title, titleActive, tittleUnActive) => {
    const dataLabels = {
      enabled: true,
      color: '#FFF',
      verticalAlign: 'center',
      align: 'center',
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.y} ${translate(
          'dashboard.chartStatus.stations'
        )} (${_.round((this.y / this.total) * 100, 2)}%)`
      },

      center: ['50%', '75%'],
      events: {
        click: function(event) {}
      }
    }

    let goodTotal = 0
    let lossData = 0
    let tpm = _.values(dataGroup)

    if (_.isArray(tpm) && tpm.length > 0) {
      tpm = tpm[0]
    }

    // let goodTotal = 0
    // let lossData = 0
    // const tpm = _.head(_.values(dataGroup))

    //let total = 0

    if (!_.isEmpty(tpm)) {
      goodTotal = _.filter(tpm, { status: STATUS_STATION.GOOD }).length
      lossData = _.size(tpm) - goodTotal //_.filter(tpm, { status: 'DATA_LOSS' }).length
      //total = _.size(tpm) - goodTotal - lossData
    }

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: document.body.clientHeight - 340
      },
      title: {
        text: '' //translate('dashboard.chartStatus.titleByUnit', { unit: title })
      },
      legend: {
        enabled: true
      },
      tooltip: {
        pointFormat: `<b>{point.percentage:.${ROUND_DIGIT}f}%</b>`
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white',
              textOutline: false
            }
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          dataLabels,
          type: 'pie',
          name: title,
          // innerSize: '40%',
          data: [
            // {
            //   name: tittleUnActive,
            //   y: total,
            //   color: '#4D4E48'
            // },
            {
              name: translate('dashboard.chartStatus.dataLoss'),
              y: lossData,
              color: COLOR.DATA_LOSS
            },
            {
              name: titleActive,
              y: goodTotal,
              color: COLOR.GOOD
            }
          ]
        }
      ]
    }
  }

  configStatusChartColumn = (dataGroup, title, titleActive, tittleUnActive) => {
    const dataLabels = {
      enabled: true,
      color: '#FFF',
      y: 15,
      shadow: false,
      verticalAlign: 'center',
      align: 'center',
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.y} (${_.round((this.y / this.total) * 100)}%)`
      }
    }
    // events
    const seriesDataLoss = {
      name: translate('dashboard.chartStatus.dataLoss'),
      data: [],
      color: COLOR.DATA_LOSS,
      dataLabels
    }
    const seriesActive = {
      name: titleActive,
      data: [],
      dataLabels,
      color: COLOR.GOOD
    }
    // const seriesUnActive = {
    //   name: tittleUnActive,
    //   data: [],
    //   color: '#4D4E48',
    //   dataLabels
    // }
    let categories = []
    _.forEach(_.keys(dataGroup), key => {
      const ls = _.get(dataGroup, key, [])

      const good = _.filter(ls, ({ status }) => status === STATUS_STATION.GOOD)
        .length
      // const dataLoss = _.filter(ls, ({ status }) => status === 'DATA_LOSS')
      //   .length

      seriesDataLoss.data.push(ls.length - good)
      seriesActive.data.push(good)
      //seriesUnActive.data.push(ls.length - good - dataLoss)
      categories.push(_.get(_.head(dataGroup[key]), 'province.name', 'Other'))
    })
    return {
      chart: {
        type: 'column',
        height: document.body.clientHeight - 340
      },
      title: {
        text: '' //title
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        },
        lineWidth: 1,
        lineColor: '#ccc',
        labels: {
          formatter: function() {
            return `${this.value}%`
          }
        }
      },
      legend: {
        reversed: true
      },
      series: [seriesActive, seriesDataLoss],
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      credits: {
        enabled: false
      }
    }
  }

  getConfigStatus = () => {
    const dataGroup = _.groupBy(this.props.data, 'province.key')
    if (_.size(dataGroup) === 1) {
      const title = _.get(_.head(this.props.data), 'province.name', '')
      return this.configStatusChartSemi(
        dataGroup,
        title,
        translate('dashboard.chartStatus.activate'),
        translate('dashboard.chartStatus.inactive')
      )
    }

    return this.configStatusChartColumn(
      dataGroup,
      translate('dashboard.chartStatus.title'),
      translate('dashboard.chartStatus.activate'),
      translate('dashboard.chartStatus.inactive')
    )
  }

  render() {
    return (
      <ChartBaseView
        title={translate('dashboard.chartStatus.title')}
        style={{ flex: 1, marginRight: 8 }}
      >
        <Card bordered style={{ paddingBottom: 21 }}>
          <Spin spinning={this.props.loading}>
            <ReactHighcharts config={this.getConfigStatus()} />
          </Spin>
        </Card>
      </ChartBaseView>
    )
  }
}
