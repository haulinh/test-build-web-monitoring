import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import chartAutoResize from 'hoc/chart-autoresize'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import * as _ from 'lodash'
import { Menu } from 'antd'

const MenuItemGroup = Menu.ItemGroup

const ChartWrapper = styled.div``

export default class ChartRowToChart extends React.Component {
  constructor(props) {
    super(props)
    const categories = _.map(props.dataLines, item => item)
    const current = _.head(categories)
    this.state = {
      categories,
      current
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataLines, this.props.dataLines)) {
      const categories = _.map(nextProps.dataLines, item => item)
      const current = _.head(categories)
      this.state = {
        categories,
        current
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps.dataLines, this.props.dataLines) ||
      !_.isEqual(nextState.categories, this.state.categories) ||
      !_.isEqual(nextState.current, this.state.current)
    )
  }

  handleClick = e => {
    this.setState({
      current: _.get(this.props.dataLines, [e.key], {})
    })
  }

  getConfigChart = () => {
    return {
      noData: {
        attr: 'No Data'
      },
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
