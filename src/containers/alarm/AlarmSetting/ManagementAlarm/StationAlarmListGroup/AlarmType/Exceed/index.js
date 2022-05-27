import { Button, Col, Row, Tabs } from 'antd'
import QCVNApi from 'api/QCVNApi'
import { Clearfix } from 'components/elements'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { ALARM_LIST_INIT } from 'containers/manager/station-auto/alarm-config/constants'
import { get, groupBy, isEmpty, keyBy, omit, uniqBy } from 'lodash'
import { Component, default as React } from 'react'
import { withRouter } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import withAlarmForm, {
  isDefaultDataLevel,
} from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'
import DrawerConfigAlarm from './DrawerConfigAlarm'

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
export default class AlarmExceed extends Component {
  state = {
    alarmStandard: ALARM_LIST_INIT.DATA_LEVEL,
  }

  componentDidMount = async () => {
    const { alarmList } = this.props
    this.setState({ loading: true })
    const qcvnList = await this.getQCVNList()

    this.setInitValues(alarmList, qcvnList)
  }

  setInitValues = (alarmList, qcvnList) => {
    const { setFormValues } = this.props
    const { alarmStandard } = getAlarmGroupByType(alarmList)

    this.setState({ qcvnList })

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

  getQCVNList = async () => {
    const result = await QCVNApi.getQCVN({}, {})
    if (result.success) {
      return result.data
    }
  }

  handleAdd = () => {
    const { alarmStandard } = this.state
    const uuid = uuidv4()
    const newData = {
      _id: uuid,
      isCreateLocal: true,
      maxDisconnectionTime: 1800,
    }

    const newAlarmList = [...alarmStandard, newData]
    this.setState({
      alarmStandard: newAlarmList,
    })
  }

  handleDelete = id => {
    const { alarmStandard } = this.state
    const { form, setFormValues } = this.props

    const newAlarmList = alarmStandard.filter(item => item._id !== id)
    this.setState({ alarmStandard: newAlarmList }, () => {
      setFormValues(
        FIELDS.DATA_LEVEL,
        Object.values(get(form.getFieldsValue(), FIELDS.DATA_LEVEL, {}))
      )
    })
  }

  getQcvnSelected = () => {
    const { form } = this.props
    const { qcvnList } = this.state

    const qcvnListObj = keyBy(qcvnList, '_id')

    const qcvnsFormValues = form.getFieldValue(FIELDS.DATA_LEVEL)

    const qcvnsFormArray = Object.values(qcvnsFormValues || {})
    const qcvnsSelected = qcvnsFormArray.filter(
      qcvn => qcvn[FIELDS.CONFIG][FIELDS.STANDARD_ID]
    )

    const qcvnsSelectedMapValue = qcvnsSelected.map(qcvn => ({
      ...qcvnListObj[qcvn[FIELDS.CONFIG][FIELDS.STANDARD_ID]],
      name: get(qcvn, [FIELDS.CONFIG, FIELDS.NAME]),
    }))
    return qcvnsSelectedMapValue
  }

  getMeasuringList = () => {
    const { measuringListStation } = this.props
    const qcvnsSelected = this.getQcvnSelected()

    const measuringList = getMeasuringListFromStationAutos(qcvnsSelected)

    const uniqueMeasuringList = uniqBy(
      [...measuringList, ...measuringListStation],
      'key'
    )

    return uniqueMeasuringList || []
  }

  getDefaultDataLevelValue = () => {
    const { form } = this.props
    const valuesForm = form.getFieldsValue()
    const dataLevelValueObj = groupBy(
      Object.values(valuesForm[FIELDS.DATA_LEVEL] || {}),
      'config.type'
    )

    const defaultDataLevelValue = {
      [FIELDS.EXCEED]: get(dataLevelValueObj, [FIELDS.EXCEED, 0]),
      [FIELDS.EXCEED_PREPARING]: get(dataLevelValueObj, [
        FIELDS.EXCEED_PREPARING,
        0,
      ]),
    }
    return defaultDataLevelValue
  }

  render() {
    const { alarmStandard, qcvnList } = this.state
    const { form, users, roles, measuringListStation } = this.props

    const qcvnListSelected = this.getQcvnSelected()
    const measuringList = this.getMeasuringList()

    const alarmHaveMeasuringList = alarmStandard.find(
      alarm => !isEmpty(get(alarm, 'config.measuringList'))
    )

    const measureListValue = get(
      alarmHaveMeasuringList,
      'config.measuringList',
      []
    )

    const defaultDataLevelValue = this.getDefaultDataLevelValue()

    return (
      <div>
        <TableAlarmExceedForm
          dataSource={alarmStandard}
          form={form}
          users={users}
          roles={roles}
          onAdd={this.handleAdd}
          onDelete={this.handleDelete}
          qcvnList={qcvnList}
        />
        <Clearfix height={24} />
        <TableQCVN
          measuringListStation={measuringListStation}
          qcvnList={qcvnListSelected}
          dataSource={measuringList}
          measureListValue={measureListValue}
          defaultDataLevelValue={defaultDataLevelValue}
        />
        <Clearfix height={32} />
        <Row type="flex" justify="end">
          <Col span={5}>
            <Button type="primary" block size="large">
              Lưu
            </Button>
          </Col>
        </Row>
        <DrawerConfigAlarm />
      </div>
    )
  }
}
