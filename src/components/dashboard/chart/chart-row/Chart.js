import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { translate } from 'hoc/create-lang'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import * as _ from 'lodash'
import { Menu, Dropdown, Icon, Tabs } from 'antd'
import { getDataStationAutos } from 'api/DataStationAutoApi'
import {
  DATETIME_LABEL_FORMAT,
  DATETIME_TOOLTIP_FORMAT,
} from 'constants/chart-format'
import { ROUND_DIGIT } from 'constants/format-number'
import { connect } from 'react-redux'
import { getContent } from 'components/language/language-content'
import { getConfigColor } from 'constants/stationStatus'
import { warningLevels } from 'constants/warningLevels'

const ChartWrapper = styled.div``
const SelectWrapper = styled.span`
  &:hover {
    cursor: pointer;
  }
`

ReactHighcharts.Highcharts.setOptions({
  global: {
    useUTC: false,
  },
})

const configChart = (data, title, minLimit, maxLimit, maxChart, minChart) => {
  return {
    chart: {
      type: 'spline',
      zoomType: 'x',
      height:
        document.body.clientHeight -
        (document.getElementsByClassName('header--wrapper') &&
        document.getElementsByClassName('header--wrapper').length > 0
          ? document.getElementsByClassName('header--wrapper')[0].clientHeight +
            150
          : 150), // MARK  height vừa khung màn hình
    },
    title: {
      text: title,
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: DATETIME_LABEL_FORMAT,
    },
    yAxis: {
      max: maxChart,
      min: minChart,
      title: {
        text: '',
      },
      plotLines: [
        {
          value: _.isNumber(minLimit) ? minLimit : undefined,
          color: 'red',
          width: 2,
          label: {
            text: translate(`dashboard.chartStatus.min`, { min: minLimit }),
          },
        },
        {
          value: _.isNumber(maxLimit) ? maxLimit : undefined,
          color: 'red',
          width: 1,
          label: {
            text: translate(`dashboard.chartStatus.max`, { max: maxLimit }),
          },
        },
      ],
    },
    legend: {
      enabled: false,
      reversed: true,
    },
    plotOptions: {
      spline: {
        // area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.Color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get('rgba'),
            ],
          ],
        },
        marker: {
          radius: 3,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
      },
    },
    series: data,
    credits: {
      enabled: false,
    },
    tooltip: {
      dateTimeLabelFormats: DATETIME_TOOLTIP_FORMAT,
      formatter: function(tooltip) {
        if (this.point.isNull) {
          return 'Null'
        }
        if (this.point && this.point.y) {
          this.point.y = _.round(this.point.y, ROUND_DIGIT)
        }
        // If not null, use the default formatter
        return tooltip.defaultFormatter.call(this, tooltip)
      },
    },
  }
}

