import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import moment from 'moment'
import { DATETIME_LABEL_FORMAT } from 'constants/chart-format'

const TabChartWrapper = styled.div`
  justify-content: center;
  align-items: center;
  flex: 1;
`

ReactHighcharts.Highcharts.wrap(ReactHighcharts.Highcharts.RangeSelector.prototype, 'drawInput', function(proceed, name) {
  proceed.call(this, name)
  this[name + 'DateBox'].on('click', function() {})
})

ReactHighcharts.Highcharts.setOptions({
  lang: {
    rangeSelectorFrom: translate('chart.from'),
    rangeSelectorTo: translate('chart.to'),
    rangeSelectorZoom: ''
  }
})

@autobind
export default class TabChart extends React.PureComponent {
  static propTypes = {
    getChart: PropTypes.func,
    dataAQI: PropTypes.array,
    nameChart: PropTypes.string
  }

  state = {
    isloading: true
  }
  constructor(props) {
    super(props)
    this.initData(props)
  }

  initData = props => {
    this.setState({
      isloading: true
    })

    if (!props.dataAQI) return

    const firt = _.head(props.dataAQI)

    const arrKeys = _.keys(_.omit(firt, 'time'))
    // console.log(arrKeys,"arrKeys")
    let seriesData = {}

    const dataSort = _.sortBy(props.dataAQI,'time')

    _.forEach(dataSort, item => {
      _.forEach(arrKeys, key => {
        const tempData = _.get(seriesData[key], 'data', [])
        const tempValue = _.get(item[key], 'aqiDay', null) ? _.get(item[key], 'aqiDay', null) : 0
        const itemAdd = [moment(_.get(item[key], 'time', null)).valueOf(), tempValue]
        seriesData[key] = {
          name: item[key].name,
          data: _.concat(tempData, [itemAdd]),
          tooltip: { valueDecimals: 2 }
        }
      })
    })

    // console.log(_.values(seriesData), '_.values(seriesData)')
    this.setState({
      seriesData,
      series: _.values(seriesData),
      isloading: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.dataAQI, nextProps.dataAQI)) {
      this.initData(nextProps)
    }
  }

  configChart = (series, nameChart) => {
    return {
      chart: {
        type: 'line'
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
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          ...DATETIME_LABEL_FORMAT
        },
        labels: {
          style: {  fontSize: '8px' }
        }
      },
      title: {
        text: nameChart //this.props.nameChart
      },
      series,
      tooltip: {
        dateTimeLabelFormats: DATETIME_LABEL_FORMAT
      }
    }
  }

  render() {
    return <TabChartWrapper>{!this.state.isloading && <ReactHighcharts config={this.configChart(this.state.series)} />}</TabChartWrapper>
  }
}
