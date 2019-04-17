import React from 'react'
import { autobind } from 'core-decorators'
import { Card, Spin } from 'antd'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'

import { translate } from 'hoc/create-lang'
import { getDataStationAutoRatioCount } from 'api/DataStationAutoApi'
import StatusModalView from './StatusModal'
import ChartBaseView from './chart-base'
import color from 'themes/color';

const dataLabels = {
  enabled: true,
  // rotation: -90,
  color: '#000000',
  y: 12,
  // padding: 10,
  align: 'center',
  allowOverlap: true,
  formatter: function() {
    if (this.y === 0) return ''
    return `${this.key} ${this.y} (${_.round(
      (this.y / this.total) * 100,
      2
    )}%)`
  },
}

@autobind
export default class HeaderView extends React.PureComponent {
  state = {
    data: [],
    day: 7,
    visible: false,
    isLoading: false
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
    this.setState({isLoading: true})
    const rs = await getDataStationAutoRatioCount(
      moment().format('DD-MM-YYYY HH:ss'),
      moment()
        .subtract(day, 'days')
        .format('DD-MM-YYYY HH:ss')
    )

    this.setState({
      day, 
      data: _.get(rs, 'data', []),
      isLoading: false
    })
  }

  /* MARK  not used */
  // configRatioSemi = (title, received, notReceived) => {
  //   let total = 0
  //   const item = _.find(
  //     this.state.data,
  //     ({ provinceId }) => provinceId === this.props.province
  //   )
  //   if (item && item.ratio) {
  //     title = translate('dashboard.chartRatio.dataByDate', {
  //       day: this.state.day,
  //       unit: item.name
  //     })
  //     total = item.ratio
  //   }

  //   return {
  //     chart: {
  //       plotBackgroundColor: null,
  //       plotBorderWidth: 0,
  //       plotShadow: false,
  //       height: document.body.clientHeight - 340 // MARK  height vừa khung màn hình
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: '' //title
  //     },
  //     legend: {
  //       enabled: true
  //     },
  //     tooltip: {
  //       pointFormat: '<b>{point.percentage:.1f}%</b>'
  //     },
  //     plotOptions: {
  //       pie: {
  //         dataLabels: {
  //           enabled: true,
  //           distance: -50,
  //           style: {
  //             fontWeight: 'bold',
  //             color: 'white'
  //           }
  //         },
  //         startAngle: -90,
  //         endAngle: 90,
  //         center: ['50%', '75%']
  //       }
  //     },
  //     series: [
  //       {
  //         dataLabels,
  //         type: 'pie',
  //         name: title,
  //         innerSize: '40%',
  //         data: [
  //           {
  //             name: notReceived,
  //             y: 100 - total,
  //             color: color.COLOR_STATUS.GOOD
  //           },
  //           {
  //             name: received,
  //             y: total,
  //             color: color.COLOR_STATUS.DATA_LOSS
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }

  configRatioBar = (isFilter,title, received, notReceived) => {
    const me = this
    const dataLabels = {
      enabled: true,
      color: 'white',
      verticalAlign: 'center',
      align: 'center',
      padding: 20,
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.y}%`
      }
    }

    let dataStation = this.state.data
    if(isFilter){
      dataStation = _.filter(
        this.state.data,
        ({ provinceId }) => provinceId === this.props.province
      )
    }
 
    
    const series1 = { name: received, data: [], dataLabels, color: color.COLOR_STATUS.GOOD }
    const series2 = {
      name: notReceived,
      data: [],
      color: color.COLOR_STATUS.DATA_LOSS,
      dataLabels
    }
    let categories = []

    _.forEach(dataStation, ({ ratio, name }) => {
      series1.key = name
      series2.key = name
      series1.data.push(_.round(ratio, 2))
      series2.data.push(_.round(100 - ratio, 2))
      categories.push(name)
    })


    let averageSeries1 = series1.data.length === 0 ? 0 : _.round(_.sum(series1.data) / series1.data.length, 2)
    let averageSeries2 = _.round(100 - averageSeries1, 2)

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: document.body.clientHeight - 340  // MARK  height vừa khung màn hình
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
          showInLegend: true,
          events: {
            click: function(event) {
              const stationKey = _.get(event, 'point.category', '')
              me.setState({
                visible: true,
                stationKey
              })
            }
          }
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
              name: translate('dashboard.chartRatio.notReceived'), //+ ` ${averageSeries2}%`,
              y: averageSeries2,
              color: color.COLOR_STATUS.DATA_LOSS
            },
            {
              name: translate('dashboard.chartRatio.received'), //+ ` ${averageSeries1}%`,
              y: averageSeries1,
              color: color.COLOR_STATUS.GOOD
            }
          ]
        }
      ]
    }
  }

  getConfigRatio = () => {
    if (_.isEmpty(this.props.province)) {
      return this.configRatioBar(
        //translate('dashboard.chartRatio.title'),
        false,
        '',
        translate('dashboard.chartRatio.received'),
        translate('dashboard.chartRatio.notReceived')
      )
    } else {
      return this.configRatioBar(
        //translate('dashboard.chartRatio.title'),
        true,
        '',
        translate('dashboard.chartRatio.received'),
        translate('dashboard.chartRatio.notReceived')
      )
    }
  }

  onChange = value => {
    this.getDataRatioBy(Number(value.key))
  }

  onModalClose = () => {
    this.setState({ visible: false })
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
      <ChartBaseView
        title={translate('dashboard.chartRatio.title')}
        style={{ flex: 1, marginLeft: 8 }}
      >
        <Card bordered>
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

          <Spin spinning={this.state.isLoading || this.props.loading}>
            <ReactHighcharts config={this.getConfigRatio()} />
          </Spin>

          <StatusModalView
            title={this.state.stationKey || ''}
            data={_.keyBy(_.values(this.state.data), 'name')}
            visible={this.state.visible}
            onClose={this.onModalClose}
          />
        </Card>
      </ChartBaseView>
    )
  }
}
