import { Col, Row, Skeleton, Tabs } from 'antd'
import { getDataStationAutoAvg_v2 } from 'api/DataStationAutoApi'
import InputEditCell from 'components/elements/input-edit-cell'
import Label from 'components/elements/label'
import { withLanguageContent } from 'components/language/language-content'
import { DD_MM_YYYY, DD_MM_YYYY_HH_MM, HH_MM } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import Proptypes from 'prop-types'
import React from 'react'
import ReactHighcharts from 'react-highcharts'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { DATA_COLOR } from 'themes/color'
import { getConfigColor } from 'constants/stationStatus'
import { warningLevels } from 'constants/warningLevels'

const { TabPane } = Tabs
const ChartWrapper = styled.div`
  flex-direction: column;
  position: relative;

  .monitoring-chart--to-from {
    position: absolute;
    top: -35px;
    z-index: 1;
    right: 0px;
  }
  .monitoring-chart--to-from__align-right {
    text-align: right;
  }
  .monitoring-chart--to-from__font-weight {
    font-weight: 300;
  }
  .monitoring-chart--highchart {
    display: flex;
    justify-content: center;
  }
  .monitoring-chart--highchart__center {
    flex: 1;
  }

  .monitoring-chart--tab {
  }
`
function i18n() {
  return {
    minLimit: translate('monitoring.moreContent.chart.content.minLimit'),
    maxLimit: translate('monitoring.moreContent.chart.content.maxLimit'),
    to: translate('monitoring.moreContent.chart.content.to'),
    from: translate('monitoring.moreContent.chart.content.from'),
  }
}

const intHour = 24
const intDay = 30

