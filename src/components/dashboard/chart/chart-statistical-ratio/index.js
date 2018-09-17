import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { Card } from 'antd'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon } from 'antd'

import { getDataStationAutoRatioCount } from 'api/DataStationAutoApi'

const WrapperView = styled.div` 
margin-top: 16px;
border-radius: 4px;
display: flex;
height: 50px background: #ccd `

@autobind
export default class HeaderView extends React.PureComponent {
  state = {
    data: []
  }

  handleItemSelected = value => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  async componentDidMount() {
    const rs = await getDataStationAutoRatioCount(
      moment(),
      moment().subtract(7, 'days')
    )
    this.setState({ data: _.get(rs, 'data', []) })
  }

  getConfigStatus = () => {
    const dataGroup = _.groupBy(this.props.data, 'province.key')
    if (_.size(dataGroup) === 1) {
      const title = _.get(_.head(this.props.data), 'province.name', '')
      return this.configStatusChartSemi(
        dataGroup,
        title,
        'Hoạt động',
        'Không hoạt động'
      )
    }

    return this.configStatusChartColumn(
      dataGroup,
      'Tình trạng hoạt động của trạm',
      'Hoạt động',
      'Không hoạt động'
    )
  }

  configStatusChartSemi = (dataGroup, title, titleActive, tittleUnActive) => {
    const goodTotal = _.filter(dataGroup, ({ status }) => status === 'GOOD')
      .length

    return {
      chart: {
        // plotBackgroundColor: null,
        //plotBorderWidth: 0,
        //plotShadow: false
      },
      title: {
        text: 'Tình trạng hoạt động của ' + title
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
          type: 'pie',
          name: title,
          innerSize: '40%',
          data: [
            {
              name: tittleUnActive,
              y: _.size(dataGroup) - goodTotal,
              color: 'red'
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
    const seriesActive = { name: titleActive, data: [] }
    const seriesUnActive = { name: tittleUnActive, data: [], color: 'red' }
    let categories = []
    _.forEach(_.keys(dataGroup), key => {
      const total = _.size(
        _.filter(dataGroup[key], ({ status }) => status === 'GOOD')
      )
      seriesActive.data.push(_.round(total, 2))
      seriesUnActive.data.push(_.round(_.size(dataGroup[key]) - total, 2))
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
      series: [seriesActive, seriesUnActive],
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      }
    }
  }

  getConfigRatio = () => {
    const series1 = { name: 'Nhận được', data: [] }
    const series2 = { name: 'Không nhận được', data: [], color: 'red' }
    let categories = []

    _.forEach(this.state.data, ({ ratio, name }) => {
      series1.data.push(_.round(ratio, 2))
      series2.data.push(_.round(100 - ratio, 2))
      categories.push(name)
    })

    return {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Tỉ lệ nhận dữ liệu theo từng địa phương theo tháng'
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
          stacking: 'normal'
        }
      }
    }
  }

  onChange = value => {
    console.log(value)
  }

  menu = () => {
    return (
      <Menu onClick={this.onChange}>
        <Menu.Item key="7">
          <span>7 Ngày</span>
        </Menu.Item>
        <Menu.Item key="10">
          <span>10 Ngày</span>
        </Menu.Item>
        <Menu.Item key="30">
          <span>30 Ngày</span>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const data = _.groupBy(this.props.data, 'province.key')
    console.log('data', data)
    return (
      <WrapperView>
        <Card bordered style={{ flex: 1, marginRight: 8 }}>
          <ReactHighcharts config={this.getConfigStatus()} />
        </Card>
        <Card bordered style={{ flex: 1, marginLeft: 8 }}>
          <Dropdown overlay={this.menu()} trigger={['click']}>
            <span>
              7 Ngày <Icon type="down" />
            </span>
          </Dropdown>
          <ReactHighcharts config={this.getConfigRatio()} />
        </Card>
      </WrapperView>
    )
  }
}
