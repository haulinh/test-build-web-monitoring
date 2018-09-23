import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import moment from 'moment'
import { translate } from 'hoc/create-lang'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'
import { getDataStationAutos } from 'api/DataStationAutoApi'

const ChartWrapper = styled.div``

const configChart = (data, title, minLimit, maxLimit, maxChart) => {
  return {
    chart: {
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      max: maxChart,
      title: {
        text: ''
      },
      plotLines: [
        //   {
        //   value: minLimit,
        //   color: 'red',
        //   width: 2,
        //   label: {
        //     text: `Min: ${minLimit}`
        //   }
        // },
        {
          value: maxLimit,
          color: 'red',
          width: 1,
          label: {
            text: `Max: ${maxLimit}`
          }
        }
      ]
    },
    legend: {
      enabled: false,
      reversed: true
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.Color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get('rgba')
            ]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        }
      }
    },
    series: [
      {
        type: 'area',
        name: title,
        data
      }
    ],
    credits: {
      enabled: false
    }
  }
}

@autobind
export default class ChartRowToChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      current: null,
      day: 1,
      data: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.station, this.props.station)) {
      this.loadDataBy(nextProps.station)
    }
  }

  loadDataBy = async (station, day = 1) => {
    let categories = []
    let current = null
    let measuringKeys = []
    let results = {}
    if (!_.isEmpty(station)) {
      categories = _.keyBy(_.get(station, 'measuringList', []), 'key')
      measuringKeys = _.keys(categories)
      let toDate = moment()
      let fromDate = moment().subtract(day, 'days')
      if (_.has(station, 'lastLog.receivedAt')) {
        toDate = moment(_.get(station, 'lastLog.receivedAt', new Date()))
        fromDate = moment(
          _.get(station, 'lastLog.receivedAt', new Date())
        ).subtract(day, 'days')
      }

      const dataSources = await getDataStationAutos(
        { page: 1, itemPerPage: 3000 },
        {
          fromDate: fromDate.format('YYYY-MM-DD HH:mm'),
          toDate: toDate.format('YYYY-MM-DD HH:mm'),
          key: _.get(station, 'key', 'vas'),
          measuringList: measuringKeys
        }
      )

      let data = _.orderBy(_.get(dataSources, 'data', []), 'receivedAt')
      _.forEach(data, ({ measuringLogs, receivedAt }) => {
        _.forEach(_.keys(measuringLogs), key => {
          if (_.has(measuringLogs, `${key}.value`)) {
            results[key] = _.concat(_.get(results, key, []), [
              [new Date(receivedAt).getTime(), measuringLogs[key]['value']]
            ])

            if (_.has(categories, `${key}`)) {
              let maxChart = _.get(categories, `${key}.maxLimit`)
              if (maxChart > 0) {
                maxChart = _.max([maxChart, measuringLogs[key]['value']])
                categories[key].maxChart = maxChart
              }
            }
          }
        })
      })

      categories = _.toArray(categories)
      current = _.head(categories)
    }

    this.setState({ categories, current, day, data: results })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.station, this.props.station) ||
      !_.isEqual(nextState.categories, this.state.categories) ||
      !_.isEqual(nextState.data, this.state.data) ||
      !_.isEqual(nextState.current, this.state.current) ||
      !_.isEqual(nextState.day, this.state.day)
    )
  }

  handleClick = e => {
    const current = _.get(_.keyBy(this.state.categories, 'key'), [e.key], null)
    this.setState({
      current
    })
  }

  onChange = value => {
    this.loadDataBy(this.props.station, Number(value.key))
  }

  menu = () => {
    return (
      <Menu onClick={this.onChange}>
        <Menu.Item key="1">
          <span>{translate('dashboard.chartRatio.byDay', { day: 1 })}</span>
        </Menu.Item>
        <Menu.Item key="7">
          <span>{translate('dashboard.chartRatio.byDay', { day: 7 })}</span>
        </Menu.Item>
        <Menu.Item key="15">
          <span>{translate('dashboard.chartRatio.byDay', { day: 15 })}</span>
        </Menu.Item>
      </Menu>
    )
  }

  getConfigData = () => {
    let data = []
    const key = _.get(this.state.current, 'key', '')
    if (key) {
      data = _.get(this.state.data, key, [])
    }

    let config = {}
    return configChart(
      data,
      _.get(this.state.current, 'name', ''),
      _.get(this.state.current, 'minLimit'),
      _.get(this.state.current, 'maxLimit'),
      _.get(this.state.current, 'maxChart')
    )
  }

  render() {
    return (
      <ChartWrapper>
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
        <ReactHighcharts config={this.getConfigData()} />
        <Menu
          style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}
          onClick={this.handleClick}
          selectedKeys={[_.get(this.state.current, 'key', '')]}
          mode="horizontal"
        >
          {_.map(this.state.categories, ({ key, name, unit }) => (
            <Menu.Item key={key}>
              {name}
              {unit && ` (${unit})`}
            </Menu.Item>
          ))}
        </Menu>
      </ChartWrapper>
    )
  }
}
