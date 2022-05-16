import { Tabs } from 'antd'
import { getContent } from 'components/language/language-content'
import {
  DATETIME_LABEL_FORMAT,
  DATETIME_TOOLTIP_FORMAT,
} from 'constants/chart-format'
import { getFormatNumberChart } from 'constants/format-number'
import Highcharts from 'highcharts'
import { get, isNil, keyBy, isEmpty } from 'lodash'
import moment from 'moment-timezone'
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import { connect } from 'react-redux'
import styled from 'styled-components'

const ChartWrapper = styled.div``

ReactHighcharts.Highcharts.setOptions({
  global: {
    useUTC: false,
  },
})

const configChart = (data, title) => {
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
      reversed: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
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
        let format = `<div style="font-weight: 700; height: 6px">${moment(
          this.x
        ).format('DD/MM/YYYY hh:mm')}</div><br>`

        this.points.forEach(p => {
          format += `<div style="display: flex; height: 6px" >
              <div style="color: ${p.color}">${p.series.name}:  </div>&nbsp
              <div style="font-weight: 700">${p.y}</div>
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

  getConfigData = () => {
    const { dataChart, languageContents } = this.props
    const { current } = this.state
    const { key, name, unit } = current
    const title = this.getMeasureName(key, name, unit)
    let dataSeries = []

    dataChart.stations.reverse().forEach(station => {
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

    return configChart(dataSeries, title)
  }

  getDataWithStation = station => {
    const { current } = this.state
    const { dataChart } = this.props

    let results = []

    Object.entries(dataChart.data)
      .map(([key, value]) => ({
        key,
        value,
      }))
      .forEach(({ key, value }) => {
        const keyList = Object.keys(value)

        if (keyList.some(item => item === get(station, 'key'))) {
          const stationLogs = get(value, station.key, null).logs
          const measureKey = get(stationLogs, current.key, null)
          const valueInChart = getFormatNumberChart(
            get(measureKey, 'value', null),
            2
          )

          !isNil(valueInChart) &&
            results.push([moment(key).valueOf(), valueInChart])
        }
      })

    return results.reverse()
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
    const { measuringList } = this.props.dataChart
    const current = get(keyBy(measuringList, 'key'), key, null)

    this.setState({ current })
  }
  render() {
    const { dataChart } = this.props

    return (
      <ChartWrapper>
        <ReactHighcharts config={this.getConfigData()} />
        <Tabs
          style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}
          defaultActiveKey={dataChart.measuringList[0].key}
          onTabClick={this.handleClick}
        >
          {dataChart.measuringList.map(({ key, name, unit }) => {
            return (
              <Tabs.TabPane
                tab={this.getMeasureName(key, name, unit)}
                key={key}
              />
            )
          })}
        </Tabs>
      </ChartWrapper>
    )
  }
}
