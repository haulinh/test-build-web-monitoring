import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import moment from 'moment'

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
  '#6AF9C0'
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
    rangeSelectorZoom: ''
  },
  global: {
    useUTC: false
  }
})

@autobind
export default class TabChart extends React.PureComponent {
  static propTypes = {
    getChart: PropTypes.func,
    dataStationAuto: PropTypes.array,
    measuringData: PropTypes.array,
    nameChart: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.initData(props, true)
  }

  initData = (props, isInit = false) => {
    const seriesData = {}
    const mesureList = _.map(_.clone(props.measuringData), (item, index) => {
      const color = _.get(colors, [index], 'yellow')
      seriesData[item.key] = {
        name: item.name,
        data: [],
        tooltip: { valueDecimals: 4 },
        minLimit: item.minLimit,
        maxLimit: item.maxLimit,
        threshold: _.isNumber(item.maxLimit) ? item.maxLimit : 10000000,
        negativeColor: color,
        color: 'red'
      }
      return {
        code: item.key,
        ...item,
        color
      }
    })

    let heightChart = {}
    _.forEachRight(props.dataStationAuto, item => {
      const time = moment(item._id).valueOf()
      _.mapKeys(seriesData, function(value, key) {
        const val = _.get(item, `${key}`)
        seriesData[key].data.push([time, val])

        const minCureent =
          _.get(heightChart, `${key}.minChart`) ||
          _.get(props.measuringData, [key, 'minLimit']) ||
          _.get(props.measuringData, [key, 'maxLimit'])
        const maxCurrent =
          _.get(heightChart, `${key}.maxChart`) ||
          _.get(props.measuringData, [key, 'maxLimit']) ||
          _.get(props.measuringData, [key, 'minLimit'])
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
        heightChart
      }
    } else {
      this.setState({
        heightChart,
        seriesData,
        mesureList,
        plotLines: [],
        series: _.values(seriesData)
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

  hanldleMeasureChange = measureCurrent => {
    let series = []
    let plotLines = []
    let minChart = undefined
    let maxChart = undefined
    let nameChart = ''
    if (measureCurrent === '__ALL__') {
      series = _.values(this.state.seriesData)
      nameChart = this.props.nameChart
    } else {
      let dataSeries = _.get(this.state.seriesData, [measureCurrent], {})
      // dataSeries.negativeColor = '#058DC7'
      const minLimit = _.get(dataSeries, 'minLimit')
      series = [dataSeries]
      if (_.isNumber(minLimit)) {
        let data = _.clone(dataSeries) //_.get(this.state.seriesData, [measureCurrent], {})
        _.update(data, 'threshold', () => minLimit)
        _.update(data, 'color', () => 'transparent')
        _.update(data, 'negativeColor', () => 'red')
        series.push(data)
      }

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
              min: _.get(dataSeries, 'minLimit', '')
            })
          }
        },
        {
          value: _.get(dataSeries, 'maxLimit', undefined),
          color: 'red',
          dashStyle: 'shortdash',
          width: 1,
          label: {
            text: translate(`dashboard.chartStatus.max`, {
              max: _.get(dataSeries, 'maxLimit', '')
            })
          }
        }
      ]
    }
    this.setState({
      measureCurrent,
      series,
      plotLines,
      minChart,
      nameChart,
      maxChart
    })
  }

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
        width: width - 160
      },
      credits: {
        enabled: false
      },
      rangeSelector: {
        enabled: true,
        buttons: [],
        allButtonsEnabled: true,
        inputEnabled: true,
        inputEditDateFormat: '%d/%m/%Y:%k:%M',
        inputDateFormat: '%d/%m/%Y:%k:%M',
        inputBoxWidth: 120
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      title: {
        text: nameChart //this.props.nameChart
      },
      yAxis: {
        min: minChart,
        max: maxChart,
        plotLines,
        title: {
          text: ''
        }
      },
      series
    }
  }

  componentDidMount() {
    this.setState({
      width: this.chartWrapper.offsetWidth
    })
  }

  render() {
    console.log(this.state.mesureList)
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
          <Thumbnail>
            {this.state.mesureList.map(({ name, code, color, unit }) => (
              <ThumbnailItem
                onClick={() => this.hanldleMeasureChange(code)}
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
