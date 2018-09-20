import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'
import { getDataStationAutos } from 'api/DataStationAutoApi'

const ChartWrapper = styled.div``

@autobind
export default class ChartRowToChart extends React.Component {
  constructor(props) {
    super(props)
    const categories = _.map(props.dataLines, item => item)
    const current = _.head(categories)
    this.state = {
      categories,
      current,
      day: 1
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataLines, this.props.dataLines)) {
      const categories = _.map(nextProps.dataLines, item => item)
      const current = _.head(categories)
      this.state = {
        categories,
        current,
        day: 1
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.currentStation, this.props.currentStation) ||
      !_.isEqual(nextProps.dataLines, this.props.dataLines) ||
      !_.isEqual(nextState.categories, this.state.categories) ||
      !_.isEqual(nextState.current, this.state.current) ||
      !_.isEqual(nextState.day, this.state.day)
    )
  }

  handleClick = e => {
    this.setState({
      current: _.get(this.props.dataLines, [e.key], {})
    })
  }

    getDataMeasuring = async day => {
      const dataSources = await getDataStationAutos({ page: 1, itemPerPage: 3000 },
        { fromDate: moment().subtract(day, 'days').format('YYYY-MM-DD HH:mm'),
          toDate: moment().format('YYYY-MM-DD HH:mm'),
          key: _.get(this.props.dataSearch, 'stationKey', ''),
          measuringList: _.get(this.props.dataSearch, 'measuringArray', [])
      })
    
      console.log(day, dataSources)
  
    // if (dataSources) {
    //   let data = _.get(dataSources, 'data', [])
    //   // OrderBy ASC of list
    //   data.sort((a, b) => {
    //     return (
    //       new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
    //     )
    //   })

    //   _.forEach(_.get(this.props.dataSearch, 'measuringArray', []), k => {
    //     if (this.props.dataLines[k]) {
    //       if (!dataLines[k].data) {
    //         dataLines[k].data = []
    //       }
    //       dataLines[k].data.push([
    //         new Date(dataItem.receivedAt).getTime(),
    //         dataItem.measuringLogs[k].value
    //       ])
    //     }
    //   })

    //   data.forEach(function(dataItem) {
    //     for (let k in dataItem.measuringLogs){
          
    //     }
    //   })
    // }
      
    //   const categories = _.map(dataLines, item => item)
    //   const current = _.head(categories)
    //   this.setState({
    //     day,
    //     categories,
    //     current
    //   })

      this.setState({
        day
      })
  }

  onChange = value => {
    this.getDataMeasuring(Number(value.key))
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

  getConfigChart = () => {
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
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
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
          name: _.get(this.state.current, 'name', ''),
          data: _.get(this.state.current, 'data', [])
        }
      ],
      credits: {
        enabled: false
      }
    }
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
        <ReactHighcharts config={this.getConfigChart()} />
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
