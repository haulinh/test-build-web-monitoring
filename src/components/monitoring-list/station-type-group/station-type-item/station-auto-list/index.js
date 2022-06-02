import React from 'react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { Table, Tooltip, Skeleton } from 'antd'
import * as _ from 'lodash'
import { SHAPE } from 'themes/color'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date.js'
import { warningLevels, colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import stationStatus, { getConfigColor } from 'constants/stationStatus'
import './style.css'
import moment from 'moment'
import LanguageContent, {
  withLanguageContent,
} from 'components/language/language-content'
import { connectAutoDispatch } from 'redux/connect'

function i18n() {
  return {
    stationName: translate('dashboard.tableList.name'),
    time: translate('dashboard.tableList.time'),
    deviceStatus: {
      good: translate('dashboard.good'),
      dataLoss: translate('dashboard.dataLoss'),
      notUse: translate('dashboard.notUse'),
    },
  }
}

const WrapperContainer = styled.div`
  .stationName {
    font-size: 16px;
    font-weight: 600;
    // padding: 4px 4px 4px 4px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 200px;
    white-space: nowrap;
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
const WrapperAnimation = styled.div`
  animation: ${props => props.animation} 1s infinite;
`

const TextWithToolTip = ({ fontWeight = 500, ...props }) => {
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
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.measureData = []
  }

  componentDidUpdate(prevProps) {
    const { stationAutoList } = this.props
    if (
      !this.props.isLoading &&
      JSON.stringify(stationAutoList) !==
        JSON.stringify(prevProps.stationAutoList)
    ) {
      this.props.stationAutoList.map(item => {
        this.measureData = _.uniqBy(
          [...this.measureData, ...item.measuringList],
          'key'
        )
        // qui: k bi warning
        return null
      })
    }
  }
  getMeasureData() {
    let data = []
    this.props.stationAutoList.forEach(item => {
      data = _.uniqBy([...data, ...item.measuringList], 'key')
    })
    return data
  }

  render() {
    return (
      <WrapperContainer>
        {this.props.isLoading && <Skeleton active />}
        {!this.props.isLoading && (
          <TableData
            stationAutoList={this.props.stationAutoList}
            measureData={this.getMeasureData()}
            measureShow={this.props.measureShow}
          />
        )}
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
      <Tooltip
        getPopupContainer={() => document.querySelector('.ant-table-wrapper')}
        title={`Sensor ${translate(item.text)}`}
      >
        <div
          style={{
            backgroundColor: item.color,
            borderRadius: '50%',
            width: '14px',
            height: '14px',
            marginLeft: '6px',
          }}
        />
      </Tooltip>
    )
  }

  return null
}

const STATION_ICON = {
  [stationStatus.DATA_LOSS]: {
    image: '/images/station/data-loss.png',
    status: i18n().deviceStatus.dataLoss,
  },
  [stationStatus.NOT_USE]: {
    image: '/images/station/not-use.png',
    status: i18n().deviceStatus.notUse,
  },
  [stationStatus.GOOD]: {
    image: '/images/station/good.png',
    status: i18n().deviceStatus.good,
  },
  [stationStatus.DATA_CONNECTED]: {
    image: '/images/station/good.png',
    status: i18n().deviceStatus.good,
  },
}

const noStationStatus = {
  image: '/images/warning/disconnection.jpg',
}

@withLanguageContent
@connectAutoDispatch(state => ({
  colorData: _.get(state, 'config.color.warningLevel.data.value', []),
}))
class TableData extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    stationAutoList: PropTypes.array,
  }

  khoiTaoColumn() {
    const { translateContent } = this.props
    let columns = [
      {
        title: '#',
        dataIndex: 'index',
        key: 'index',
        width: 38,
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
            <Tooltip
              getPopupContainer={() =>
                document.querySelector('.ant-table-wrapper')
              }
              placement="right"
              title={icon && icon.status}
            >
              <img
                src={icon ? icon.image : noStationStatus.image}
                style={{
                  width: '26px',
                  height: '26px',
                }}
                alt={'normal'}
              />
            </Tooltip>
          )
        },
      },
      {
        title: i18n().stationName,
        key: 'name',
        width: 220,
        fixed: 'left',
        render: row => {
          return (
            <div className="stationName">
              <LanguageContent
                type="Station"
                itemId={row._id}
                field="name"
                value={row.name}
              />
            </div>
          )
        },
      },
      {
        title: i18n().time,
        dataIndex: 'lastLog.receivedAt',
        key: 'time',
        width: 160,
        fixed: 'left',
        className: 'stationTime',
        render: receivedAt => {
          if (!receivedAt) return null
          const strDate = moment(receivedAt).format(DD_MM_YYYY_HH_MM)
          return <div>{strDate}</div>
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
    const { colorData } = this.props

    let tampColumnMeasure = measureData.map(item => {
      const measureName = translateContent({
        type: 'Measure',
        itemKey: item.key,
        value: item.name,
      })
      return {
        title: <TextWithToolTip IsEllipsis={true} text={measureName} />,
        dataIndex: `lastLog.measuringLogs.${item.key}`,
        width: 110,
        align: 'left',
        key: item.key,
        render: (measure, record) => {
          if (measure === null || measure === undefined) return ''
          let color = SHAPE.BLACK
          let classCustom = ''
          // let classContainer = ''
          let configColor = {}
          let animation = null
          // if (
          //   measure.warningLevel &&
          //   measure.warningLevel !== warningLevels.GOOD
          // ) {
          //   // color = configColor.secondColor // colorLevels[measure.warningLevel]
          // }
          if (
            measure.warningLevel &&
            measure.warningLevel === warningLevels.EXCEEDED
          ) {
            // classContainer = 'wheelExceeded'
            configColor = getConfigColor(colorData, measure.warningLevel, {
              defaultPrimary: null,
              defaultSecond: '#ffffff',
            })
            animation = keyframes`
              0%   { background-color: #FFFF; }
              25%  { background-color: ${configColor.primaryColor}; }
              50%   { background-color: #FFFF; }
              75%  { background-color: ${configColor.primaryColor}; }
              100% { background-color: #FFFF;}
            `
            color = configColor.secondColor
          }
          if (
            measure.warningLevel &&
            measure.warningLevel === warningLevels.EXCEEDED_PREPARING
          ) {
            configColor = getConfigColor(colorData, measure.warningLevel, {
              defaultPrimary: null,
              defaultSecond: '#ffffff',
            })
            // classCustom = 'wheelPrepare'
            color = configColor.primaryColor
          }
          // Format number toLocalString(national)
          if (record && record.status !== stationStatus.DATA_CONNECTED) {
            color = SHAPE.BLACK
            classCustom = ''
            animation = null
            // classContainer = ''
          }
          return (
            <Flex>
              <div key="left" style={{ position: 'relative', float: 'left' }}>
                <DeviceIcon status={_.get(measure, 'statusDevice', '')} />
              </div>
              <WrapperAnimation
                // className={classContainer}
                key="right"
                animation={animation}
                style={{
                  width: '100%',
                  borderRadius: 3,
                  display: 'flex',
                  padding: '2px',
                }}
              >
                {measure.value || measure.value === 0 ? (
                  <TextWithToolTip
                    fontWeight={700}
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
                    fontWeight={700}
                    right
                    text={''}
                    // width={width}
                    color={color}
                    className={classCustom}
                  />
                )}
              </WrapperAnimation>
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
              ? 1400
              : false,
        }}
      />
    )
  }
}
