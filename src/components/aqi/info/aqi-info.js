import React from 'react'
import styled from 'styled-components'
import * as _ from 'lodash'
import moment from 'moment'
import levels from 'constants/aqi-level'
import ChartMeasure from './chart-measure'

const WrapperView = styled.div`
  height: 180px;
  flex-direction: row;
  display: flex;
  border-radius: 4px;
  border: 1px solid #ddd;
`

const AqiView = styled.div`
  background: ${props => props.color || 'green'};
  height: 180px;
  width: 120px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`

const VnAqiView = ({ value, color, time }) => {
  const level = _.find(levels, ({ min, max }) => _.inRange(value, min, max))
  color = _.get(level, 'color', null)
  return (
    <AqiView color={color}>
      <span
        style={{
          fontSize: 18,
          paddingTop: 8,
          color: '#fff',
          fontWeight: '600'
        }}
      >
        VN AQI Giờ
      </span>
      <span
        style={{
          fontSize: 60,
          color: '#fff',
          fontWeight: '600',
          textShadow: '2px 1px #ddd'
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          color: '#fff',
          fontWeight: '400',
          paddingBottom: 8
        }}
      >
        {time}
      </span>
    </AqiView>
  )
}

export default class AQI_Info extends React.Component {
  render() {
    let time = _.get(this.props.station, 'aqi.time', null)
    if (time) {
      time = moment(time).format('HH:00 DD/MM/YYYY')
    }

    return (
      <WrapperView>
        <VnAqiView
          value={_.get(this.props.station, 'aqi.value', '')}
          time={time}
        />
        <ChartMeasure measure={_.get(this.props.station, 'aqi.measure', {})} />
      </WrapperView>
    )
  }
}
