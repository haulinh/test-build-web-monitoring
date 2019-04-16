import React from 'react'
import { autobind } from 'core-decorators'
import { Card, Spin } from 'antd'
import ReactHighcharts from 'react-highcharts'
import * as _ from 'lodash'

import { translate } from 'hoc/create-lang'
import ChartBaseView from './chart-base'
import color from 'themes/color';

@autobind
export default class ChartStatusView extends React.PureComponent {
  configStatusChartSemi = (dataGroup, title, titleActive, tittleUnActive) => {
    const dataLabels = {
      enabled: true,
      color: 'white',
      verticalAlign: 'center',
      align: 'center',
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.key} ${this.y} (${_.round(
          (this.y / this.total) * 100,
          2
        )}%)`
      },
      center: ['50%', '75%'],
      events: {
        click: function(event) {}
      }
    }

    let goodTotal = 0
    let lossData = 0
    const tpms = _.values(dataGroup)

    _.forEach(tpms, tpm => {
      goodTotal += _.filter(tpm, { status: 'GOOD' }).length
      lossData += _.filter(tpm, { status: 'DATA_LOSS' }).length
    })

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: '' //translate('dashboard.chartStatus.titleByUnit', { unit: title })
      },
      legend: {
        enabled: true,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
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
            {
              name: translate('dashboard.chartStatus.dataLoss'),
              y: lossData,
              color: color.COLOR_STATUS.DATA_LOSS
            },
            {
              name: titleActive,
              y: goodTotal,
              color: color.COLOR_STATUS.GOOD
            }
          ]
        }
      ]
    }
  }

  /* MARK  removed trong phiên bản launching */
  configStatusChartColumn = (dataGroup, title, titleActive, tittleUnActive) => {
    const dataLabels = {
      enabled: true,
      color: '#000',
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
      color: '#F03045',
      dataLabels
    }
    const seriesActive = {
      name: titleActive,
      data: [],
      dataLabels,
      color: '#008001'
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

      const good = _.filter(ls, ({ status }) => status === 'GOOD').length
      // const dataLoss = _.filter(ls, ({ status }) => status === 'DATA_LOSS')
      //   .length

      seriesDataLoss.data.push(ls.length - good)
      seriesActive.data.push(good)
      //seriesUnActive.data.push(ls.length - good - dataLoss)
      categories.push(_.get(_.head(dataGroup[key]), 'province.name', 'Other'))
    })
    return {
      chart: {
        type: 'column'
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
        reversed: false
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
    return this.configStatusChartSemi(
      dataGroup,
      '',
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