@autobind
@connect(state => ({
  languageContents: _.get(state, 'language.languageContents'),
  colorData: _.get(state, 'config.color.warningLevel.data.value', []),
}))
export default class ChartRowToChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      current: null,
      day: 1,
      data: {},
      isShowAll: null,
    }
  }

  componentDidMount() {
    this.loadDataBy(this.props.station)
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
      // if (_.has(station, 'lastLog.receivedAt')) {
      // 	toDate = moment(_.get(station, 'lastLog.receivedAt', new Date()));
      // 	fromDate = moment(
      // 		_.get(station, 'lastLog.receivedAt', new Date())
      // 	).subtract(day, 'days');
      // }

      const dataSources = await getDataStationAutos(
        { page: 1, itemPerPage: 3000 },
        {
          fromDate: fromDate.utc().format(),
          toDate: toDate.utc().format(),
          key: _.get(station, 'key', 'vas'),
          measuringList: measuringKeys,
        }
      )

      let data = _.orderBy(_.get(dataSources, 'data', []), 'receivedAt')
      let heightChart = {}
      _.forEach(data, ({ measuringLogs, receivedAt }) => {
        _.mapKeys(measuringLogs, (value, key) => {
          results[key] = _.concat(_.get(results, key, []), [
            [moment(receivedAt).valueOf(), _.get(value, 'value')],
          ])
          if (_.has(categories, `${key}`)) {
            if (
              _.isNumber(_.get(value, 'maxLimit')) ||
              _.isNumber(_.get(value, 'minLimit'))
            ) {
              const maxCurrent =
                _.get(heightChart, `${key}.maxChart`) ||
                _.get(value, 'maxLimit') ||
                _.get(value, 'minLimit')
              _.update(heightChart, `${key}.maxChart`, () => maxCurrent)
              categories[key].maxChart = _.max([
                maxCurrent,
                _.get(value, 'value'),
              ])

              const minCurrent =
                _.get(heightChart, `${key}.minChart`) ||
                _.get(value, 'minLimit') ||
                _.get(value, 'maxLimit')
              _.update(heightChart, `${key}.minChart`, () => minCurrent)
              categories[key].minChart = _.min([
                minCurrent,
                _.get(value, 'value'),
              ])
            }
          }

          return key
        })
      })

      current = _.toArray(categories)
    }

    this.setState({ categories, current, day, data: results, isShowAll: true })
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
    if (e === '1') {
      const current = this.state.categories
      const isShowAll = true
      this.setState({
        current,
        isShowAll,
      })
    } else {
      const current = [_.get(_.keyBy(this.state.categories, 'key'), e, null)]
      const isShowAll = false
      this.setState({
        current,
        isShowAll,
      })
    }
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
    const { colorData } = this.props

    let dataSeries = []
    let maxLimit = null
    let minLimit = null
    let maxChart = undefined
    let minChart = undefined
    const { station, languageContents } = this.props
    const { current } = this.state
    let title = getContent(languageContents, {
      type: 'Station',
      itemId: station._id,
      value: station.name,
      field: 'name',
    })
    if (!this.state.isShowAll) {
      dataSeries = []
      maxLimit = _.get(this.state.current, '0.maxLimit', undefined)
      minLimit = _.get(this.state.current, '0.minLimit', undefined)
      const measureName = getContent(languageContents, {
        type: 'Measure',
        itemKey: _.get(current, '0.key'),
        value: _.get(current, '0.name'),
      })
      const exceedColor = getConfigColor(colorData, warningLevels.EXCEEDED, {
        defaultPrimary: null,
        defaultSecond: '#ffffff',
      })
      dataSeries.push({
        type: 'spline',
        // name: _.get(this.state.current, '0.name', ''),
        name: measureName,
        data: _.get(
          this.state.data,
          _.get(this.state.current, '0.key', ''),
          []
        ),
        lineWidth: 2,
        threshold: _.isNumber(maxLimit) ? maxLimit : 10000000,
        negativeColor: 'rgb(124, 181, 236)',
        color: exceedColor.primaryColor,
      })

      if (_.isNumber(minLimit)) {
        dataSeries.push({
          type: 'spline',
          // name: _.get(this.state.current, '0.name', ''),
          name: measureName,
          data: _.get(
            this.state.data,
            _.get(this.state.current, '0.key', ''),
            []
          ),
          lineWidth: 2,
          threshold: minLimit,
          negativeColor: exceedColor.primaryColor,
          color: 'transparent',
        })
      }

      maxChart = _.get(this.state.current, '0.maxChart', undefined)
      minChart = _.get(this.state.current, '0.minChart', undefined)
      title += `- ${_.get(this.state.current, '0.name', '')}`
    } else {
      dataSeries = []
      _.map(this.state.current, ({ key, name, maxLimit }) => {
        const measureName = getContent(languageContents, {
          type: 'Measure',
          itemKey: key,
          value: name,
        })
        return dataSeries.push({
          type: 'spline',
          name: measureName,
          data: _.get(this.state.data, key, []),
          lineWidth: 2,
        })
      })
    }
    return configChart(
      dataSeries,
      title,
      minLimit,
      maxLimit,
      maxChart,
      minChart
    )
  }

  render() {
    const { languageContents } = this.props
    return (
      <ChartWrapper>
        <Dropdown overlay={this.menu()} trigger={['click']}>
          <SelectWrapper>
            <span style={{ color: 'blue', minWidth: 80 }}>
              {translate('dashboard.chartRatio.byDay', {
                day: this.state.day,
              })}
              {`  `}
            </span>
            <Icon type="down" />
          </SelectWrapper>
        </Dropdown>
        <ReactHighcharts config={this.getConfigData()} />
        <Tabs
          style={{
            paddingLeft: 8,
            paddingRight: 8,
            marginBottom: 8,
          }}
          defaultActiveKey="1"
          onTabClick={this.handleClick}
        >
          <Tabs.TabPane tab={translate('dashboard.all')} key="1" />
          {_.map(this.state.categories, ({ key, name, unit }) => {
            const measureName = getContent(languageContents, {
              type: 'Measure',
              itemKey: key,
              value: name,
            })
            return (
              <Tabs.TabPane
                tab={unit ? `${measureName} (${unit})` : `${measureName}`}
                key={key}
              />
            )
          })}
        </Tabs>
      </ChartWrapper>
    )
  }
}
