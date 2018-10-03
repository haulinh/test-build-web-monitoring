import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Card } from 'antd'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'

import { translate } from 'hoc/create-lang'
import { getDataStationAutoRatioCount } from 'api/DataStationAutoApi'

const WrapperView = styled.div` 
margin-top: 16px;
border-radius: 4px;
display: flex;
height: 50px background: #ccd `

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
export default class HeaderView extends React.PureComponent {
  state = {
    data: [],
    day: 7
  }

  handleItemSelected = value => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  componentDidMount() {
    this.getDataRatioBy(this.state.day)
  }

  getDataRatioBy = async day => {
    const rs = await getDataStationAutoRatioCount(
      moment().format('DD-MM-YYYY HH:ss'),
      moment()
        .subtract(day, 'days')
        .format('DD-MM-YYYY HH:ss')
    )
    this.setState({ day, data: _.get(rs, 'data', []) })
  }

  configStatusChartSemi = (dataGroup, title, titleActive, tittleUnActive) => {
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

  configRatioSemi = (title, received, notReceived) => {

    const dataLabels = {
      enabled: true,
      color: '#FFFFFF',
      verticalAlign: 'center',
      align: 'center',
      padding: 20,
      allowOverlap: true,
      formatter: function () { 
        if (this.y === 0) return '';
        return `${this.y}%`; 
      },
      events: {
        click: function(event) {
          console.log('onClick', event)
        }
      }
    }

    let total = 0
    const item = _.find(
      this.state.data,
      ({ provinceId }) => provinceId === this.props.province
    )
    if (item && item.ratio) {
      title = translate('dashboard.chartRatio.dataByDate', {
        day: this.state.day,
        unit: item.name
      })
      total = item.ratio
    }

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {
        enabled: false
      },
      title: {
        text: title
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
      series: [
        {
          dataLabels,
          type: 'pie',
          name: title,
          innerSize: '40%',
          data: [
            {
              name: notReceived,
              y: 100 - total,
              color: 'red'
            },
            {
              name: received,
              y: total,
              color: 'rgb(149,206,255)'
            }
          ]
        }
      ]
    }
  }

  configRatioBar = (title, received, notReceived) => {

    const dataLabels = {
      enabled: true,
      color: '#FFFFFF',
      verticalAlign: 'center',
      align: 'center',
      padding: 20,
      allowOverlap: true,
      formatter: function () { 
        if (this.y === 0) return '';
        return `${this.y}%`; 
      }
    }

    const series1 = { name: received, data: [], dataLabels }
    const series2 = { name: notReceived, data: [], color: 'red', dataLabels }
    let categories = []

    _.forEach(this.state.data, ({ ratio, name }) => {
      series1.key = name
      series2.key = name
      series1.data.push(_.round(ratio, 2))
      series2.data.push(_.round(100 - ratio, 2))
      categories.push(name)
    })

    return {
      chart: {
        type: 'bar',
        events: {
          click: function(event) {
              alert (event);
          }
        }
      },
      title: {
        text: title
      },
      credits: {
        enabled: false
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
      series: [series1, series2],
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: ({point.y}%)<br/>',
        shared: true
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          events: {
            click: function(event) {
              const key = _.get(event, 'point.category', '')
              console.log('object: ', key)
            }
          }
        }
      }
    }
  }

  getConfigRatio = () => {
    if (_.isEmpty(this.props.province)) {
      return this.configRatioBar(
        translate('dashboard.chartRatio.title'),
        translate('dashboard.chartRatio.received'),
        translate('dashboard.chartRatio.notReceived')
      )
    } else {
      return this.configRatioSemi(
        translate('dashboard.chartRatio.title'),
        translate('dashboard.chartRatio.received'),
        translate('dashboard.chartRatio.notReceived')
      )
    }
  }

  onChange = value => {
    this.getDataRatioBy(Number(value.key))
  }

  menu = () => {
    return (
      <Menu onClick={this.onChange}>
        <Menu.Item key="7">
          <span>{translate('dashboard.chartRatio.byDay', { day: 7 })}</span>
        </Menu.Item>
        <Menu.Item key="15">
          <span>{translate('dashboard.chartRatio.byDay', { day: 15 })}</span>
        </Menu.Item>
        <Menu.Item key="30">
          <span>{translate('dashboard.chartRatio.byDay', { day: 30 })}</span>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <WrapperView>
        <Card bordered style={{ flex: 1, marginRight: 8 }}>
          <ReactHighcharts config={this.getConfigStatus()} />
        </Card>
        <Card bordered style={{ flex: 1, marginLeft: 8 }}>
          <Dropdown overlay={this.menu()} trigger={['click']}>
            <span>
              <span style={{ color: 'blue', minWidth: 80 }}>
                {translate('dashboard.chartRatio.byDay', {
                  day: this.state.day
                })}
                {`  `}
              </span>
              <Icon type="down" />
            </span>
          </Dropdown>
          <ReactHighcharts config={this.getConfigRatio()} />
        </Card>
      </WrapperView>
    )
  }
}
