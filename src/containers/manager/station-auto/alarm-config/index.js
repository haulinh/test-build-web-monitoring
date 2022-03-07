import { Button, Collapse, Form, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import QCVNApi from 'api/QCVNApi'
import RoleApi from 'api/RoleApi'
import UserApi from 'api/UserApi'
import { Clearfix } from 'components/elements'
import { HeaderSearch, Title } from 'components/layouts/styles'
import {
  ALARM_LIST_INIT,
  getHiddenParam,
} from 'containers/manager/station-auto/alarm-config/constants'
import { translate } from 'hoc/create-lang'
import { flatten, get, isEmpty, isNil, keyBy } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'
import { i18n } from './constants'

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
    } else if (current.type === FIELDS.BY_STANDARD) {
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
    users: [],
    roles: [],
  }

  componentDidMount = async () => {
    const [alarmList, qcvnList] = await Promise.all([
      this.getAlarmByStationId(),
      this.getQCVNList(),
      this.getUsers(),
      this.getRoles(),
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

  getUsers = async () => {
    const result = await UserApi.searchUser()
    const users = get(result, 'data', []).filter(
      item => !get(item, 'removeStatus.allowed')
    )
    if (result.success) {
      this.setState({ users })
    }
  }

  getRoles = async () => {
    const result = await RoleApi.getRoles()
    if (result.success) {
      this.setState({ roles: result.data })
    }
  }

  getQueryParam = (alarmType, stationId) => {
    const { form } = this.props
    const value = form.getFieldsValue()

    const paramsForm = Object.values(value[alarmType] || {})
    const params = paramsForm
      .map(({ isCreateLocal, ...paramItem }) => ({
        ...paramItem,
        recipients: get(paramItem, 'recipients', []).flat(),
        _id: !isCreateLocal ? paramItem._id : null,
        status: getStatusAlarm(paramItem.status),
        ...getHiddenParam(alarmType, stationId, paramItem.maxDisconnectionTime),
      }))
      .filter(paramItem => {
        if (alarmType === 'by_standard') {
          return !isNil(paramItem.standardId)
        }
        return !isEmpty(paramItem.recipients)
      })
      .filter(paramItem => {
        if (alarmType === 'by_standard') {
          return !isEmpty(paramItem.recipients)
        }
        return true
      })
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
    const { alarmIdsDeleted, qcvnList } = this.state

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
      const alarmList = await this.getAlarmByStationId()
      this.setInitValues(alarmList, qcvnList)
      message.success(translate('global.saveSuccess'))
    } catch (error) {
      console.error(error)
      message.error(translate('ticket.message.notificationError'))
    }
  }

  //region management state Alarm
  handleDelete = (alarmType, id) => {
    const { alarmDisconnect, alarmStandard, alarmIdsDeleted } = this.state
    const { form } = this.props
    const newIdsDeleted = [...alarmIdsDeleted, id]
    this.setState({ alarmIdsDeleted: newIdsDeleted })

    const actionsDelete = {
      [FIELDS.BY_STANDARD]: () => {
        const newAlarmList = alarmStandard.filter(item => item._id !== id)
        this.setState({ alarmStandard: newAlarmList }, () => {
          this.setFormValues(
            FIELDS.BY_STANDARD,
            Object.values(form.getFieldsValue().by_standard)
          )
        })
      },
      [FIELDS.DISCONNECT]: () => {
        const newAlarmList = alarmDisconnect.filter(item => item._id !== id)
        this.setState({ alarmDisconnect: newAlarmList }, () => {
          this.setFormValues(
            FIELDS.BY_STANDARD,
            Object.values(form.getFieldsValue().disconnect)
          )
        })
      },
    }

    actionsDelete[alarmType]()
  }

  handleAdd = alarmType => {
    const { alarmDisconnect, alarmStandard } = this.state
    const { form } = this.props
    const uuid = uuidv4()
    const newData = {
      _id: uuid,
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
          () => {
            this.setFormValues(
              FIELDS.BY_STANDARD,
              Object.values(form.getFieldsValue().by_standard)
            )
          }
        )
      },
      [FIELDS.DISCONNECT]: () => {
        const newAlarmList = [...alarmDisconnect, newData]
        this.setState(
          {
            alarmDisconnect: newAlarmList,
          },
          () => {
            this.setFormValues(
              FIELDS.DISCONNECT,
              Object.values(form.getFieldsValue().disconnect)
            )
          }
        )
      },
    }

    actionsAdd[alarmType]()
  }
  //endregion

  render() {
    const { form } = this.props
    const {
      alarmDisconnect,
      alarmStandard,
      qcvnList,
      users,
      roles,
    } = this.state

    return (
      <React.Fragment>
        <HeaderSearch>
          <Title>
            {translate('stationAutoManager.configAlarm.tabConfigAlarm')}
          </Title>
          <Button size="small" type="primary" onClick={this.handleSubmit}>
            {i18n().button.save}
          </Button>
        </HeaderSearch>
        <Collapse defaultActiveKey={'1'}>
          <PanelAnt header={translate('menuApp.alarm')} key="1">
            <AlarmConfigDisconnect
              form={form}
              alarmList={alarmDisconnect}
              onAdd={this.handleAdd}
              onDelete={this.handleDelete}
              users={users}
              roles={roles}
            />

            <Clearfix height={24} />

            <AlarmConfigExceed
              qcvnList={qcvnList}
              form={form}
              alarmList={alarmStandard}
              onAdd={this.handleAdd}
              onDelete={this.handleDelete}
              users={users}
              roles={roles}
            />
          </PanelAnt>
        </Collapse>
      </React.Fragment>
    )
  }
}
