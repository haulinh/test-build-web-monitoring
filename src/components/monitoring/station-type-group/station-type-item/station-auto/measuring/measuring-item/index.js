import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import { Icon, Tooltip } from 'antd'
import { get } from 'lodash'

const DEVICE_STATUS = {
  '0': {color: '#1dce6c', text: 'monitoring.deviceStatus.normal'},
  '1': {color: 'orange', text: 'monitoring.deviceStatus.maintenance'},
  '2': {color: 'red', text: 'monitoring.deviceStatus.broken'}
}

const MeasuringItemWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 8px 16px;
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
  padding: 0 5px 0 5px;
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
    const { unit, minLimit, maxLimit } = this.props
    let limitText = ''
    if (minLimit || maxLimit) {
      if (minLimit)
        limitText = translate('monitoring.limit') + ': > ' + minLimit
      if (maxLimit) {
        if (limitText) limitText = limitText + ' & < ' + maxLimit
        else limitText = translate('monitoring.limit') + ': < ' + maxLimit
      }
    }
    return limitText ? `${limitText} ${unit}` : <span>&nbsp;</span>
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
        <Tooltip placement='top' title={translate(item.text)}>
          <Icon type='sliders'
          style={{
            position: 'absolute',
            color: item.color,
            bottom: 4,
            right: 16
          }}
          theme='twoTone' />
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
        {
          this.renderDeviceIcon(get(this.props, 'statusDevice', ''))
        }
        
      </MeasuringItemWrapper>
    )
  }
}
