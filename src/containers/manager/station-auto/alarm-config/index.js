import { Button, Collapse, message, Skeleton } from 'antd'
import CalculateApi from 'api/CalculateApi'
import QCVNApi from 'api/QCVNApi'
import RoleApi from 'api/RoleApi'
import UserApi from 'api/UserApi'
import { FormItem } from 'components/layouts/styles'
import { ALARM_LIST_INIT } from 'containers/manager/station-auto/alarm-config/constants'
import { translate } from 'hoc/create-lang'
import { flatten, get, isEmpty, omit } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import AlarmConfigDisconnect from './alarm-config-disconnect'
import AlarmConfigExceed from './alarm-config-exceed'
import { i18n } from './constants'
import withAlarmForm, { isDefaultDataLevel } from './hoc/withAlarmForm'

const { Panel } = Collapse

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

const getAlarmGroupByType = alarmList => {
  const initialValues = {
    alarmDisconnect: [],
    alarmStandard: [],
  }

  const alarmGroupByType = alarmList.reduce((base, current) => {
    if (current.type === FIELDS.DISCONNECT) {
      base.alarmDisconnect.push(current)
    } else if (current.type === FIELDS.DATA_LEVEL) {
      base.alarmStandard.push(current)
    }
    return base
  }, initialValues)

  return alarmGroupByType
}

@withRouter
@withAlarmForm
export default class AlarmConfig extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    this.stationId = match.params.key
  }

  state = {
    alarmDisconnect: ALARM_LIST_INIT.DISCONNECT,
    alarmStandard: ALARM_LIST_INIT.DATA_LEVEL,
    alarmList: [],
    qcvnList: [],
    alarmIdsDeleted: [],
    users: [],
    roles: [],
    loading: false,
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    const [alarmList, qcvnList] = await Promise.all([
      this.getAlarmByStationId(),
      this.getQCVNList(),
      this.getUsers(),
      this.getRoles(),
    ])
    this.setState({ loading: false })

    console.log(alarmList)

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

  //#endregion get

  //#region set
  setInitValues = (alarmList, qcvnList) => {
    const { setFormValues } = this.props
    const { alarmDisconnect, alarmStandard } = getAlarmGroupByType(alarmList)

    this.setState({ qcvnList })

    if (!isEmpty(alarmDisconnect)) {
      this.setState({ alarmDisconnect }, () =>
        setFormValues(FIELDS.DISCONNECT, alarmDisconnect)
      )
    } else {
      setFormValues(FIELDS.DISCONNECT, ALARM_LIST_INIT.DISCONNECT)
    }

    //#region set alarm data level
    if (!isEmpty(alarmStandard)) {
      const alarmDataLevelDefault = ALARM_LIST_INIT.DATA_LEVEL.map(
        alarmDataLevelDefaultItem => {
          const existAlarmDataLevelItem = alarmStandard.find(
            alarmStandardItem =>
              alarmStandardItem.config.type ===
              alarmDataLevelDefaultItem.config.type
          )

          if (existAlarmDataLevelItem) {
            return {
              ...omit(alarmDataLevelDefaultItem, 'isCreateLocal'),
              ...existAlarmDataLevelItem,
            }
          }

          return alarmDataLevelDefaultItem
        }
      )

      const alarmStandardWithoutDefault = alarmStandard.filter(
        alarmStandardItem =>
          !isDefaultDataLevel(get(alarmStandardItem, 'config.type'))
      )

      const alarmStandardWithDefault = [
        ...alarmDataLevelDefault,
        ...alarmStandardWithoutDefault,
      ]

      this.setState({ alarmStandard: alarmStandardWithDefault }, () =>
        setFormValues(FIELDS.DATA_LEVEL, alarmStandardWithDefault)
      )
    } else {
      setFormValues(FIELDS.DATA_LEVEL, ALARM_LIST_INIT.DATA_LEVEL)
    }
    //#endregion set alarm data level
  }

  //#endregion set

  handleSubmit = async () => {
    const { alarmIdsDeleted, qcvnList } = this.state
    const { getQueryParam } = this.props

    const paramsArray = [FIELDS.DISCONNECT, FIELDS.DATA_LEVEL].map(
      alarmType => {
        const paramType = getQueryParam(alarmType, this.stationId)
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

  //#region management state Alarm
  handleDelete = (alarmType, id) => {
    const { alarmDisconnect, alarmStandard, alarmIdsDeleted } = this.state
    const { form, setFormValues } = this.props
    const newIdsDeleted = [...alarmIdsDeleted, id]
    this.setState({ alarmIdsDeleted: newIdsDeleted })

    const actionsDelete = {
      [FIELDS.DATA_LEVEL]: () => {
        const newAlarmList = alarmStandard.filter(item => item._id !== id)
        this.setState({ alarmStandard: newAlarmList }, () => {
          setFormValues(
            FIELDS.DATA_LEVEL,
            Object.values(get(form.getFieldsValue(), FIELDS.DATA_LEVEL, {}))
          )
        })
      },

      [FIELDS.DISCONNECT]: () => {
        const newAlarmList = alarmDisconnect.filter(item => item._id !== id)
        this.setState({ alarmDisconnect: newAlarmList }, () => {
          setFormValues(
            FIELDS.DATA_LEVEL,
            Object.values(get(form.getFieldsValue(), 'disconnect', {}))
          )
        })
      },
    }

    actionsDelete[alarmType]()
  }

  handleAdd = alarmType => {
    const { alarmDisconnect, alarmStandard } = this.state
    const { form, setFormValues } = this.props
    const uuid = uuidv4()
    const newData = {
      _id: uuid,
      isCreateLocal: true,
      maxDisconnectionTime: 1800,
    }

    const actionsAdd = {
      [FIELDS.DATA_LEVEL]: () => {
        const newAlarmList = [...alarmStandard, newData]
        this.setState(
          {
            alarmStandard: newAlarmList,
          },
          () => {
            setFormValues(
              FIELDS.DATA_LEVEL,
              Object.values(get(form.getFieldsValue(), FIELDS.DATA_LEVEL, {}))
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
            setFormValues(
              FIELDS.DISCONNECT,
              Object.values(get(form.getFieldsValue(), 'disconnect', {}))
            )
          }
        )
      },
    }

    actionsAdd[alarmType]()
  }
  //#endregion management state Alarm

  render() {
    const { form, standardFormRef, measuringListStation } = this.props
    const {
      alarmDisconnect,
      alarmStandard,
      qcvnList,
      users,
      roles,
      loading,
    } = this.state

    if (loading) return <Skeleton />

    return (
      <React.Fragment>
        <Collapse defaultActiveKey={['disconnect', 'exceed']}>
          <Panel key="disconnect" header={i18n().alarmDisconnect}>
            <AlarmConfigDisconnect
              form={form}
              alarmList={alarmDisconnect}
              onAdd={this.handleAdd}
              onDelete={this.handleDelete}
              users={users}
              roles={roles}
            />
          </Panel>
          <Panel key="exceed" header={i18n().alarmExceed}>
            <AlarmConfigExceed
              measuringListStation={measuringListStation}
              standardFormRef={standardFormRef}
              qcvnList={qcvnList}
              form={form}
              alarmList={alarmStandard}
              onAdd={this.handleAdd}
              onDelete={this.handleDelete}
              users={users}
              roles={roles}
            />
          </Panel>
        </Collapse>
        <FormItem>
          <Button
            style={{ width: '100%', marginTop: '10px' }}
            type="primary"
            onClick={this.handleSubmit}
          >
            {i18n().button.save}
          </Button>
        </FormItem>
      </React.Fragment>
    )
  }
}
