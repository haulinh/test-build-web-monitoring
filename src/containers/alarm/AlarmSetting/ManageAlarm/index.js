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
  div.ant-collapse {
    border: unset;
  }
  .ant-collapse-content {
    border-top: unset;
  }
  .ant-collapse > .ant-collapse-item {
    border: unset;
  }
`

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
