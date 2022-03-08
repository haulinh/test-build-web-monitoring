import { Tabs } from 'antd'
import { DATETIME_LABEL_FORMAT } from 'constants/chart-format'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import { connect } from 'react-redux'
import styled from 'styled-components'

const TabPane = Tabs.TabPane

const TabChartWrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
`
const ChartWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
`

ReactHighcharts.Highcharts.wrap(
  ReactHighcharts.Highcharts.RangeSelector.prototype,
  'drawInput',
  function(proceed, name) {
    proceed.call(this, name)
    this[name + 'DateBox'].on('click', function() {})
  }
)

ReactHighcharts.Highcharts.setOptions({
  lang: {
    rangeSelectorFrom: translate('chart.from'),
    rangeSelectorTo: translate('chart.to'),
    rangeSelectorZoom: '',
  },
  global: {
    useUTC: false,
  },
})

@autobind
@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
export default class TabChart extends React.PureComponent {
  static propTypes = {
    getChart: PropTypes.func,
    dataStationAuto: PropTypes.array,
    measuringData: PropTypes.array,
    stationAutoCurrent: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.initData(props, true)
  }

  initData = (props, isInit = false) => {
    const { measuringList, measuresObj } = props
    const seriesData = {}
    const mesureList = measuringList.map((measure, index) => {
      const { name, key, minLimit, maxLimit } = measuresObj[measure]
      seriesData[key] = {
        name,
        data: [],
        tooltip: { valueDecimals: FORMAT_VALUE_MEASURING },
        minLimit: minLimit,
        maxLimit: maxLimit,
        threshold: _.isNumber(maxLimit) ? maxLimit : 10000000,
      }
      return {
        code: key,
        ...measuresObj[measure],
      }
    })

    let heightChart = {}
    _.forEachRight(props.dataStationAuto, ({ measuringLogs, receivedAt }) => {
      const time = moment(receivedAt).valueOf()
      _.mapKeys(seriesData, function(value, key) {
        let val = _.get(measuringLogs, [key, 'value'])

        seriesData[key].data.push([time, val])

        const minCureent =
          _.get(heightChart, `${key}.minChart`) ||
          _.get(measuringLogs, [key, 'minLimit']) ||
          _.get(measuringLogs, [key, 'maxLimit'])
        const maxCurrent =
          _.get(heightChart, `${key}.maxChart`) ||
          _.get(measuringLogs, [key, 'maxLimit']) ||
          _.get(measuringLogs, [key, 'minLimit'])
        if (_.isNumber(minCureent)) {
          _.update(heightChart, `${key}.minChart`, () =>
            _.min([minCureent, val])
          )
        }
        if (_.isNumber(maxCurrent)) {
          _.update(heightChart, `${key}.maxChart`, () =>
            _.max([maxCurrent, val])
          )
        }

        return key
      })
    })

    mesureList.unshift({ code: 'all', name: translate('chart.all') })
    if (isInit) {
      const { stationAutoCurrent } = this.props

      this.state = {
        seriesData,
        mesureList,
        seriesMeasure: [],
        plotLines: [],
        nameChart: stationAutoCurrent.name,
        minChart: undefined,
        maxChart: undefined,
        series: _.values(seriesData),
        measureCurrent: 'all',
        heightChart,
        dataQcvn: [],
        stationAutoCurrent: {},
      }
    } else {
      this.setState({
        heightChart,
        seriesData,
        mesureList,
        plotLines: [],
        series: _.values(seriesData),
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { stationAutoCurrent } = this.props
    if (
      !_.isEqual(this.props.dataStationAuto, prevProps.dataStationAuto) ||
      !_.isEqual(this.props.measuringData, prevProps.measuringData)
    ) {
      this.initData(this.props)
      this.setState({
        measureCurrent: 'all',
        nameChart: stationAutoCurrent.name,
      })
    }
    if (!_.isEqual(this.props.qcvnSelected, prevProps.qcvnSelected)) {
      this.handleDrawChart()
    }
  }

  //convert data measuringList[] to measuringList{}
  convertDataQcvn = () => {
    const { qcvnSelected } = this.props

    const newDataQcvn = qcvnSelected.map(qcvn => {
      const measureObj = qcvn.measuringList.reduce((base, current) => {
        return {
          ...base,
          [current.key]: current,
        }
      }, {})

      return {
        ...qcvn,
        measuringList: measureObj,
      }
    })
    return newDataQcvn
  }

  //get data qcvn measure selected
  getDataQcvn = measureCurrent => {
    let qcvnList = this.convertDataQcvn()

    qcvnList = qcvnList.map(qcvn => {
      const measuringList = qcvn.measuringList[measureCurrent]
      if (!measuringList) return null

      return {
        name: qcvn.name,
        id: qcvn._id,
        maxLimit: _.get(measuringList, 'maxLimit'),
        minLimit: _.get(measuringList, 'minLimit'),
      }
    })

    qcvnList = qcvnList.filter(qcvn => qcvn)

    return qcvnList
  }

  handleDrawChart = () => {
    const { stationAutoCurrent } = this.props
    const { measureCurrent } = this.state

    let series = []
    let minChart = undefined
    let maxChart = undefined
    let plotLines = []
    let nameChart = stationAutoCurrent.name

    if (measureCurrent !== 'all') {
      let dataSeries = _.get(this.state.seriesData, [measureCurrent], {})
      dataSeries = {
        ...dataSeries,
        marker: {
          enabled: true,
        },
      }

      const measure = stationAutoCurrent.measuringList.find(
        measure => measure.key === measureCurrent
      )

      const minLimit = _.get(dataSeries, 'minLimit')
      series = [dataSeries]

      if (_.isNumber(minLimit)) {
        let data = _.clone(dataSeries) //_.get(this.state.seriesData, [measureCurrent], {})
        _.update(data, 'threshold', () => minLimit)
        _.update(data, 'color', () => 'transparent')
        _.update(data, 'negativeColor', () => 'red')
        series.push(data)
      }

      // draw line qcvn
      const qcvnList = this.getDataQcvn(measureCurrent)

      //type line qcvn
      const lineQcvn = {
        type: 'line',
        enableMouseTracking: false,
      }

      //draw line maxLimit minLimit
      plotLines = [
        {
          value: _.get(measure, 'minLimit', undefined),
          color: '#ff6666',
          dashStyle: 'shortDot',
          width: 1,
          zIndex: 100,
          label: {
            text: translate(`dashboard.chartStatus.min`, {
              min: _.get(measure, 'minLimit', ''),
            }),
            y: 13,
          },
        },
        {
          value: _.get(measure, 'maxLimit', undefined),
          color: '#ff6666',
          dashStyle: 'shortDot',
          width: 1,
          zIndex: 100,
          label: {
            text: translate(`dashboard.chartStatus.max`, {
              max: _.get(measure, 'maxLimit', ''),
            }),
          },
        },
      ]

      qcvnList.forEach(qcvn => {
        //add line qcvn minLimit & maxLimit
        const data = dataSeries.data

        if (_.isNumber(qcvn.maxLimit)) {
          series = [
            ...series,
            {
              ...lineQcvn,
              id: qcvn.id,
              name: qcvn.name,
              valueLimit: qcvn.maxLimit,
              data: data.map((dataItem, index) => {
                if (index === 0) {
                  return {
                    y: qcvn.maxLimit,
                    dataLabels: { enabled: true, className: 'max' },
                  }
                } else {
                  return [dataItem[0], qcvn.maxLimit]
                }
              }),
            },
          ]

          plotLines = []
        }

        if (_.isNumber(qcvn.minLimit)) {
          series = [
            ...series,
            {
              ...lineQcvn,
              id: qcvn.id,
              valueLimit: qcvn.minLimit,
              name: qcvn.name,
              className: 'min',
              data: data.map((dataItem, index) => {
                if (index === 0) {
                  return {
                    y: qcvn.minLimit,
                    dataLabels: { enabled: true, className: 'min' },
                  }
                } else {
                  return [dataItem[0], qcvn.minLimit]
                }
              }),
            },
          ]
          plotLines = []
        }
      })
      const unitMeasure = measure.unit ? `(${measure.unit})` : ''

      nameChart = `${stationAutoCurrent.name} - ${measure.name} ${unitMeasure}`

      minChart = _.get(this.state.heightChart, [measureCurrent, 'minChart'])
      maxChart = _.get(this.state.heightChart, [measureCurrent, 'maxChart']) //_.get(dataSeries,'minLimit', undefined)
    } else {
      series = _.values(this.state.seriesData)
      nameChart = stationAutoCurrent.name
    }
    this.setState({
      series,
      nameChart,
      minChart,
      maxChart,
      plotLines,
    })
  }

  //hightStock không có nút reset khi Zoom x
  configChart = (
    series,
    plotLines = [],
    minChart,
    width,
    nameChart,
    maxChart
  ) => {
    return {
      chart: {
        type: 'line',
        width: width - 160,
        zoomType: 'x',
      },

      credits: {
        enabled: false,
      },

      rangeSelector: {
        enabled: true,
        buttons: [],
        allButtonsEnabled: true,
        inputEnabled: true,
        inputEditDateFormat: '%d/%m/%Y %k:%M',
        inputDateFormat: '%d/%m/%Y %k:%M',
        inputBoxWidth: 120,
      },

      // change color chart zoom
      plotOptions: {
        series: {
          fillColor: 'red',

          dataLabels: {
            enabled: false,
            crop: false,
            overflow: 'none',
            align: 'left',
            verticalAlign: 'middle',
            allowOverlap: true,
            formatter: function() {
              const isMinLimit = this.series.options.className === 'min'

              const labelMinLimit = `${translate(
                'monitoring.moreContent.chart.content.minLimit'
              )} ${this.series.name}: ${this.series.options.valueLimit}`
              const labelMaxLimit = `${translate(
                'monitoring.moreContent.chart.content.maxLimit'
              )} ${this.series.name}: ${this.series.options.valueLimit}`

              const label = isMinLimit ? labelMinLimit : labelMaxLimit

              return `<span style="color: black; font-weight: 300; font-size: 12px">${label}</span>`
            },
          },
        },
      },

      navigation: {
        buttonOptions: {
          enabled: false,
        },
      },

      title: {
        text: nameChart, //this.props.nameChart
      },

      yAxis: {
        min: minChart,
        max: maxChart,
        plotLines,
      },

      //add legend chart
      legend: {
        enabled: true,
      },

      // dùng để custom hiển thị
      tooltip: {
        formatter: function() {
          // The first returned item is the header, subsequent items are the
          // points
          return [
            '<b>' + moment(this.x).format(DD_MM_YYYY_HH_MM) + '</b>',
          ].concat(
            this.points
              ? this.points.map(function(point) {
                  return point.series.name + ': ' + getFormatNumber(point.y)
                })
              : []
          )
        },
        split: true,
      },

      series,

      xAxis: {
        dateTimeLabelFormats: DATETIME_LABEL_FORMAT,
      },

      navigator: {
        xAxis: {
          dateTimeLabelFormats: DATETIME_LABEL_FORMAT,
        },
      },
    }
  }

  handleMeasureChange = measureCurrent => {
    this.setState(
      {
        measureCurrent,
      },
      () => this.handleDrawChart()
    )
  }

  componentDidMount() {
    this.setState({
      width: this.chartWrapper.offsetWidth,
    })
  }

  render() {
    const { measureCurrent, mesureList } = this.state
    return (
      <TabChartWrapper>
        <ChartWrapper innerRef={ref => (this.chartWrapper = ref)}>
          {this.state.width > 160 && (
            <ReactHighcharts
              config={this.configChart(
                this.state.series,
                this.state.plotLines,
                this.state.minChart,
                this.state.width,
                this.state.nameChart,
                this.state.maxChart
              )}
            />
          )}

          <Tabs
            onChange={this.handleMeasureChange}
            activeKey={measureCurrent}
            style={{ width: '90%' }}
          >
            {mesureList.map(({ name, code, unit }) => (
              <TabPane tab={`${name} ${unit ? `(${unit})` : ''}`} key={code} />
            ))}
          </Tabs>
        </ChartWrapper>
      </TabChartWrapper>
    )
  }
}
