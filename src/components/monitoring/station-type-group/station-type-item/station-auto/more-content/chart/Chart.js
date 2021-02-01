import { Col, Row, Skeleton } from 'antd'
import { getDataStationAutoAvg_v2 } from 'api/DataStationAutoApi'
import InputEditCell from 'components/elements/input-edit-cell'
import Label from 'components/elements/label'
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
const i18n = {
  minLimit: translate('monitoring.moreContent.chart.content.minLimit'),
  maxLimit: translate('monitoring.moreContent.chart.content.maxLimit'),
  to: translate('monitoring.moreContent.chart.content.to'),
  from: translate('monitoring.moreContent.chart.content.from'),
}

const intHour = 24
const intDay = 30

const configChart = (dataSeries, dataXs, title, minLimit, maxLimit) => {
  // console.log(minLimit, "minLimit")
  // console.log(maxLimit, "maxLimit")
  if (dataSeries.length === 0 || dataSeries[0].data.length === 0) {
    return {}
  }
  let minLimitValue = null
  let maxLimitValue = null

  const isMinLimit = typeof minLimit === 'number'
  const isMaxLimit = typeof maxLimit === 'number'
  // console.log(minLimit, maxLimit, 'input limit')
  // console.log(dataSeries[0].data, isMinLimit, isMaxLimit, 'ABC')

  // console.log(dataSeries[0], 'dataSeries[0].data[0].y')
  // lay so nho nhất
  const tempMin = _.reduce(
    dataSeries[0].data,
    (tempMin, item) => {
      return item.y < tempMin ? item.y : tempMin
    },
    dataSeries[0].data[0].y
  )

  //lấy số lơn nhất
  const tempMax = _.reduce(
    dataSeries[0].data,
    (tempMax, item) => {
      return item.y > tempMax ? item.y : tempMax
    },
    dataSeries[0].data[0].y
  )

  const plusMax = 10
  // console.log(tempMin, tempMax, 'tempMin, tempMax')
  if (isMinLimit && isMaxLimit) {
    if (tempMin < minLimit) {
      minLimitValue = tempMin
      maxLimitValue = maxLimit
    }
    if (tempMax > maxLimit) {
      maxLimitValue = tempMax
    }
  } else if (isMinLimit && isMaxLimit === false) {
    if (tempMax > minLimit) {
      maxLimitValue = tempMax + plusMax // cong them
    } else if (tempMin < minLimit) {
      maxLimitValue = minLimit + plusMax // cong them
    }
  } else if (isMinLimit === false && isMaxLimit) {
    if (tempMax > maxLimit) {
      maxLimitValue = tempMax
    }
  } else {
    minLimitValue = null
    maxLimitValue = null
  }

  // console.log(minLimitValue, maxLimitValue, 'min max')

  return {
    chart: {
      type: 'column',
      zoomType: 'x',
      height: 350,
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: dataXs,
    },
    yAxis: {
      title: {
        text: '', // tiêu đề của cột Y
      },
      min: minLimitValue,
      max: maxLimitValue, //maxLimitValue,
      plotLines: [
        {
          value: typeof minLimit === 'number' ? minLimit : null,
          color: 'red',
          width: 1,
          label: {
            text: `${i18n.minLimit}: ${getFormatNumber(minLimit)}`,
          },
          zIndex: 4,
        },
        {
          value: typeof maxLimit === 'number' ? maxLimit : null,
          color: 'red',
          width: 1,
          label: {
            text: `${i18n.maxLimit}: ${getFormatNumber(maxLimit)}`,
            y: 12,
          },
          zIndex: 4,
        },
      ],
    },
    series: dataSeries,
    legend: {
      enabled: false, // ẩn label của series đi
    },
    // dùng để custom hiển thị
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
}))
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
              type: type === 'hours' ? 60 : 1440, // lấy giá trị trung bình theo giờ
            }
          )

          //Cập nhật trạng thái to from cho chart
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
                itemTemp[itemChiTieu] = item.measuringLogs[itemChiTieu].value
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
            let arryDataXs = [] // data của dãy giá trị Y

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
              // neu khong có giá trị thì gắn giá trị bằng không
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

                  // check logic màu cho từng column
                  if (_.has(categories, `${key}`)) {
                    const minLimit = _.get(categories[key], 'minLimit', null)
                    const maxLimit = _.get(categories[key], 'maxLimit', null)
                    const minTend = _.get(categories[key], 'minTend', null)
                    const maxTend = _.get(categories[key], 'maxTend', null)

                    // if (categories[key].key === "pH") {
                    //   console.log(
                    //     value,
                    //     minTend,
                    //     maxTend,
                    //     categories[key],
                    //     "maxLimit"
                    //   )
                    // }

                    if (
                      (value < minLimit && _.isNumber(minLimit)) ||
                      (value > maxLimit && _.isNumber(maxLimit))
                    ) {
                      colorColumn = DATA_COLOR.EXCEEDED
                    } else if (
                      (value < minTend && _.isNumber(minTend)) ||
                      (value > maxTend && _.isNumber(maxTend))
                    ) {
                      colorColumn = DATA_COLOR.EXCEEDED_PREPARING
                    } else {
                      colorColumn = DATA_COLOR.GOOD
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
            tempDataX = arryDataXs // ảo ngược thứ tự
          }
        }
      }
      //Nếu đã chọn chỉ tiêu rồi thì không cần refresh lại
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

    // console.log(this.state.data, this.state.current, 'getConfigData')

    dataSeries.push({
      type: 'column',
      min: minLimit,
      name: _.get(this.state.current, '0.name', ''),
      data: _.get(this.state.data, _.get(this.state.current, '0.key', ''), []),
    })
    if (dataSeries.length > 0) {
      dataXs = this.state.dataX
    }

    return configChart(dataSeries, dataXs, title, minLimit, maxLimit)
  }

  render() {
    // console.log(this.state, this.props, 'this.state.categories')
    return (
      <ChartWrapper className="monitoring-chart">
        <div className="monitoring-chart--to-from">
          <Row gutter={4}>
            <Col sm={3} className="monitoring-chart--to-from__align-right">
              <Label className="monitoring-chart--to-from__font-weight">
                {i18n.to}
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
                {i18n.from}
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

      </ChartWrapper>
    )
  }
}
