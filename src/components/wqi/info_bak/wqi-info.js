import React from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import levels from 'constants/wqi-level'
import ChartMeasure from './chart-measure'

const WrapperView = styled.div`
  height: 180px;
  flex-direction: row;
  display: flex;
  border-radius: 4px;
  border: 1px solid #ddd;
`

const WqiView = styled.div`
  background: ${props => props.color || 'green'};
  height: 180px;
  width: 120px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`

const VnWqiView = ({ value, color, time }) => {
  const level = _.find(levels, ({ min, max }) => _.inRange(value, min, max))
  color = _.get(level, 'color', null)
  return (
    <WqiView color={color}>
      <span
        style={{
          fontSize: 18,
          paddingTop: 8,
          color: '#fff',
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        VN WQI
      </span>
      <span
        style={{
          fontSize: 60,
          color: '#fff',
          fontWeight: '600',
          textShadow: '2px 1px #ddd',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          color: '#fff',
          fontWeight: '400',
          paddingBottom: 8,
        }}
      >
        {time}
      </span>
    </WqiView>
  )
}

export default class WQI_Info extends React.Component {
  render() {
    let time = _.get(this.props.station, 'wqi.receivedAt', null)
    if (time) {
      time = moment(time).format('HH:00 DD/MM/YYYY')
    }

    return (
      <WrapperView>
        <VnWqiView
          value={_.get(this.props.station, 'wqi.value', '')}
          time={time}
        />
        <ChartMeasure
          measure={_.get(this.props.station, 'wqi.measuringLogs', {})}
        />
      </WrapperView>
    )
  }
}