const configChart = (dataSeries, dataXs, title, minLimit, maxLimit) => {
  // console.log(minLimit, "minLimit")
  // console.log(maxLimit, "maxLimit")
  if (dataSeries.length === 0 || dataSeries[0].data.length === 0) {
    return {}
  }

  return {
    chart: {
      zoomType: 'x',
      height: 350,
    },
    title: {
      text: title,
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
      },
    },
    xAxis: {
      categories: dataXs,
    },
    yAxis: {
      title: {
        text: '', // ti??u ????? c???a c???t Y
      },
    },
    series: dataSeries,
    legend: {
      enabled: false, // ???n label c???a series ??i
    },
    // d??ng ????? custom hi???n th???
    tooltip: {
      formatter: function() {
        // console.log(this.x, "this.x")
        return ['<b>' + this.x + '</b>'].concat(
          this.points.map(function(point) {
            return `${point.series.name}: ${getFormatNumber(point.y)}`
          })
        )
      },
      split: true,
    },
  }
}
@connect(state => ({
  isOpen: state.theme.navigation.isOpen,
  colorData: _.get(state, 'config.color.warningLevel.data.value', []),
}))
@withLanguageContent
export default class ChartRowToChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      current: [],
      data: {},
      dataX: [],
      strToDate: '',
      strFromDate: '',
      isLoading: false,
    }
  }

  static propTypes = {
    stationData: Proptypes.object,
    chartType: Proptypes.string,
  }

  componentDidMount() {
    this.loadDataBy(this.props.stationData, this.props.chartType)
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.chartType, this.props.chartType) ||
      !_.isEqual(nextProps.isOpen, this.props.isOpen)
    ) {
      this.loadDataBy(this.props.stationData, nextProps.chartType)
    }
  }

  async loadDataBy(station, type = 'hours') {
    const { colorData } = this.props

    this.setState({
      isLoading: true,
    })

    let categories = []
    let current = null
    let measuringKeys = []
    let results = {}
    let tempDataX = []
    const giaTriTinh = type === 'hours' ? intHour : intDay // 24 | 30
    if (!_.isEmpty(station)) {
      categories = _.keyBy(_.get(station, 'measuringList', []), 'key')
      measuringKeys = _.keys(categories)

      if (_.has(station, 'lastLog.receivedAt')) {
        let receivedAt = _.get(station, 'lastLog.receivedAt')

        let toDate = moment(receivedAt).toISOString()
        let fromDate = moment(receivedAt)
          .minute(0)
          .subtract(giaTriTinh, type)
          .toISOString()

        if (toDate && fromDate) {
          const dataSources = await getDataStationAutoAvg_v2(
            { page: 1, itemPerPage: 3000 },
            {
              fromDate: fromDate,
              toDate: toDate,
              key: _.get(station, 'key', ''),
              measuringList: measuringKeys,
              type: type === 'hours' ? 60 : 1440, // l???y gi?? tr??? trung b??nh theo gi???
            }
          )

          //C???p nh???t tr???ng th??i to from cho chart
          const station_FORMAT =
            type === 'hours' ? DD_MM_YYYY_HH_MM : DD_MM_YYYY
          this.setState({
            strToDate: moment(toDate).format(station_FORMAT),
            strFromDate: moment(fromDate).format(station_FORMAT),
          })

          let dataOrder = _.orderBy(_.get(dataSources, 'data', []), 'date_utc')

          let data = []
          if (dataOrder.length > 0) {
            const measuringList = _.map(
              this.props.stationData.measuringList,
              'key'
            )
            data = _.map(dataOrder, item => {
              const itemTemp = {}
              _.forEach(measuringList, itemChiTieu => {
                itemTemp[itemChiTieu] = _.get(
                  item.measuringLogs[itemChiTieu],
                  'value',
                  null
                )
              })
              return {
                date_utc: item.date_utc,
                ...itemTemp,
              }
            })
          }

          let arrDataX = []
          for (let i = 0; i <= giaTriTinh; i++) {
            const itemX = moment(receivedAt).subtract(i, type)
            arrDataX.push(itemX)
          }

          // console.log(arrDataX,"arrDataX")

          if (arrDataX.length > 0) {
            let arryDataXs = [] // data c???a d??y gi?? tr??? Y

            _.forEach(arrDataX.reverse(), item => {
              const item_FORMAT = type === 'hours' ? HH_MM : 'DD/MM'
              const itemX = moment(item)
                .minute(0)
                .format(item_FORMAT)
              arryDataXs.push(`<b>${itemX}</b>`) //xong

              const data_indexOf = _.findIndex(data, itemFillter => {
                const FORMAT = type === 'hours' ? DD_MM_YYYY_HH_MM : DD_MM_YYYY
                const data_mmReceivedAt = moment(itemFillter.date_utc)
                  .minute(0)
                  .format(FORMAT)
                const item_mmReceivedAt = moment(item)
                  .minute(0)
                  .format(FORMAT)
                return data_mmReceivedAt === item_mmReceivedAt
              })

              // console.log(data_indexOf,"data_indexOf")
              // neu khong c?? gi?? tr??? th?? g???n gi?? tr??? b???ng kh??ng
              if (data_indexOf === -1) {
                const itemData = data[0]
                _.mapKeys(itemData, (value, key) => {
                  const array = _.get(results, key, [])
                  results[key] = _.concat(array, [
                    {
                      y: null,
                      color: DATA_COLOR.GOOD,
                    },
                  ])
                  return key
                })
              } else {
                const itemData = data[data_indexOf]
                _.mapKeys(itemData, (value, key) => {
                  const array = _.get(results, key, [])
                  let valueObj = undefined
                  let colorColumn = DATA_COLOR.GOOD

                  // check logic m??u cho t???ng column
                  if (_.has(categories, `${key}`)) {
                    const minLimit = _.get(categories[key], 'minLimit', null)
                    const maxLimit = _.get(categories[key], 'maxLimit', null)
                    const minTend = _.get(categories[key], 'minTend', null)
                    const maxTend = _.get(categories[key], 'maxTend', null)

                    if (
                      (value < minLimit && _.isNumber(minLimit)) ||
                      (value > maxLimit && _.isNumber(maxLimit))
                    ) {
                      const configColor = getConfigColor(
                        colorData,
                        warningLevels.EXCEEDED,
                        {
                          defaultPrimary: null,
                          defaultSecond: '#ffffff',
                        }
                      )
                      colorColumn = configColor.primaryColor
                    } else if (
                      (value < minTend && _.isNumber(minTend)) ||
                      (value > maxTend && _.isNumber(maxTend))
                    ) {
                      const configColor = getConfigColor(
                        colorData,
                        warningLevels.EXCEEDED_PREPARING,
                        {
                          defaultPrimary: null,
                          defaultSecond: '#ffffff',
                        }
                      )
                      colorColumn = configColor.primaryColor
                    } else {
                      const configColor = getConfigColor(
                        colorData,
                        warningLevels.GOOD,
                        {
                          defaultPrimary: null,
                          defaultSecond: '#ffffff',
                        }
                      )
                      colorColumn = configColor.primaryColor
                    }
                  }
                  // console.log(colorColumn,"colorColumn")

                  valueObj = [
                    {
                      y: value,
                      color: colorColumn,
                    },
                  ]
                  results[key] = _.concat(array, valueObj)

                  return key
                })
              }
            })
            tempDataX = arryDataXs // ???o ng?????c th??? t???
          }
        }
      }
      //N???u ???? ch???n ch??? ti??u r???i th?? kh??ng c???n refresh l???i
      current =
        this.state.current.length > 0
          ? this.state.current
          : _.toArray(categories)
    }
    // this.setState({ categories, current, day, data: results, isShowAll: true })
    this.setState({
      categories: _.toArray(categories),
      current,
      data: results,
      dataX: tempDataX,
      isLoading: false,
    })
  }

  handleClick = e => {
    const current = [_.get(_.keyBy(this.state.categories, 'key'), e, null)]
    this.setState({
      current,
    })
  }

  getConfigData = () => {
    const { translateContent } = this.props

    if (this.state.current.length === 0) {
      return {}
    }

    let dataSeries = []
    let dataXs = []
    let maxLimit = null
    let minLimit = null
    let title = _.get(this.props, 'station.name', '')

    maxLimit = _.get(this.state.current, '0.maxLimit', null)
    minLimit = _.get(this.state.current, '0.minLimit', null)

    const measureName = translateContent({
      type: 'Measure',
      itemKey: _.get(this.state.current, '0.key', ''),
      value: _.get(this.state.current, '0.name', ''),
    })

    const dataX = _.get(
      this.state.data,
      _.get(this.state.current, '0.key', ''),
      []
    )

    dataSeries.push({
      type: 'column',
      min: minLimit,
      name: measureName,
      data: _.get(this.state.data, _.get(this.state.current, '0.key', ''), []),
    })

    // eslint-disable-next-line no-sequences
    const arrayLimit = [
      {
        color: 'red',
        name: `${i18n().maxLimit}: `,
        type: 'line',
        data: dataX.map(() => maxLimit),
      },
      {
        color: 'red',
        name: `${i18n().minLimit}: `,
        type: 'line',
        data: dataX.map(() => minLimit),
      },
    ]

    arrayLimit.forEach(limit => {
      dataSeries.push(limit)
    })

    if (dataSeries.length > 0) {
      dataXs = this.state.dataX
    }

    return configChart(dataSeries, dataXs, title, minLimit, maxLimit)
  }

  render() {
    // console.log(this.state, this.props, 'this.state.categories')
    const { translateContent } = this.props
    return (
      <ChartWrapper className="monitoring-chart">
        <div className="monitoring-chart--to-from">
          <Row gutter={4}>
            <Col sm={3} className="monitoring-chart--to-from__align-right">
              <Label className="monitoring-chart--to-from__font-weight">
                {i18n().to}
              </Label>
            </Col>
            <Col sm={9}>
              <InputEditCell
                disabled={true}
                editable={'true'}
                size="small"
                value={this.state.strFromDate}
              />
            </Col>
            <Col sm={3} className="monitoring-chart--to-from__align-right">
              <Label className="monitoring-chart--to-from__font-weight">
                {i18n().from}
              </Label>
            </Col>
            <Col sm={9}>
              <InputEditCell
                disabled={true}
                editable={'true'}
                size="small"
                value={this.state.strToDate}
              />
            </Col>
          </Row>
        </div>
        <Skeleton loading={this.state.isLoading} paragraph={{ rows: 4 }} active>
          <div className="monitoring-chart--highchart">
            <div className="monitoring-chart--highchart__center">
              <ReactHighcharts config={this.getConfigData()} />
            </div>
          </div>
        </Skeleton>
        {!this.state.isLoading && (
          <div className="monitoring-chart--tab">
            {this.state.current.length > 0 && (
              <Tabs
                style={{
                  width: '100%',
                  paddingLeft: 8,
                  paddingRight: 8,
                }}
                defaultActiveKey={_.get(this.state.current[0], 'key', '')}
                onTabClick={this.handleClick}
              >
                {_.map(this.state.categories, ({ key, name, unit }) => {
                  const measureName = translateContent({
                    type: 'Measure',
                    itemKey: key,
                    value: name,
                  })

                  return (
                    <TabPane
                      tab={unit ? `${measureName} (${unit})` : `${measureName}`}
                      key={key}
                    />
                  )
                })}
              </Tabs>
            )}
          </div>
        )}
      </ChartWrapper>
    )
  }
}
