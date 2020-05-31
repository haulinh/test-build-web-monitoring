import React from 'react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Tooltip } from 'antd'
import * as _ from 'lodash'
import { SHAPE } from 'themes/color'
import { warningLevels, colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import stationStatus from 'constants/stationStatus'
import './style.css'
import moment from 'moment'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

const TextWithToolTip = props => (
  <div
    style={{
      width: props.width ? props.width : 100,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: props.color ? props.color : '',
      float: 'right',
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
const StationListWrapper = styled.div``

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
      <StationListWrapper>
        <TableData
          stationAutoList={this.props.stationAutoList}
          measureData={this.measureData}
          measureShow={this.props.measureShow}
        />
      </StationListWrapper>
    )
  }
}

const DEVICE_STATUS = {
  '0': {
    src: '/images/sensor/good.png',
    text: 'monitoring.deviceStatus.normal',
  },
  '1': {
    src: '/images/sensor/maintain.png',
    text: 'monitoring.deviceStatus.maintenance',
  },
  '2': {
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
        <img
          src={item.src}
          style={{
            position: 'absolute',
            left: 2,
            top: 2,
            width: '14px',
            height: '14px',
          }}
          alt={item.text}
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
    let radio = window.outerWidth / 1200
    this.column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        className: 'noPadding fontSize10',
        width: 20,
        render: (text, record, index) => index + 1,
      },
      {
        title: '',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        className: 'noPadding fontSize10',
        width: 20,
        render: (val, record, index) => {
          const icon = STATION_ICON[val]
          return (
            <img
              src={icon}
              style={{
                // position: "absolute",
                top: '10%',
                right: 0,
                width: '16px',
                height: '16px',
              }}
              alt={'normal'}
            />
          )
        },
      },
      {
        title: 'Tên trạm',
        dataIndex: 'name',
        className: 'noPadding fontSize10',
        key: 'name',
        width: 150,
        render: text => <TextWithToolTip text={text} width={150} />,
      },
      {
        title: 'Thời gian',
        dataIndex: 'lastLog.receivedAt',
        className: 'noPadding fontSize10',
        key: 'time',
        width: 110,
        render: receivedAt => {
          if (!receivedAt) return null
          const time = moment(receivedAt).format(DD_MM_YYYY_HH_MM)
          return <div style={{ width: 110 }}>{time}</div>
        },
      },
    ]
    let width = 70

    if (this.props.measureData && this.props.measureData.length >= 15)
      width = 40
    if (this.props.measureData && this.props.measureData.length >= 25)
      width = 30
    width = width * radio
    let tampColumnMeasure = this.props.measureData.map(item => {
      return {
        title: <TextWithToolTip text={item.name} width={width} />,
        dataIndex: `lastLog.measuringLogs.${item.key}`,
        className: 'noPadding fontSize10',
        align: 'center',
        // width,
        key: item.key,
        render: (measure, record) => {
          // console.log('measure',measure)
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
            <React.Fragment>
              <div key="left" style={{ position: 'relative', float: 'left' }}>
                <DeviceIcon status={_.get(measure, 'statusDevice', '')} />
              </div>
              <div
                className={classContainer}
                key="right"
                style={{
                  position: 'relative',
                  float: 'right',
                  width: '100%',
                  borderRadius: 3,
                }}
              >
                {measure.value || measure.value === 0 ? (
                  <TextWithToolTip
                    text={measure.value
                      .toFixed(2)
                      .toLocaleString(navigator.language)}
                    width={width}
                    color={color}
                    className={classCustom}
                    right
                  />
                ) : (
                  <TextWithToolTip
                    right
                    text={''}
                    width={width}
                    color={color}
                    className={classCustom}
                  />
                )}
              </div>
            </React.Fragment>
          )
        },
      }
    })

    tampColumnMeasure = tampColumnMeasure.filter(item => {
      return this.props.measureShow && this.props.measureShow.includes(item.key)
    })
    let result = [...this.column, ...tampColumnMeasure]
    return result
  }

  render() {
    const column = this.khoiTaoColumn()
    // console.log('this.props.stationAutoList',this.props.stationAutoList)
    return (
      <Table
        style={{ backgroundColor: '#fff' }}
        size="small"
        dataSource={this.props.stationAutoList}
        bordered
        columns={column}
        pagination={false}
      />
    )
  }
}
