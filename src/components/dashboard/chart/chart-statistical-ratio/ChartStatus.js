import React from 'react'
import { autobind } from 'core-decorators'
import { Card } from 'antd'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'

import { translate } from 'hoc/create-lang'

const dataLabels = {
  enabled: true,
  // rotation: -90,
  color: '#FFFFFF',
  y: 12,
  // padding: 10,
  align: 'center',
  allowOverlap: true
}

@autobind
export default class ChartStatusView extends React.PureComponent {

  configStatusChartSemi = (dataGroup, title, titleActive, tittleUnActive) => {

    const dataLabels = {
      enabled: true,
      color: '#FFFFFF',
      verticalAlign: 'center',
      align: 'center',
      allowOverlap: true,
      formatter: function () { 
        if (this.y === 0) return '';
        return `${this.key} ${this.y} (${_.round(this.y/this.total*100, 2)}%)`; ; 
      },
      center: ['50%', '75%'],
      events: {
        click: function(event) {
          console.log('onClick', event)
        }
      }
    }

    let goodTotal = 0
    let lossData = 0
    const tpm = _.head(_.values(dataGroup))

    let total = 0

    if (!_.isEmpty(tpm)) {
      goodTotal = _.filter(tpm, { status: 'GOOD' }).length
      lossData =  _.filter(tpm, { status: 'DATA_LOSS' }).length
      total = _.size(tpm) - goodTotal - lossData
    }

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: translate('dashboard.chartStatus.titleByUnit', { unit: title })
      },
      legend: {
        enabled: true
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
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%']
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
          innerSize: '40%',
          data: [
            {
              name: tittleUnActive,
              y: total,
              color: 'red'
            },
            {
              name: translate('dashboard.chartStatus.dataLoss'),
              y: lossData,
              color: 'yellow'
            },
            {
              name: titleActive,
              y: goodTotal,
              color: 'rgb(149,206,255)'
            }
          ]
        }
      ]
    }
  }

  configStatusChartColumn = (dataGroup, title, titleActive, tittleUnActive) => {

    const dataLabels = {
      enabled: true,
      color: '#FFFFFF',
      y: 15,
      verticalAlign: 'center',
      align: 'center',
      allowOverlap: true,
      formatter: function () { 
        if (this.y === 0) return '';
        return `${this.y} (${_.round(this.y/this.total*100, 2)}%)`; 
      }
    }
    // events
    const seriesDataLoss = { name: translate('dashboard.chartStatus.dataLoss'), data: [], color: 'yellow', dataLabels }
    const seriesActive = { name: titleActive, data: [], dataLabels }
    const seriesUnActive = { name: tittleUnActive, data: [], color: 'red', dataLabels }
    let categories = []
    _.forEach(_.keys(dataGroup), key => {
      const ls = _.get(dataGroup, key, [])

      const good = _.filter(ls, ({ status }) => status === 'GOOD').length
      const dataLoss = _.filter(ls, ({ status }) => status === 'DATA_LOSS').length
      
      seriesDataLoss.data.push(dataLoss)
      seriesActive.data.push(good)
      seriesUnActive.data.push(ls.length - good - dataLoss)
      categories.push(_.get(_.head(dataGroup[key]), 'province.name', 'Other'))
    })
    return {
      chart: {
        type: 'column'
      },
      title: {
        text: title
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      series: [seriesActive, seriesDataLoss, seriesUnActive],
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
      <Card bordered style={{ flex: 1, marginRight: 8 }}>
        <ReactHighcharts config={this.getConfigStatus()} />
      </Card>
    )
  }
}
