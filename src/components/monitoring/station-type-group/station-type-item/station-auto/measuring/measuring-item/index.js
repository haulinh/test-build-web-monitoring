import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import { Tooltip } from 'antd'
import { get } from 'lodash'


const DEVICE_STATUS = {
  '0': { src: "/images/sensor1.png", text: 'monitoring.deviceStatus.normal' },
  '1': { src: "/images/sensor2.png", text: 'monitoring.deviceStatus.maintenance' },
  '2': { src: "/images/sensor3.png", text: 'monitoring.deviceStatus.broken' }
}

const MeasuringItemWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 8px 8px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  border: solid 1px ${props => props.color};
  &:hover {
    cursor: pointer;
  }
`
const MeasuringItemText = styled.div`
  display: flex;
  justify-content: space-between;
`

const MeasuringName = styled.span`
  padding: 0px 6px;
  display: flex;
  font-size: 10px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: ${props => props.color};
`

const MeasuringUnit = styled.span`
  position: relative;
  top: -10px;
  font-size: 8px;
  color: ${props => props.color};
`

const MeasuringValue = styled.div`
  font-size: 16px;
  text-align: left;
  font-weight: 600;
  color: ${props => props.color};
  position: relative;
`

const MeasuringLimit = styled.span`
  font-size: 10px;
  color: #b9b9b9;
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
    warningLevel: PropTypes.string
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
    const { warningLevel } = this.props
    if (warningLevel && colorLevels[warningLevel])
      return colorLevels[warningLevel]
    return colorLevels.GOOD
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
              width:'16px',
              height:'16px'
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
    return (
      <MeasuringItemWrapper
        onClick={this.props.onClick}
        color={this.getColorLevel()}
      >
        <MeasuringItemText>
          <MeasuringValue color={this.getColorLevel()}>
            {value !== undefined
              ? value.toLocaleString(navigator.language)
              : ''}{' '}
            {unit ? (
              <MeasuringUnit color={this.getColorLevel()} className="unit">
                {unit}
              </MeasuringUnit>
            ) : (
              ''
            )}
          </MeasuringValue>
          <MeasuringName color={this.getColorLevel()}>{name}</MeasuringName>
        </MeasuringItemText>
        <MeasuringLimit>{this.getLimitText()}</MeasuringLimit>
        {this.renderDeviceIcon(get(this.props, 'statusDevice', ''))}
      </MeasuringItemWrapper>
    )
  }
}
