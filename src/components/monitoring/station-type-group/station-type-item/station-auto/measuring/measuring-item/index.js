import { Tooltip } from 'antd'
import { getFormatNumber } from 'constants/format-number'
import { STATUS_STATION } from 'constants/stationStatus'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { COLOR_DEVICE_STATUS, DATA_COLOR } from 'themes/color'

const DEVICE_STATUS = {
  '0': { src: '/images/sensor1.png', text: 'monitoring.deviceStatus.normal' },
  '1': {
    src: '/images/sensor2.png',
    text: 'monitoring.deviceStatus.maintenance',
  },
  '2': { src: '/images/sensor3.png', text: 'monitoring.deviceStatus.broken' },
}

const MeasuringItemWrapper = styled.div`
  padding: 8px 8px;
  border-radius: 8px;
  border: solid 1px ${props => props.color};
  &:hover {
    cursor: pointer;
  }
  position: relative;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const MeasuringUnit = styled.span`
  position: absolute;
  top: -5px;
  margin-left: 2px;
  color: ${props => props.color};
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const MeasuringValue = styled.div`
  font-size: 20px;
  line-height: 24px;
  text-align: left;
  font-weight: bold;
  color: ${props => props.color};
  position: relative;
`

const MeasuringLimit = styled.span`
  font-size: 12px;
  line-height: 14px;
  color: #b9b9b9;
`

const LeftContainer = styled.div`
  position: relative;
`
const RightContainer = styled.div`
  position: absolute;
  right: 5px;
`

const Dot = styled.div`
  height: 20px;
  width: 20px;
  background-color: #666666;
  border-radius: 10px;
  display: inline-block;
  margin-right: 8px;
`

const MeasuringName = styled.span`
  color: ${props => props.color};
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  margin-right: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`

const NoDataText = styled.span`
  color: #e0e0e0;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
`

const LimitContainer = styled.div`
  position: relative;
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
    statusStation: PropTypes.string,
  }

  getLimitText() {
    const { unit } = this.props
    let minLimit = get(this.props, 'minLimit', null)
    let maxLimit = get(this.props, 'maxLimit', null)
    if (minLimit === '') minLimit = null
    if (maxLimit === '') maxLimit = null

    if (minLimit !== null && maxLimit !== null) {
      // return ` ${translate(
      //   'monitoring.limit'
      // )}: ${minLimit} -> ${maxLimit} ${unit || ''}`
      return (
        <LimitContainer>
          {`${translate('monitoring.limit')}: ${minLimit} -> ${maxLimit}`}
          <MeasuringUnit>{unit}</MeasuringUnit>
        </LimitContainer>
      )
    }

    if (minLimit !== null) {
      // return ` ${translate('monitoring.limit')}: > ${minLimit}  ${unit || ''}`
      return (
        <LimitContainer>
          {`${translate('monitoring.limit')}: > ${minLimit}`}
          <MeasuringUnit>{unit}</MeasuringUnit>
        </LimitContainer>
      )
    }

    if (maxLimit !== null) {
      // return `${translate('monitoring.limit')}: < ${maxLimit}  ${unit || ''}`
      return (
        <LimitContainer>
          {`${translate('monitoring.limit')}: < ${maxLimit}`}
          <MeasuringUnit>{unit}</MeasuringUnit>
        </LimitContainer>
      )
    }

    // if (minLimit || maxLimit) {
    //   if (minLimit)
    //     limitText = translate('monitoring.limit') + ': > ' + minLimit
    //   if (maxLimit) {
    //     if (limitText) limitText = limitText + ' & < ' + maxLimit
    //     else limitText = translate('monitoring.limit') + ': < ' + maxLimit
    //   }
    // }
    return (
      <LimitContainer>{translate('monitoring.withoutLimit')}</LimitContainer>
    )
    //return limitText ? `${limitText} ${unit}` : ` `
  }

  getColorLevel() {
    if (
      this.props.statusStation &&
      this.props.statusStation === STATUS_STATION.DATA_LOSS
    )
      return DATA_COLOR[STATUS_STATION.DATA_LOSS]

    const { warningLevel } = this.props
    if (warningLevel && DATA_COLOR[warningLevel]) return DATA_COLOR[warningLevel]
    return DATA_COLOR.GOOD
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

  render() {
    const { value, unit, name } = this.props

    let colorDeviceStatus =
      COLOR_DEVICE_STATUS[get(this.props, 'statusDevice', '')]
    if (
      this.props.statusStation &&
      this.props.statusStation === STATUS_STATION.HIGHTGEST
    )
      colorDeviceStatus = DATA_COLOR[STATUS_STATION.HIGHTGEST]

    return (
      <MeasuringItemWrapper
        onClick={this.props.onClick}
        color={this.getColorLevel()}
      >
        <Tooltip title={name}>
          <MeasuringName color={this.getColorLevel()}>{name}</MeasuringName>
        </Tooltip>
        <Flex onClick={this.props.onClick} color={this.getColorLevel()}>
          <LeftContainer>
            <MeasuringValue color={this.getColorLevel()}>
              {value !== undefined ? (
                <React.Fragment>
                  {getFormatNumber(value)}
                  <MeasuringUnit color={this.getColorLevel()} className="unit">
                    {unit ? unit : ''}
                  </MeasuringUnit>
                </React.Fragment>
              ) : (
                <NoDataText>{translate('monitoring.noData')}</NoDataText>
              )}
            </MeasuringValue>
            <div style={{ marginTop: 7 }}>
              <MeasuringLimit>{this.getLimitText()}</MeasuringLimit>
            </div>
          </LeftContainer>
          <RightContainer>
            <Dot
              style={{
                backgroundColor: colorDeviceStatus,
              }}
            />
          </RightContainer>
        </Flex>
      </MeasuringItemWrapper>
    )
  }
}
