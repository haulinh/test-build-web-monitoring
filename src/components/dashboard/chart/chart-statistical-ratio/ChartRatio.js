import { Card, Dropdown, Icon, Menu, Spin } from 'antd'
import { getDataStationAutoRatioCount } from 'api/DataStationAutoApi'
// import { isNumber } from 'util'
import { ROUND_DIGIT } from 'constants/format-number'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import ReactHighcharts from 'react-highcharts'
import { DATA_COLOR } from 'themes/color'
import ChartBaseView from './chart-base'
import StatusModalView from './StatusModal'


// const dataLabels = {
//   enabled: true,
//   // rotation: -90,
//   color: '#FFF',
//   y: 12,
//   // padding: 10,
//   align: 'center',
//   allowOverlap: true
// }

@autobind
export default class HeaderView extends React.PureComponent {
  state = {
    data: [],
    day: 7,
    visible: false,
    isLoading: false,
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
    this.setState({ day, data: _.get(rs, 'data', []), isLoading: false })
  }

  configRatioSemi = (title, received, notReceived) => {
    let total = 0
    const item = _.find(
      this.state.data,
      ({ provinceId }) => provinceId === (this.props.province || 'other') // NOTE  k0 có province thì key là other
    )

    if (item && item.ratio) {
      title = translate('dashboard.chartRatio.dataByDate', {
        day: this.state.day,
        unit: item.name,
      })
      total = item.ratio
    }
    const dataLabels = {
      enabled: true,
      color: 'white',
      verticalAlign: 'center',
      align: 'center',
      padding: 20,
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${_.round(this.y, 2)}%`
      },
    }
    let me = this

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: document.body.clientHeight - 340,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '', //title
      },
      legend: {
        enabled: true,
      },
      tooltip: {
        pointFormat: `<b>{point.percentage:.${ROUND_DIGIT}f}%</b>`,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white',
              textOutline: false,
            },
          },
          showInLegend: true,
          events: {
            click: function(event) {
              me.setState({
                visible: true,
                stationKey: item ? item.name : 'Other', // NOTE  stationKey: là đưa vào name của province mới chạy, neu k0 co thi Other
              })
            },
          },
        },
      },
      series: [
        {
          dataLabels,
          type: 'pie',
          name: title,
          // innerSize: '40%',
          data: [
            {
              name: notReceived,
              y: 100 - _.round(total, 2),
              color: DATA_COLOR.DATA_LOSS,
            },
            {
              name: received,
              y: _.round(total, 2),
              color: DATA_COLOR.GOOD,
            },
          ],
        },
      ],
    }
  }

  configRatioBar = (title, received, notReceived) => {
    const me = this
    const dataLabels = {
      enabled: true,
      color: '#FFF',
      verticalAlign: 'center',
      align: 'center',
      padding: 20,
      allowOverlap: true,
      formatter: function() {
        if (this.y === 0) return ''
        return `${_.round(this.y, 2)}%`
      },
    }

    const series1 = {
      name: received,
      data: [],
      dataLabels,
      color: DATA_COLOR.GOOD,
    }
    const series2 = {
      name: notReceived,
      data: [],
      color: DATA_COLOR.DATA_LOSS,
      dataLabels,
    }
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
          click: function(event) {},
        },
        height: document.body.clientHeight - 340,
      },
      title: {
        text: '', //title
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories,
        lineWidth: 1,
        lineColor: '#ccc',
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: '',
        },
        lineWidth: 1,
        lineColor: '#ccc',
        labels: {
          formatter: function() {
            return `${this.value}%`
          },
        },
      },
      legend: {
        reversed: true,
      },
      series: [series1, series2],
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: ({point.y}%)<br/>',
        shared: true,
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          events: {
            click: function(event) {
              const stationKey = _.get(event, 'point.category', '')
              me.setState({
                visible: true,
                stationKey,
              })
            },
          },
        },
      },
    }
  }

  getConfigRatio = () => {
    if (_.isEmpty(this.props.province) && this.props.isGroupProvince) {
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
    this.setState({ isLoading: true }, () => {
      this.getDataRatioBy(Number(value.key))
    })
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
                  day: this.state.day,
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
