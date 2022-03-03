import React, { Component } from 'react'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'
import { Button, Collapse, Form } from 'antd'
import styled from 'styled-components'
import { Clearfix } from 'components/elements'
import { withRouter } from 'react-router-dom'
import {
  ALARM_LIST_INIT,
  getHiddenParam,
} from 'containers/manager/station-auto/alarm-config/constants'
import CalculateApi from 'api/CalculateApi'
import { flatten, isEmpty, keyBy } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import QCVNApi from 'api/QCVNApi'

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
  BY_STANDARD: 'by_standard',
  STATUS: 'status',
  RECIPIENTS: 'recipients',
  QCVN_EXCEED: 'qcvnExceed',
  STANDARD_ID: 'standardId',
  ACTIVE_EXCEED: 'activeExceed',
}

const getStatusAlarm = status => {
  if (status) return 'enable'
  return 'disable'
}

const getAlarmGroupByType = alarmList => {
  const initialValues = {
    alarmDisconnect: [],
    alarmStandard: [],
  }

  const alarmGroupByType = alarmList.reduce((base, current) => {
    if (current.type === FIELDS.DISCONNECT) {
      base.alarmDisconnect.push(current)
    } else {
      base.alarmStandard.push(current)
    }
    return base
  }, initialValues)

  return alarmGroupByType
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
    alarmDisconnect: ALARM_LIST_INIT.DISCONNECT,
    alarmStandard: ALARM_LIST_INIT.BY_STANDARD,
    qcvnList: [],
  }

  componentDidMount = async () => {
    const [alarmList, qcvnList] = await Promise.all([
      this.getAlarmByStationId(),
      this.getQCVNList(),
    ])

    const { alarmDisconnect, alarmStandard } = getAlarmGroupByType(alarmList)

    if (!isEmpty(alarmDisconnect)) {
      this.setState({ alarmDisconnect }, () =>
        this.setFormValues(FIELDS.DISCONNECT, alarmDisconnect)
      )
    }

    if (!isEmpty(alarmStandard)) {
      this.setState({ alarmStandard }, () =>
        this.setFormValues(FIELDS.BY_STANDARD, alarmStandard)
      )
    }
  }

  getAlarmByStationId = () => {
    return CalculateApi.getAlarms({ stationId: this.stationId })
  }

  getQCVNList = async () => {
    const { alarmStandard } = this.state
    const result = await QCVNApi.getQCVN({}, {})
    if (result.success) {
      this.setState({ qcvnList: result.data }, () => {
        this.setFormValues(FIELDS.BY_STANDARD, alarmStandard)
      })
    }
  }

  getQueryParam = (alarmType, stationId) => {
    const { form } = this.props
    const value = form.getFieldsValue()

    const paramsForm = Object.values(value[alarmType])
    const paramHidden = getHiddenParam(alarmType, stationId)
    const params = paramsForm.map(paramItem => ({
      ...paramItem,
      status: getStatusAlarm(paramItem.status),
      ...paramHidden,
    }))

    return params
  }

  setFormValues = (alarmType, alarmList) => {
    const { form } = this.props
    const alarmFormValues = keyBy(alarmList, '_id')
    const alarmFormValuesType = { [alarmType]: alarmFormValues }
    console.log({ alarmFormValuesType })
    form.setFieldsValue(alarmFormValuesType)
  }

  handleSubmit = async () => {
    const queryParamsArray = [FIELDS.DISCONNECT, FIELDS.BY_STANDARD].map(
      alarmType => {
        const paramType = this.getQueryParam(alarmType, this.stationId)
        return paramType
      }
    )

    const queryParams = flatten(queryParamsArray)
    const result = await CalculateApi.createBulkAlarm(queryParams)
  }

  //region management state Alarm
  handleDelete = id => {
    const { alarmList } = this.state
    const alarmListDeleted = alarmList.filter(item => item._id !== id)

    this.setState({ alarmList: alarmListDeleted }, () => {
      this.setFormValues(alarmListDeleted)
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
    const { alarmDisconnect, alarmStandard, qcvnList } = this.state

    console.log({ values: form.getFieldsValue() })

    // console.log({ alarmDisconnect, alarmStandard }, 'render')

    return (
      <Collapse style={{ marginTop: '10px' }} activeKey="1">
        <PanelAnt header="Cảnh báo" key="1">
          <AlarmConfigDisconnect
            form={form}
            alarmList={alarmDisconnect}
            onAdd={this.handleAdd}
            onDelete={this.handleDelete}
          />

          <Clearfix height={24} />

          <AlarmConfigExceed
            qcvnList={qcvnList}
            form={form}
            alarmList={alarmStandard}
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
