import React, { Component } from 'react'
import { Collapse } from 'antd'
import styled from 'styled-components'
import ToggleSendStationAlarm from '../../components/ToggleSendStationAlarm'
import StationAlarmManagement from './StationAlarmManagement'
import { get } from 'lodash'

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

export default class StationAlarmListGroup extends Component {
  render() {
    const {
      stationTypeName,
      users,
      roles,
      stationAutoList,
      alarmsGroupByStationId,
    } = this.props

    return (
      <div>
        <div
          style={{ background: '#F3F4F6', padding: '16px', minHeight: '50px' }}
        >
          {stationTypeName}
        </div>

        <Collapse>
          {stationAutoList.map(stationAuto => {
            const alarmListByStation = alarmsGroupByStationId[stationAuto._id]

            return (
              <Panel
                header={stationAuto.name}
                extra={<ToggleSendStationAlarm />}
              >
                <StationAlarmManagement
                  users={users}
                  roles={roles}
                  alarmList={alarmListByStation}
                  _id={stationAuto._id}
                />
              </Panel>
            )
          })}
        </Collapse>
      </div>
    )
  }
}
