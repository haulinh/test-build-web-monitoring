import { Collapse } from 'antd'
import Text from 'components/elements/text'
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

const StationTypeInfo = styled.div`
  background: #f3f4f6;
  padding: 16px;
  min-height: 50px;
  border: 1px solid #d9d9d9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: unset;
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
        <StationTypeInfo>
          <Text fontSize={16} fontWeight={600}>
            {stationTypeName}
          </Text>
        </StationTypeInfo>

        <Collapse>
          {stationAutoList.map(stationAuto => {
            const alarmListByStation = alarmsGroupByStationId[stationAuto._id]

            return (
              <Panel
                header={stationAuto.name}
                extra={
                  <ToggleSendStationAlarm
                    stationAutoId={stationAuto._id}
                    alarmConfig={get(stationAuto, 'alarmConfig', {})}
                  />
                }
                key={stationAuto._id}
              >
                <StationAlarmManagement
                  users={users}
                  stationId={stationAuto._id}
                  stationName={stationAuto.name}
                  stationAlarmConfig={get(stationAuto, 'alarmConfig', {})}
                  roles={roles}
                  alarmList={alarmListByStation}
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
