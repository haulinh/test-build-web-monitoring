import { Collapse } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import { get, groupBy } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ToggleSendStationAlarm from '../../components/ToggleSendStationAlarm'
import StationAlarmManagement from './StationAlarmManagement'

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
@connect(state => ({
  alarmList: get(state, ['alarm', 'alarmList']),
  alarmsGroupByStationId: groupBy(state.alarm.alarmList, 'stationId'),
}))
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
            const alarmListBelongStation =
              alarmsGroupByStationId[stationAuto._id]
            return (
              <Panel
                header={stationAuto.name}
                extra={<ToggleSendStationAlarm />}
              >
                <StationAlarmManagement
                  users={users}
                  stationId={stationAuto._id}
                  roles={roles}
                  alarmList={alarmListBelongStation}
                />
              </Panel>
            )
          })}
        </Collapse>
        <Clearfix height={16} />
      </div>
    )
  }
}
