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
import ResizeTable from './ResizeTable'
import ResizableAntdTable from 'resizable-antd-table'
import ResizeableTable from './ResizeableTable'

const CustomTable = styled(ResizeTable)`
  .ant-table {
    font-size: 18px;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const TextWithToolTip = props => (
  <div
    style={{
      width: props.width && props.width,
      fontWeight: 600,
      color: props.color ? props.color : '',
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
      <TableData
        stationAutoList={this.props.stationAutoList}
        measureData={this.measureData}
        measureShow={this.props.measureShow}
      />
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
          // src={item.src}
          style={{
            // position: 'absolute',
            // left: 2,
            // top: 2,
            backgroundColor: item.color,
            borderRadius: 20,
            width: '14px',
            height: '14px',
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
    this.column = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index + 1,
      },
      {
        title: '',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 20,
        render: (val, record, index) => {
          const icon = STATION_ICON[val]
          return (
            <img
              src={icon}
              style={{
                // position: "absolute",
                // top: '10%',
                // right: 0,
                width: '14px',
                height: '14px',
              }}
              alt={'normal'}
            />
          )
        },
      },
      {
        title: 'Tên trạm',
        dataIndex: 'name',
        key: 'name',
        // width: 220,
        render: text => <TextWithToolTip text={text} />,
      },
      {
        title: 'Thời gian',
        dataIndex: 'lastLog.receivedAt',
        key: 'time',
        render: receivedAt => {
          if (!receivedAt) return null
          const date = moment(receivedAt).format('DD/MM/HH:SS')
          const time = moment(receivedAt).format('HH:SS')
          return (
            <React.Fragment>
              <div>{date}</div>
              {/* <div>{time}</div> */}
            </React.Fragment>
          )
        },
      },
    ]

    // let radio = window.outerWidth / 1200
    // let width = 70

    // if (this.props.measureData && this.props.measureData.length >= 15)
    //   width = 40
    // if (this.props.measureData && this.props.measureData.length >= 25)
    //   width = 30
    // width = width * radio
    let tampColumnMeasure = this.props.measureData.map(item => {
      return {
        title: (
          <TextWithToolTip
            text={item.name}
             width={100}
          />
        ),
        dataIndex: `lastLog.measuringLogs.${item.key}`,
        // className: 'noPadding fontSize10',
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
            <Flex>
              <div key="left" style={{ position: 'relative', float: 'left' }}>
                <DeviceIcon status={_.get(measure, 'statusDevice', '')} />
              </div>
              <div
                className={classContainer}
                key="right"
                style={{
                  // position: 'relative',
                  // float: 'right',
                  width: '100%',
                  borderRadius: 3,
                }}
              >
                {measure.value || measure.value === 0 ? (
                  <TextWithToolTip
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
    let result = [...this.column, ...tampColumnMeasure]
    return result
  }

  render() {
    const column = this.khoiTaoColumn()
    // console.log("TableData -> render -> column", column)
    // console.log('this.props.stationAutoList',this.props.stationAutoList)
    
    return (
      <CustomTable
        style={{ backgroundColor: '#fff' }}
        size="small"
        dataSource={this.props.stationAutoList}
        bordered
        columns={column}
        pagination={false}
      />
      // <ResizeableTable
      //   pagination={false}
      //   bordered
      //   columns={column}
      //   dataSource={this.props.stationAutoList}
      // />
    )
  }
}

const data1 = [
  {
    key: 0,
    date: "2018-02-11",
    amount: 120,
    type: "income",
    note: "transfer"
  },
  {
    key: 1,
    date: "2018-03-11",
    amount: 243,
    type: "income",
    note: "transfer"
  },
  {
    key: 2,
    date: "2018-04-11",
    amount: 98,
    type: "income",
    note: "transfer"
  }
];

const columns1 = [
  {
    title: "Date",
    dataIndex: "date",
    width: 200,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 100,
  
  },
  {
    title: "Type",
    dataIndex: "type",
    width: 100
  },
  {
    title: "Note",
    dataIndex: "note",
    width: 100
  },
  {
    title: "Action",
    key: "action",
  }
];
