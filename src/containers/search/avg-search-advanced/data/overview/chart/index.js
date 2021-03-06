import { Tabs } from 'antd'
import { getContent } from 'components/language/language-content'
import {
  DATETIME_LABEL_FORMAT,
  DATETIME_TOOLTIP_FORMAT,
} from 'constants/chart-format'
import { getFormatNumber } from 'constants/format-number'
import { formatTime } from 'containers/search/avg-search-advanced/utils/formatTime'
import Highcharts from 'highcharts'
import { translate } from 'hoc/create-lang'
import { get, isEmpty, isNil, isNumber, keyBy } from 'lodash'
import moment from 'moment-timezone'
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import { connect } from 'react-redux'

ReactHighcharts.Highcharts.setOptions({
  global: {
    useUTC: false,
  },
})

const showMarker = type => {
  const isLongRangeType = ['month', 'year', 1440].includes(type)
  return isLongRangeType ? true : false
}

const configChart = (data, title, type) => {
  return {
    chart: {
      type: 'spline',
      zoomType: 'x',
      height: document.body.clientHeight - 340,
    },
    title: {
      text: title,
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: DATETIME_LABEL_FORMAT,
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: showMarker(type),
        },
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
      spline: {
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
      xDateFormat: '%d/%m/%Y %H:%M',
      dateTimeLabelFormats: DATETIME_TOOLTIP_FORMAT,
      formatter: function() {
        let format = `<div style="font-weight: 700; height: 6px">${formatTime(
          this.x,
          type
        )}</div><br>`

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
  }
}

@connect(state => ({
  languageContents: get(state, 'language.languageContents'),
}))
export default class ChartOverview extends Component {
  state = {
    current: get(
      keyBy(this.props.dataChart.measuringList, 'key'),
      this.props.dataChart.measuringList[0].key,
      null
    ),
  }

  getNewDataSeriesWithQCVN = dataSeries => {
    const { current } = this.state
    let newDataSeries = dataSeries

    const qcvnList = this.getQCVNList(current.key)
    const lineQcvn = {
      enableMouseTracking: false,
      dashStyle: 'Dash',
    }

    qcvnList.forEach(qcvn => {
      const data = newDataSeries[0].data

      if (isNumber(qcvn.maxLimit)) {
        newDataSeries = [
          ...newDataSeries,
          {
            ...lineQcvn,
            id: qcvn.id,
            name: qcvn.name,
            valueLimit: qcvn.maxLimit,
            data: data.map((dataItem, index) => {
              if (index === 0) {
                return {
                  x: dataItem[0],
                  y: qcvn.maxLimit,
                  dataLabels: { enabled: true },
                }
              } else {
                return [dataItem[0], qcvn.maxLimit]
              }
            }),
          },
        ]
      }

      if (isNumber(qcvn.minLimit)) {
        newDataSeries = [
          ...newDataSeries,
          {
            ...lineQcvn,
            id: qcvn.id,
            valueLimit: qcvn.minLimit,
            name: qcvn.name,
            className: 'min',
            data: data.map((dataItem, index) => {
              if (index === 0) {
                return {
                  x: dataItem[0],
                  y: qcvn.minLimit,
                  dataLabels: { enabled: true },
                }
              } else {
                return [dataItem[0], qcvn.minLimit]
              }
            }),
          },
        ]
      }
    })
    return newDataSeries
  }

  getConfigData = () => {
    const { dataChart, languageContents, searchFormData } = this.props
    const { current } = this.state
    const { key, name, unit } = current

    const title = this.getMeasureName(key, name, unit)
    const type = searchFormData.type
    let dataSeries = []

    dataChart.stations.forEach(station => {
      const stationName = getContent(languageContents, {
        type: 'Station',
        itemKey: station.key,
        value: station.name,
      })

      !isEmpty(this.getDataWithStation(station)) &&
        dataSeries.push({
          type: 'spline',
          name: stationName,
          data: this.getDataWithStation(station),
          lineWidth: 2,
        })
    })

    let newDataSeries = this.getDataSeriesWithNullData(dataSeries)

    if (!isEmpty(newDataSeries)) {
      newDataSeries = this.getNewDataSeriesWithQCVN(newDataSeries)
    }

    return configChart(newDataSeries, title, type)
  }

  getDataSeriesWithNullData = dataSeries => {
    const { dataChart } = this.props

    //List time in chart with sort data
    const timeList = Object.entries(dataChart.data)
      .map(([keyTime, _]) => {
        return moment(keyTime).valueOf()
      })
      .sort((a, b) => a - b)

    //Format new dataSeries with null value
    const newDataSeries = dataSeries.map(series => {
      const data = timeList.map(time => {
        const valueFind = series.data.find(item => item[0] === time)
        if (valueFind) {
          return [time, valueFind[1]]
        }
        return [time, null]
      })
      return { ...series, data }
    })
    return newDataSeries
  }

  getQCVNList = measureCurrent => {
    let qcvnList = this.convertDataQcvn()

    qcvnList = qcvnList.map(qcvn => {
      const measuringList = qcvn.measuringList[measureCurrent]
      if (!measuringList) return null

      return {
        name: qcvn.name,
        id: qcvn._id,
        maxLimit: get(measuringList, 'maxLimit'),
        minLimit: get(measuringList, 'minLimit'),
      }
    })

    qcvnList = qcvnList.filter(qcvn => qcvn)

    return qcvnList
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

  getDataWithStation = station => {
    const { current } = this.state
    const { dataChart } = this.props

    let data = []

    Object.entries(dataChart.data).forEach(([key, value]) => {
      const keyList = Object.keys(value)

      if (keyList.some(item => item === get(station, 'key'))) {
        const stationLogs = get(value, station.key, null).logs
        const measureKey = get(stationLogs, current.key, null)

        const valueInChart = getFormatNumber(
          get(measureKey, 'value', null),
          2,
          2,
          null
        )

        //add x, y value to data series chart
        !isNil(valueInChart) &&
          data.push([moment(key).valueOf(), Number(valueInChart)])
      }
    })

    return data
  }

  getMeasureName = (key, name, unit) => {
    const { languageContents } = this.props
    const measureName = getContent(languageContents, {
      type: 'Measure',
      itemKey: key,
      value: name,
    })

    return unit ? `${measureName} (${unit})` : `${measureName}`
  }

  handleClick = key => {
    const { dataChart } = this.props
    const current = get(keyBy(dataChart.measuringList, 'key'), key, null)

    this.setState({ current })
  }
  render() {
    const { dataChart } = this.props

    return (
      <React.Fragment>
        <ReactHighcharts config={this.getConfigData()} />
        <Tabs
          style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}
          defaultActiveKey={dataChart.measuringList[0].key}
          onTabClick={this.handleClick}
        >
          {dataChart.measuringList
            .filter(measuring => !isEmpty(measuring))
            .map(({ key, name, unit }) => {
              return (
                <Tabs.TabPane
                  tab={this.getMeasureName(key, name, unit)}
                  key={key}
                />
              )
            })}
        </Tabs>
      </React.Fragment>
    )
  }
}
