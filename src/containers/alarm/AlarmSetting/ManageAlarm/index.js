import { Collapse } from 'antd'
import { Clearfix } from 'components/elements'
import React, { Component } from 'react'
import StationTypeInfo from '../components/StationTypeInfo'
import ToggleAlarm from '../components/ToggleAlarm'
import StationAlarm from './StationAlarm'
import styled from 'styled-components'

const { Panel: PanelAnt } = Collapse

const Panel = styled(PanelAnt)`
  .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const FIELDS = {
  DISCONNECT: 'disconnect',
  BY_STANDARD: 'by_standard',
  DATA_LEVEL: 'data_level',

  EXCEED_PREPARING: 'exceed_preparing',
  EXCEED: 'exceed',

  STATUS: 'status',
  TIME_DISCONNECT: 'maxDisconnectionTime',
  RECIPIENTS: 'recipients',
  STANDARD_ID: 'standardId',
  IS_CREATE_LOCAL: 'isCreateLocal',
  ID: '_id',

  //#region config
  TYPE: 'type',
  CONFIG: 'config',
  NAME: 'name',
  MEASURING_LIST: 'measuringList',
  //#endregion config
}

export default class ManageAlarm extends Component {
  render() {
    return (
      <div
        style={{
          border: '1px solid #F3F4F6',
          borderRadius: '4px',
        }}
      >
        <StationTypeInfo stationTypeName="Nước thải ngầm" />
        <Collapse>
          <Panel header="Trạm quốc gia, Quảng Ninh" extra={<ToggleAlarm />}>
            <StationAlarm />
          </Panel>
          <Panel header="Trạm quốc gia, Quảng Ninh" extra={<ToggleAlarm />}>
            <StationAlarm />
          </Panel>
        </Collapse>

        <StationTypeInfo stationTypeName=" Nước thải công nghiệp" />
        <Collapse>
          <Panel header="Trạm quốc gia, Quảng Ninh" extra={<ToggleAlarm />}>
            <StationAlarm />
          </Panel>
        </Collapse>
      </div>
    )
  }
}
