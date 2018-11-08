import React from 'react'
import { autobind } from 'core-decorators'
import { Card } from 'antd'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'

import { translate } from 'hoc/create-lang'
import { getDataStationAutoRatioCount } from 'api/DataStationAutoApi'
import StatusModalView from './StatusModal'
import ChartBaseView from './chart-base'

const dataLabels = {
  enabled: true,
  // rotation: -90,
  color: '#000000',
  y: 12,
  // padding: 10,
  align: 'center',
  allowOverlap: true
}

@autobind
export default class HeaderView extends React.PureComponent {
  state = {
    data: [],
    day: 7,
    visible: false
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

  configRatioSemi = (title, received, notReceived) => {
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
        text: '' //title
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
              color: '#F03045'
            },
            {
              name: received,
              y: total,
              color: '#008001'
            }
          ]
        }
      ]
    }
  }

  configRatioBar = (title, received, notReceived) => {
    const me = this
    const dataLabels = {
      enabled: true,
      color: '#000000',
      verticalAlign: 'center',
      align: 'center',
      padding: 20,
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${this.y}%`
      }
    }

    const series1 = { name: received, data: [], dataLabels, color: '#008001' }
    const series2 = { name: notReceived, data: [], color: '#F03045', dataLabels }
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
            
          }
        }
      },
      title: {
        text: '' //title
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 0, max: 100,
        title: {
          text: ''
        },
        labels: {
          formatter: function() {
            return `${this.value}%`;
          }
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
              const stationKey = _.get(event, 'point.category', '')
              me.setState({
                visible: true,
                stationKey
              })
            }
          }
        }
      }
    }
  }

  getConfigRatio = () => {
    if (_.isEmpty(this.props.province)) {
      return this.configRatioBar(
        //translate('dashboard.chartRatio.title'),
        '',
        translate('dashboard.chartRatio.received'),
        translate('dashboard.chartRatio.notReceived')
      )
    } else {
      return this.configRatioSemi(
        // translate('dashboard.chartRatio.title'),
        '',
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

  onModalClose = () => {
    this.setState({ visible: false })
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
          <ReactHighcharts config={this.getConfigRatio()} />
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
