import { DATETIME_LABEL_FORMAT } from 'constants/chart-format'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
} from 'constants/format-number'
import { autobind } from 'core-decorators'
import Highcharts from 'highcharts'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import { connect } from 'react-redux'
import styled from 'styled-components'

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

const Thumbnail = styled.div`
  display: flex;
  flex-direction: row;
`

const ThumbnailItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-bottom: ${props => (props.selected ? 2 : 0)}px solid blue;
`

const Line = styled.div`
  height: 2px;
  width: 7px;
  margin-right: 4px;
  background-color: ${props => props.color || 'transparent'};
`

const colors = [
  '#058DC0',
  '#50B432',
  '#7D5611',
  '#DDDF00',
  '#24CBE8',
  '#64E572',
  '#FF9655',
  '#FFF26f',
  '#6AF9C0',
]
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
    nameChart: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.initData(props, true)
  }

  state = {
    measureCurrent: '',
  }

  chartInstance

  initData = (props, isInit = false) => {
    const { measuringList, measuresObj } = props
    const seriesData = {}
    const mesureList = measuringList.map((measure, index) => {
      const { name, key, minLimit, maxLimit } = measuresObj[measure]
      const color = _.get(colors, [index], 'yellow')
      seriesData[key] = {
        name,
        data: [],
        tooltip: { valueDecimals: FORMAT_VALUE_MEASURING },
        minLimit: minLimit,
        maxLimit: maxLimit,
        threshold: _.isNumber(maxLimit) ? maxLimit : 10000000,
        negativeColor: color,
        color: 'red',
      }
      return {
        code: key,
        ...measuresObj[measure],
        color,
      }
    })

    // console.log({ mesureList })

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

    mesureList.unshift({ code: '__ALL__', name: translate('chart.all') })
    if (isInit) {
      this.state = {
        seriesData,
        mesureList,
        plotLines: [],
        minChart: undefined,
        maxChart: undefined,
        nameChart: '',
        series: _.values(seriesData),
        measureCurrent: '__ALL__',
        measure: '__ALL__',
        heightChart,
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

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(this.props.dataStationAuto, nextProps.dataStationAuto) ||
      !_.isEqual(this.props.measuringData, nextProps.measuringData)
    ) {
      this.initData(nextProps)
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

  handleMeasureChange = measureCurrent => {
    let series = []
    let plotLines = []
    let minChart = undefined
    let maxChart = undefined
    let nameChart = ''

    this.setState(
      {
        measureCurrent,
      },
      () => this.drawLineQcvn()
    )

    if (measureCurrent === '__ALL__') {
      series = _.values(this.state.seriesData)
      nameChart = this.props.nameChart
    } else {
      let dataSeries = _.get(this.state.seriesData, [measureCurrent], {})

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

      const lineQcvn = {
        type: 'line',
        marker: {
          enabled: false,
        },
        enableMouseTracking: false,
        dataLabels: {
          enabled: false,
        },
      }

      qcvnList.forEach(qcvn => {
        const data = dataSeries.data

        if (qcvn.maxLimit || qcvn.maxLimit === 0)
          series.push({
            ...dataSeries,
            ...lineQcvn,
            id: qcvn.id,
            name: qcvn.name,
            data: data.map(dataItem => [dataItem[0], qcvn.maxLimit]),
          })
        if (qcvn.minLimit || qcvn.minLimit === 0)
          series.push({
            ...dataSeries,
            ...lineQcvn,
            id: qcvn.id,
            name: qcvn.name,
            data: data.map(dataItem => [dataItem[0], qcvn.minLimit]),
          })
      })

      minChart = _.get(this.state.heightChart, [measureCurrent, 'minChart'])
      maxChart = _.get(this.state.heightChart, [measureCurrent, 'maxChart']) //_.get(dataSeries,'minLimit', undefined)
      nameChart = `${this.props.nameChart} - ${measureCurrent}`
      plotLines = [
        {
          value: _.get(dataSeries, 'minLimit', undefined),
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: translate(`dashboard.chartStatus.min`, {
              min: _.get(dataSeries, 'minLimit', ''),
            }),
          },
        },
        {
          value: _.get(dataSeries, 'maxLimit', undefined),
          color: 'red',
          dashStyle: 'shortdash',
          width: 1,
          label: {
            text: translate(`dashboard.chartStatus.max`, {
              max: _.get(dataSeries, 'maxLimit', ''),
            }),
          },
        },
      ]
    }
    this.setState({
      series,
      plotLines,
      minChart,
      nameChart,
      maxChart,
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
        // plotLines,
        plotLines: [
          {
            dashStyle: 'solid', // Style of the plot line. Default to solid
            value: 3, // Value of where the line will appear
            width: 2, // Width of the line
          },
          {
            dashStyle: 'solid', // Style of the plot line. Default to solid
            value: 8, // Value of where the line will appear
            width: 2, // Width of the line
          },
        ],
        title: {
          text: '',
        },
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

  drawLineQcvn = () => {
    const { measure } = this.state
    console.log({ measure })
  }

  componentDidMount() {
    this.setState({
      width: this.chartWrapper.offsetWidth,
    })
    // this.chartInstance = ReactHighcharts.Highcharts
    this.chartInstance = Highcharts
  }

  render() {
    // console.log({ seriesData: this.state.series })
    const { qcvnSelected } = this.props
    // console.log({ qcvnSelected })

    return (
      <TabChartWrapper>
        <ChartWrapper
          id="data-search"
          innerRef={ref => (this.chartWrapper = ref)}
        >
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
          <Thumbnail>
            {this.state.mesureList.map(({ name, code, color, unit }) => (
              <ThumbnailItem
                onClick={() => this.handleMeasureChange(code)}
                selected={this.state.measureCurrent === code}
                color={color}
                key={code}
                code={code}
              >
                <Line color={color} />
                {unit !== '' && code !== '__ALL__'
                  ? `${name} (${unit})`
                  : `${name}`}
              </ThumbnailItem>
            ))}
          </Thumbnail>
        </ChartWrapper>
      </TabChartWrapper>
    )
  }
}
