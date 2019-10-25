import React from "react"
import styled from "styled-components"
import * as _ from "lodash"
import moment from "moment"
// import levels from "constants/aqi-level"
import ChartMeasure from "./chart-measure"
import { DD_MM_YYYY } from "constants/format-date"

const WrapperView = styled.div`
  height: 180px;
  flex-direction: row;
  display: flex;
  border-radius: 4px;
  border: 1px solid #ddd;
`

const AqiView = styled.div`
  background: ${props => props.color || "green"};
  height: 180px;
  width: 120px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`

const VnAqiView = ({ aqiLevel, value, color, time }) => {
  const level = _.find(aqiLevel, ({ min, max }) => _.inRange(value, min, max))
  color = _.get(level, "color", null)
  const colorFont = _.get(level, "name", '').toUpperCase() === "TRUNG BÌNH" ? "#020202" : "#fff"

  return (
    <AqiView color={color}>
      <span
        style={{
          fontSize: 18,
          paddingTop: 8,
          color: colorFont,
          fontWeight: "600"
        }}
      >
        VN AQI Ngày
      </span>
      <span
        style={{
          fontSize: 60,
          color: colorFont,
          fontWeight: "600",
          textShadow: "2px 1px #ddd"
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          color: colorFont,
          fontWeight: "400",
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
    let time = _.get(this.props.station, "time", null)
    if (time) {
      time = moment(time).format(DD_MM_YYYY)
    }

    return (
      <WrapperView>
        <VnAqiView
          aqiLevel={this.props.aqiLevel}
          value={_.get(this.props.station, "aqiDay", "")}
          time={time}
        />
        <ChartMeasure
          aqiLevel={this.props.aqiLevel}
          measure={_.get(this.props.station, "aqiDayOf", {})}
        />
      </WrapperView>
    )
  }
}
