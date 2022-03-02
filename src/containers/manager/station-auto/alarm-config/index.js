import React, { Component } from 'react'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'
import { Collapse, Button, Form } from 'antd'
import styled from 'styled-components'
import UserApi from 'api/UserApi'
import { Clearfix } from 'components/elements'
import CalculateApi from 'api/CalculateApi'
import { withRouter } from 'react-router-dom'

const { Panel } = Collapse

const PanelAnt = styled(Panel)`
  .ant-collapse-header {
    display: flex;
    height: 46px;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }
`

export const FIELDS = {
  DISCONNECT: 'disconnect',
  TIME_DISCONNECT: 'maxDisconnectionTime',
  STATUS: 'status',
  EXCEED: 'exceed',
  QCVN_EXCEED: 'qcvnExceed',
  ACTIVE_EXCEED: 'activeExceed',
}
@withRouter
@Form.create()
export default class AlarmConfig extends Component {
  state = {
    userList: [],
    alarmList: [],
  }
  onSubmitForm = () => {
    const { form } = this.props
    const value = form.getFieldsValue()

    console.log('value---->', { value })
    this.getParamsDisconnect()
  }

  getParamsDisconnect = () => {
    const { form } = this.props
    const value = form.getFieldsValue()
    const { disconnect } = value
  }

  getAlarmByStationAuto = async () => {
    const { key } = this.props.match.params

    try {
      const response = await CalculateApi.getAlarms()
      const alarmsByStationAuto = response.filter(
        alarm => alarm.stationId === key
      )
      this.setState({
        alarmList: alarmsByStationAuto,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  componentDidMount = () => {
    const { isEdit } = this.props

    if (isEdit) this.getAlarmByStationAuto()
    this.getUsers()
  }

  getUsers = async () => {
    try {
      const response = await UserApi.searchUser()
      this.setState({
        userList: response.data,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  render() {
    const { form, isEdit } = this.props
    const { userList, alarmList } = this.state

    return (
      <Collapse style={{ marginTop: '10px' }}>
        <PanelAnt header="Cảnh báo" key="1">
          <AlarmConfigDisconnect
            isEdit={isEdit}
            form={form}
            userList={userList}
            alarmList={alarmList}
          />
          <Clearfix height={24} />
          <AlarmConfigExceed form={form} userList={userList} />

          <Button
            style={{ width: '100%', marginTop: '10px' }}
            type="primary"
            onClick={this.onSubmitForm}
          >
            Lưu
          </Button>
        </PanelAnt>
      </Collapse>
    )
  }
}
