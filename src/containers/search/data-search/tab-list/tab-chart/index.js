import { Row, Spin, Tabs } from 'antd'
import {
  DATETIME_LABEL_FORMAT,
  DATETIME_TOOLTIP_FORMAT,
} from 'constants/chart-format'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import { isEmpty } from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import ReactHighcharts from 'react-highcharts'
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

ReactHighcharts.Highcharts.setOptions({
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
      const allValueMeasure = props.dataStationAuto.map(
        dataStation => dataStation.measuringLogs[key]
      )

      const isHasData = allValueMeasure.some(value => value)

      seriesData[key] = {
        name,
        data: [],
        isHasData,
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

        if (!val) val = null

        if (!seriesData[key].isHasData) return

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

    // mesureList.unshift({ code: 'all', name: translate('chart.all') })

    if (isInit) {
      const { stationAutoCurrent } = this.props
      const initSeries = [seriesData[measuringList[0]]]

      const firstMeasure = measuresObj[measuringList[0]]
      const nameChartInit = this.getNameChart(
        stationAutoCurrent.name,
        firstMeasure
      )

      this.state = {
        seriesData,
        mesureList,
        seriesMeasure: [],
        plotLines: [],
        nameChart: nameChartInit,
        minChart: undefined,
        maxChart: undefined,
        series: initSeries,
        measureCurrent: measuringList[0],
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
      })
    }
  }

  componentDidUpdate(prevProps) {
    const {
      stationAutoCurrent,
      dataStationAuto,
      measuringList,
      measuresObj,
    } = this.props

    if (
      !_.isEqual(dataStationAuto, prevProps.dataStationAuto) ||
      !_.isEqual(measuringList, prevProps.measuringList)
    ) {
      const measure = measuresObj[measuringList[0]]

      this.setState(
        {
          nameChart: this.getNameChart(stationAutoCurrent.name, measure),
          measureCurrent: measuringList[0],
        },
        () => this.handleDrawChart()
      )

      this.initData(this.props)
    }
    if (!_.isEqual(this.props.qcvnSelected, prevProps.qcvnSelected)) {
      this.handleDrawChart()
    }
  }

  getNameChart = (stationName, measure = {}) => {
    const unitMeasure = measure.unit ? `(${measure.unit})` : ''
    const nameChart = `${stationName} - ${measure.name} ${unitMeasure}`

    return nameChart
  }

  //convert data measuringList[] to measuringList{}
  convertDataQcvn = () => {
    const { qcvnSelected = [] } = this.props

    const newDataQcvn = qcvnSelected.map(qcvn => {
      const measureObj = (qcvn.measuringList || []).reduce((base, current) => {
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
    const { stationAutoCurrent, measuresObj } = this.props
    const { seriesData, measureCurrent } = this.state

    let series = []
    let minChart = undefined
    let maxChart = undefined
    let plotLines = []
    let nameChart = stationAutoCurrent.name

    let dataSeries = _.get(seriesData, [measureCurrent], {})

    const measure = stationAutoCurrent.measuringList.find(
      measure => measure.key === measureCurrent
    )

    nameChart = this.getNameChart(
      stationAutoCurrent.name,
      measuresObj[measureCurrent]
    )
    if (isEmpty(dataSeries.data)) {
      this.setState({ series: [], nameChart })
      return
    }

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
      type: 'spline',
      enableMouseTracking: false,
      dashStyle: 'Dash',
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
            typeLine: 'qcvn',
            valueLimit: qcvn.maxLimit,
            data: data.map((dataItem, index) => [dataItem[0], qcvn.maxLimit]),
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
            typeLine: 'qcvn',
            data: data.map(dataItem => [dataItem[0], qcvn.minLimit]),
          },
        ]
        plotLines = []
      }
    })

    minChart = _.get(this.state.heightChart, [measureCurrent, 'minChart'])
    maxChart = _.get(this.state.heightChart, [measureCurrent, 'maxChart']) //_.get(dataSeries,'minLimit', undefined)
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
        type: 'spline',
        width: width - 300,
        zoomType: 'x',
        height: 600,
      },

      marker: {
        enabled: false,
      },

      credits: {
        enabled: false,
      },

      rangeSelector: {
        enabled: false,
      },

      exporting: {
        filename: nameChart,
      },
      // change color chart zoom
      plotOptions: {
        series: {
          fillColor: 'red',

          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none',
            align: 'left',
            verticalAlign: 'middle',
            allowOverlap: true,
            width: '100%',
            formatter: function() {
              const currentPoint = this.point
              const seriesPoints = this.series.points
              const typeLine = this.series.userOptions.typeLine

              const isMinLimit = this.series.options.className === 'min'

              const labelMinLimit = `${translate(
                'monitoring.moreContent.chart.content.minLimit'
              )} ${this.series.name}: ${this.series.options.valueLimit}`
              const labelMaxLimit = `${translate(
                'monitoring.moreContent.chart.content.maxLimit'
              )} ${this.series.name}: ${this.series.options.valueLimit}`

              const label = isMinLimit ? labelMinLimit : labelMaxLimit

              if (currentPoint === seriesPoints[0] && typeLine === 'qcvn') {
                return `<span style="color: black; font-weight: 300; font-size: 12px">${label}</span>`
              }
            },
          },
        },
        spline: {
          marker: {
            enabled: false,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
        },
      },

      navigation: {
        buttonOptions: {
          enabled: true,
        },
      },

      title: {
        text: nameChart,
      },

      yAxis: {
        min: minChart,
        max: maxChart,
        plotLines,
        title: false,
      },

      //add legend chart
      legend: {
        enabled: true,
      },

      // dùng để custom hiển thị
      tooltip: {
        xDateFormat: '%d/%m/%Y %H:%M',
        dateTimeLabelFormats: DATETIME_TOOLTIP_FORMAT,
        formatter: function() {
          let format = `<div style="font-weight: 700; height: 6px">${moment(
            this.x
          ).format('DD/MM/YYYY HH:mm')}</div><br>`

          this.points.forEach(p => {
            format += `<div style="display: flex; height: 6px" >
                <div style="color: ${p.color}">${p.series.name}:  </div>&nbsp
                <div style="font-weight: 700">${getFormatNumber(p.y, 2)}</div>
                </div><br>`
          })

          return format
        },
        shared: true,
        useHTML: true,
      },

      series,

      xAxis: {
        type: 'datetime',

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
    this.handleDrawChart()
  }

  render() {
    const { measureCurrent, mesureList } = this.state
    const { loading } = this.props

    if (loading)
      return (
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ minHeight: 300 }}
        >
          <Spin />
        </Row>
      )

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
            style={{ width: '70%' }}
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
