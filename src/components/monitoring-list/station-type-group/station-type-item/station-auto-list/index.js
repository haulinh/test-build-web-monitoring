import React from 'react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Tooltip } from 'antd'
import * as _ from 'lodash'
import { SHAPE } from 'themes/color'
import { DD_MM_YY_HH_MM } from 'constants/format-date.js'
import { warningLevels, colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import stationStatus from 'constants/stationStatus'
import './style.css'
import moment from 'moment'

// `

const i18n = {
  stationName: translate('dashboard.tableList.name'),
  time: translate('dashboard.tableList.time'),

}

const WrapperContainer = styled.div`
  .stationName {
    font-size: 16px;
    font-weight: 600;
    padding: 4px !important;
  }
  .stationTime {
    font-size: 16px;
    font-weight: 500;
    padding: 4px !important;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const TextWithToolTip = props => {
  let styleCustom = {}
  if (props.IsEllipsis) {
    styleCustom = {
      display: 'inline-block',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '100px',
      whiteSpace: 'nowrap',
    }
  }
  return (
    <div
      style={{
        // width: props.width ? props.width : null,
        display: 'flex',
        fontWeight: 500,
        color: props.color ? props.color : '',
        ...styleCustom,
      }}
    >
      <Tooltip
        getPopupContainer={() => document.querySelector('.ant-table-wrapper')}
        title={props.text}
      >
        <span
          style={{
            color: props.color ? props.color : '',
            float: props.right ? 'right' : '',
          }}
          className={props.className}
        >
          &nbsp;{props.text}
        </span>
      </Tooltip>
    </div>
  )
}

@autobind
export default class StationAutoList extends React.Component {
  static propTypes = {
    stationAutoList: PropTypes.array, //PropTypes.arrayOf(PropTypes.shape(StationAuto.props)),
    isShowStationName: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.measureData = []
    this.props.stationAutoList.map(item => {
      this.measureData = _.uniqBy(
        [...this.measureData, ...item.measuringList],
        'key'
      )
      // qui: k bi warning
      return null
    })
  }

  render() {
    return (
      <WrapperContainer>
        <TableData
          stationAutoList={this.props.stationAutoList}
          measureData={this.measureData}
          measureShow={this.props.measureShow}
        />
      </WrapperContainer>
    )
  }
}

const DEVICE_STATUS = {
  '0': {
    color: colorLevels.GOOD,
    src: '/images/sensor/good.png',
    text: 'monitoring.deviceStatus.normal',
  },
  '1': {
    color: colorLevels.MAINTAIN,
    src: '/images/sensor/maintain.png',
    text: 'monitoring.deviceStatus.maintenance',
  },
  '2': {
    color: colorLevels.ERROR,
    src: '/images/sensor/error.png',
    text: 'monitoring.deviceStatus.broken',
  },
}

const DeviceIcon = props => {
  const { status } = props
  if (status === 0) return null //normal not show device
  let item = DEVICE_STATUS[`${status}`]
  if (item) {
    return (
      <Tooltip placement="top" title={`Sensor ${translate(item.text)}`}>
        <div
          style={{
            backgroundColor: item.color,
            borderRadius: '50%',
            width: '14px',
            height: '14px',
            marginLeft: '6px',
          }}
          // alt={item.text}
        />
      </Tooltip>
    )
  }

  return null
}

const STATION_ICON = {
  [stationStatus.DATA_LOSS]: '/images/station/data-loss.png',
  [stationStatus.NOT_USE]: '/images/station/not-use.png',
  [stationStatus.GOOD]: '/images/station/good.png',
}

class TableData extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  khoiTaoColumn() {
    let columns = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: 35,
        fixed: 'left',
        render: (text, record, index) => index + 1,
      },
      {
        title: '',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 30,
        fixed: 'left',
        render: val => {
          const icon = STATION_ICON[val]
          return (
            <img
              src={icon}
              style={{
                width: '26px',
                height: '26px',
              }}
              alt={'normal'}
            />
          )
        },
      },
      {
        title: i18n.stationName,
        dataIndex: 'name',
        key: 'name',
        width: 220,
        fixed: 'left',
        className: 'stationName',
      },
      {
        title: i18n.time,
        dataIndex: 'lastLog.receivedAt',
        key: 'time',
        width: 150,
        fixed: 'left',
        className: 'stationTime',
        render: receivedAt => {
          if (!receivedAt) return null
          const strDate = moment(receivedAt).format(DD_MM_YY_HH_MM)
          return strDate
        },
      },
    ]

    /* #region  sort các chỉ tiêu vượt ngưỡng. */
    const dtMeasurePrioritize = []
    this.props.measureData.forEach(item => {
      for (let i = 0; i < this.props.stationAutoList.length; i++) {
        const station = this.props.stationAutoList[i]
        const measure = _.get(station, `lastLog.measuringLogs.${item.key}`)
        if (measure === null || measure === undefined) continue

        if (
          measure.warningLevel &&
          measure.warningLevel === warningLevels.EXCEEDED
        ) {
          dtMeasurePrioritize.push({
            ...item,
            key: item.key,
          })
          break
        }
      }
    })
    const measureData = _.uniqBy(
      [..._.compact(dtMeasurePrioritize), ...this.props.measureData],
      'key'
    )
    /* #endregion */

    let tampColumnMeasure = measureData.map(item => {
      return {
        title: <TextWithToolTip IsEllipsis={true} text={item.name} />,
        dataIndex: `lastLog.measuringLogs.${item.key}`,
        width: 110,
        align: 'center',
        key: item.key,
        render: (measure, record) => {
          if (measure === null || measure === undefined) return ''
          let color = colorLevels.GOOD //SHAPE.BLACK;
          let classCustom = ''
          let classContainer = ''
          if (
            measure.warningLevel &&
            measure.warningLevel !== warningLevels.GOOD
          ) {
            color = colorLevels[measure.warningLevel]
          }
          if (
            measure.warningLevel &&
            measure.warningLevel === warningLevels.EXCEEDED
          ) {
            classContainer = 'wheelExceeded'
            color = 'white'
          }
          if (
            measure.warningLevel &&
            measure.warningLevel === warningLevels.EXCEEDED_PREPARING
          ) {
            classCustom = 'wheelPrepare'
            color = colorLevels[measure.warningLevel]
          }
          // Format number toLocalString(national)
          if (record.status !== stationStatus.GOOD) {
            color = SHAPE.BLACK
            classCustom = ''
            classContainer = ''
          }

          return (
            <Flex>
              <div key="left" style={{ position: 'relative', float: 'left' }}>
                <DeviceIcon status={_.get(measure, 'statusDevice', '')} />
              </div>
              <div
                className={classContainer}
                key="right"
                style={{
                  width: '100%',
                  borderRadius: 3,
                  display: 'flex',
                  padding: '2px',
                }}
              >
                {measure.value || measure.value === 0 ? (
                  <TextWithToolTip
                    IsEllipsis={true}
                    text={measure.value
                      .toFixed(2)
                      .toLocaleString(navigator.language)}
                    // width={width}
                    color={color}
                    className={classCustom}
                    // right
                  />
                ) : (
                  <TextWithToolTip
                    right
                    text={''}
                    // width={width}
                    color={color}
                    className={classCustom}
                  />
                )}
              </div>
            </Flex>
          )
        },
      }
    })

    tampColumnMeasure = tampColumnMeasure.filter(item => {
      return this.props.measureShow && this.props.measureShow.includes(item.key)
    })

    let result = [...columns, ...tampColumnMeasure]
    return result
  }

  render() {
    // console.log("TableData -> render -> column", column)
    // console.log('this.props.stationAutoList',this.props.stationAutoList)

    return (
      <Table
        key="_id"
        style={{ backgroundColor: '#fff' }}
        size="small"
        dataSource={this.props.stationAutoList}
        // bordered
        columns={this.khoiTaoColumn()}
        pagination={false}
        scroll={{
          x:
            this.props.measureData && this.props.measureData.length > 6
              ? 1500
              : false,
        }}
      />
    )
  }
}
