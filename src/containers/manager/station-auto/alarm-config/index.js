import { Button, Collapse, Form } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/elements'
import {
  ALARM_LIST_INIT,
  getHiddenParam,
} from 'containers/manager/station-auto/alarm-config/constants'
import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'

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
  RECIPIENTS: 'recipients',
  QCVN_EXCEED: 'qcvnExceed',
  STANDARD_ID: 'standardId',
  ACTIVE_EXCEED: 'activeExceed',
  USERS: 'users',
}

const getStatusAlarm = status => {
  if (status) return 'enable'
  return 'disable'
}

@withRouter
@Form.create()
export default class AlarmConfig extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    this.stationId = match.params.key
  }

  state = {
    alarmList: ALARM_LIST_INIT,
  }

  componentDidMount = () => {
    // this.getAlarmByStationId()
  }

  getAlarmByStationId = async () => {
    try {
      const result = await CalculateApi.getAlarms({ stationId: this.stationId })
      if (!isEmpty(result)) {
        this.setState({ alarmList: result })
      }
    } catch (e) {
      console.log(e)
    }
  }

  getQueryParamDisconnect = stationId => {
    console.log({ stationId })
    const { form } = this.props
    const value = form.getFieldsValue()

    const paramsForm = Object.values(value[FIELDS.DISCONNECT])
    const paramHidden = getHiddenParam(FIELDS.DISCONNECT, stationId)
    const params = paramsForm.map(paramItem => ({
      ...paramItem,
      status: getStatusAlarm(paramItem.status),
      ...paramHidden,
    }))

    return params
  }

  getAlarmGroupByType = type => {
    const { alarmList } = this.state
    const alarmGroupByType = alarmList.reduce(
      (base, current) => {
        if (current.type === FIELDS.DISCONNECT) {
          base.alarmDisconnect.push(current)
        } else {
          base.alarmExceed.push(current)
        }
        return base
      },
      {
        alarmDisconnect: [],
        alarmExceed: [],
      }
    )

    return alarmGroupByType
  }

  handleSubmit = async () => {
    const paramDisconnect = this.getQueryParamDisconnect(this.stationId)
    const result = await CalculateApi.createBulkAlarm(paramDisconnect)
  }

  //region management state Alarm
  handleDelete = id => {
    console.log({ id })
    const { alarmList } = this.state
    const { form } = this.props
    const alarmListDeleted = alarmList.filter(item => item._id !== id)
    const alarmFormValues = alarmListDeleted.reduce(
      (base, currentAlarm) => ({ [currentAlarm._id]: currentAlarm }),
      {}
    )
    this.setState({ alarmList: alarmListDeleted }, () => {
      form.setFieldsValue(alarmFormValues)
    })
  }

  handleAdd = () => {
    const { alarmList } = this.state
    const newData = {
      _id: uuidv4(),
    }

    this.setState({
      alarmList: [...alarmList, newData],
    })
  }

  //endregion

  render() {
    const { form } = this.props
    const { isEdit, alarmList } = this.state

    const { alarmDisconnect, alarmExceed } = this.getAlarmGroupByType()

    return (
      <Collapse style={{ marginTop: '10px' }}>
        <PanelAnt header="Cảnh báo" key="1">
          <AlarmConfigDisconnect
            form={form}
            alarmList={alarmDisconnect}
            onAdd={this.handleAdd}
            onDelete={this.handleDelete}
          />

          <Clearfix height={24} />

          <AlarmConfigExceed
            form={form}
            alarmList={alarmExceed}
            onAdd={this.handleAdd}
            onDelete={this.handleDelete}
          />

          <Button
            style={{ width: '100%', marginTop: '10px' }}
            type="primary"
            onClick={this.handleSubmit}
          >
            Lưu
          </Button>
        </PanelAnt>
      </Collapse>
    )
  }
}
