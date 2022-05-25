import React, { Component } from 'react'
import StationAlarmListGroup from './StationAlarmListGroup'

export default class ManagementAlarm extends Component {
  render() {
    return (
      <div
        style={{
          border: '1px solid #F3F4F6',
          borderRadius: '4px',
        }}
      >
        <StationAlarmListGroup stationTypeName="Nước thải công nghiệp" />
        <StationAlarmListGroup stationTypeName="Nước thải ngầm" />
      </div>
    )
  }
}
