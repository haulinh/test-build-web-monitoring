import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import { Tooltip } from 'antd'
import { get } from 'lodash'
import { COLOR_DEVICE_STATUS, COLOR_STATUS } from 'themes/color'
import { STATUS_STATION } from 'constants/stationStatus'
import { getFormatNumber } from 'constants/format-number'

const DEVICE_STATUS = {
  '0': { src: '/images/sensor1.png', text: 'monitoring.deviceStatus.normal' },
  '1': {
    src: '/images/sensor2.png',
    text: 'monitoring.deviceStatus.maintenance'
  },
  '2': { src: '/images/sensor3.png', text: 'monitoring.deviceStatus.broken' }
}

const MeasuringItemWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 8px 8px;
  // flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  border: solid 1px ${props => props.color};
  &:hover {
    cursor: pointer;
  }
`
const MeasuringItemText = styled.div`
  display: flex;
  // justify-content: space-between;
`

// const MeasuringName = styled.span`
//   padding: 0px 6px;
//   display: flex;
//   font-size: 10px;
//   color: #ffffff;
//   align-items: center;
//   justify-content: center;
//   border-radius: 3px;
//   background-color: ${props => props.color};
// `

const MeasuringUnit = styled.span`
  position: relative;
  top: -10px;
  font-size: 8px;
  color: ${props => props.color};
`

const MeasuringValue = styled.div`
  font-size: 16px;
  text-align: left;
  // font-weight: 600;
  color: ${props => props.color};
  position: relative;
`

const MeasuringLimit = styled.span`
  font-size: 10px;
  color: #b9b9b9;
`

const LeftContainer = styled.div`
  // display: flex;
  // flex: 1;
`
const RightContainer = styled.div`
  display: flex;
  align-items: center;
`

const Dot = styled.div`
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
`

@autobind
export default class MeasuringItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.number,
    unit: PropTypes.string,
    name: PropTypes.string,
    minLimit: PropTypes.number,
    maxLimit: PropTypes.number,
    warningLevel: PropTypes.string,
    statusStation: PropTypes.string
  }

  getLimitText() {
    const { unit } = this.props
    let minLimit = get(this.props, 'minLimit', null)
    let maxLimit = get(this.props, 'maxLimit', null)
    if (minLimit === '') minLimit = null
    if (maxLimit === '') maxLimit = null

    if (minLimit !== null && maxLimit !== null) {
      return ` ${translate(
        'monitoring.limit'
      )}: ${minLimit} -> ${maxLimit} ${unit || ''}`
    }

    if (minLimit !== null) {
      return ` ${translate('monitoring.limit')}: > ${minLimit}  ${unit || ''}`
    }

    if (maxLimit !== null) {
      return `${translate('monitoring.limit')}: < ${maxLimit}  ${unit || ''}`
    }

    // if (minLimit || maxLimit) {
    //   if (minLimit)
    //     limitText = translate('monitoring.limit') + ': > ' + minLimit
    //   if (maxLimit) {
    //     if (limitText) limitText = limitText + ' & < ' + maxLimit
    //     else limitText = translate('monitoring.limit') + ': < ' + maxLimit
    //   }
    // }
    return `${translate('monitoring.limit')} `
    //return limitText ? `${limitText} ${unit}` : ` `
  }

  getColorLevel() {
    if (
      this.props.statusStation &&
      this.props.statusStation === STATUS_STATION.HIGHTGEST
    )
      return COLOR_STATUS[STATUS_STATION.HIGHTGEST]

    const { warningLevel } = this.props
    if (warningLevel && colorLevels[warningLevel])
      return COLOR_STATUS[warningLevel]
    return COLOR_STATUS.GOOD
  }

  renderDeviceIcon = status => {
    let item = DEVICE_STATUS[`${status}`]
    if (item) {
      return (
        <Tooltip placement="top" title={`Sensor ${translate(item.text)}`}>
          <img
            src={item.src}
            style={{
              position: 'absolute',
              bottom: 4,
              right: 8,
              width: '16px',
              height: '16px'
            }}
            alt={item.text}
          />
        </Tooltip>
      )
    }

    return null
  }

  render() {
    const { value, unit, name } = this.props

    let colorDeviceStatus =
      COLOR_DEVICE_STATUS[get(this.props, 'statusDevice', '')]
    if (
      this.props.statusStation &&
      this.props.statusStation === STATUS_STATION.HIGHTGEST
    )
      colorDeviceStatus = COLOR_STATUS[STATUS_STATION.HIGHTGEST]

    return (
      <MeasuringItemWrapper
        onClick={this.props.onClick}
        color={this.getColorLevel()}
      >
        <LeftContainer>
          <MeasuringItemText
            style={{ color: this.getColorLevel(), marginTop: 4, fontSize: 16 }}
          >
            <span style={{ marginRight: 8, fontWeight: 100 }}>{name}</span>
            <MeasuringValue color={this.getColorLevel()}>
              {value !== undefined ? getFormatNumber(value) : ''}{' '}
              {unit ? (
                <MeasuringUnit color={this.getColorLevel()} className="unit">
                  {unit}
                </MeasuringUnit>
              ) : (
                ''
              )}
            </MeasuringValue>
          </MeasuringItemText>
          <div style={{ marginTop: 4 }}>
            <MeasuringLimit>{this.getLimitText()}</MeasuringLimit>
          </div>
        </LeftContainer>
        <RightContainer>
          <Dot
            style={{
              backgroundColor: colorDeviceStatus
            }}
          />
        </RightContainer>
      </MeasuringItemWrapper>
    )
  }
}

// 0 xanh, 1 vang, 2 do
