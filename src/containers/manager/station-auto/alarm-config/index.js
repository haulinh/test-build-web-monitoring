import React, { Component } from 'react'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'
import { Button, Collapse, Form, message } from 'antd'
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
import { t } from 'hoc/create-lang'

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
  BY_STANDARD: 'by_standard',

  STATUS: 'status',
  TIME_DISCONNECT: 'maxDisconnectionTime',
  RECIPIENTS: 'recipients',
  STANDARD_ID: 'standardId',
  IS_CREATE_LOCAL: 'isCreateLocal',
  ID: '_id',
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
    alarmList: [],
    qcvnList: [],
    alarmIdsDeleted: [],
  }

  componentDidMount = async () => {
    const [alarmList, qcvnList] = await Promise.all([
      this.getAlarmByStationId(),
      this.getQCVNList(),
    ])

    this.setInitValues(alarmList, qcvnList)
  }

  //#region get
  getAlarmByStationId = () => {
    return CalculateApi.getAlarms({ stationId: this.stationId })
  }

  getQCVNList = async () => {
    const result = await QCVNApi.getQCVN({}, {})
    if (result.success) {
      return result.data
    }
  }

  getQueryParam = (alarmType, stationId) => {
    const { form } = this.props
    const value = form.getFieldsValue()

    const paramsForm = Object.values(value[alarmType] || {})
    const paramHidden = getHiddenParam(alarmType, stationId)
    const params = paramsForm.map(({ isCreateLocal, ...paramItem }) => ({
      ...paramItem,
      _id: !isCreateLocal ? paramItem._id : null,
      status: getStatusAlarm(paramItem.status),
      ...paramHidden,
    }))

    return params
  }
  //#endregion get

  //#region set
  setInitValues = (alarmList, qcvnList) => {
    const { alarmDisconnect, alarmStandard } = getAlarmGroupByType(alarmList)

    this.setState({ qcvnList })

    if (!isEmpty(alarmDisconnect)) {
      this.setState({ alarmDisconnect }, () =>
        this.setFormValues(FIELDS.DISCONNECT, alarmDisconnect)
      )
    } else {
      this.setFormValues(FIELDS.DISCONNECT, ALARM_LIST_INIT.DISCONNECT)
    }

    if (!isEmpty(alarmStandard)) {
      this.setState({ alarmStandard }, () =>
        this.setFormValues(FIELDS.BY_STANDARD, alarmStandard)
      )
    } else {
      this.setFormValues(FIELDS.BY_STANDARD, ALARM_LIST_INIT.BY_STANDARD)
    }
  }

  setFormValues = (alarmType, alarmList) => {
    const { form } = this.props
    const alarmFormValues = keyBy(alarmList, '_id')
    const alarmFormValuesType = { [alarmType]: alarmFormValues }
    form.setFieldsValue(alarmFormValuesType)
  }
  //#endregion set

  handleSubmit = async () => {
    const { alarmIdsDeleted } = this.state
    const { form } = this.props

    const checkValidate = await form.validateFields()

    if (!checkValidate) return

    const paramsArray = [FIELDS.DISCONNECT, FIELDS.BY_STANDARD].map(
      alarmType => {
        const paramType = this.getQueryParam(alarmType, this.stationId)
        return paramType
      }
    )
    const paramsForm = flatten(paramsArray)
    const paramRequest = {
      data: paramsForm,
      deletedIds: alarmIdsDeleted,
    }

    try {
      await CalculateApi.createBulkAlarm(paramRequest)
      message.success(t('global.saveSuccess'))
    } catch (error) {
      console.error(error)
      message.error(t('ticket.message.notificationError'))
    }
  }

  //region management state Alarm
  handleDelete = (alarmType, id) => {
    const { alarmDisconnect, alarmStandard, alarmIdsDeleted } = this.state

    const newIdsDeleted = [...alarmIdsDeleted, id]
    this.setState({ alarmIdsDeleted: newIdsDeleted })

    const actionsDelete = {
      [FIELDS.BY_STANDARD]: () => {
        const newAlarmList = alarmStandard.filter(item => item._id !== id)
        this.setState({ alarmStandard: newAlarmList }, () => {
          this.setFormValues(FIELDS.BY_STANDARD, newAlarmList)
        })
      },
      [FIELDS.DISCONNECT]: () => {
        const newAlarmList = alarmDisconnect.filter(item => item._id !== id)
        this.setState({ alarmDisconnect: newAlarmList }, () => {
          this.setFormValues(FIELDS.DISCONNECT, newAlarmList)
        })
      },
    }

    actionsDelete[alarmType]()
  }

  handleAdd = alarmType => {
    const { alarmDisconnect, alarmStandard } = this.state
    const newData = {
      _id: uuidv4(),
      isCreateLocal: true,
      maxDisconnectionTime: 1800,
    }

    const actionsAdd = {
      [FIELDS.BY_STANDARD]: () => {
        const newAlarmList = [...alarmStandard, newData]
        this.setState(
          {
            alarmStandard: newAlarmList,
          },
          () => this.setFormValues(FIELDS.BY_STANDARD, newAlarmList)
        )
      },
      [FIELDS.DISCONNECT]: () => {
        const newAlarmList = [...alarmDisconnect, newData]
        this.setState(
          {
            alarmDisconnect: [...alarmDisconnect, newData],
          },
          () => this.setFormValues(FIELDS.DISCONNECT, newAlarmList)
        )
      },
    }

    actionsAdd[alarmType]()
  }
  //endregion

  render() {
    const { form } = this.props
    const { alarmDisconnect, alarmStandard, qcvnList } = this.state

    console.log({ valuesForm: form.getFieldsValue() })

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
