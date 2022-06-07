import { Button, Col, Row, Skeleton } from 'antd'
import QCVNApi from 'api/QCVNApi'
import { Clearfix } from 'components/elements'
import { i18n } from 'containers/alarm/AlarmSetting/constants'
import withAlarmForm, {
  isDefaultDataLevel,
  setFormValues,
} from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { ALARM_LIST_INIT } from 'containers/manager/station-auto/alarm-config/constants'
import { get, groupBy, isEmpty, isEqual, isNil, keyBy, omit } from 'lodash'
import { Component, default as React } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createAlarm, deleteAlarm, createListAlarm } from 'redux/actions/alarm'
import { v4 as uuidv4 } from 'uuid'
import FormAlarmDetail from '../../FormAlarmDetail'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'

const sortDataSource = (alarmList = []) => {
  const alarmSeparate = alarmList.reduce(
    (base, currentAlarm) => {
      const existAlarmDefault = ALARM_LIST_INIT.DATA_LEVEL.find(
        alarmDefault =>
          alarmDefault.config.type === get(currentAlarm, 'config.type')
      )

      if (existAlarmDefault) {
        base.alarmDefault.push(currentAlarm)
        return base
      }

      base.alarmWithoutDefault.push(currentAlarm)
      return base
    },
    {
      alarmDefault: [],
      alarmWithoutDefault: [],
    } // initialValue
  )

  const alarmDefaultSorted = ALARM_LIST_INIT.DATA_LEVEL.map(
    alarmDataLevelDefaultItem => {
      const existAlarmDataLevelItem = alarmSeparate.alarmDefault.find(
        alarmStandardItem =>
          get(alarmStandardItem, 'config.type') ===
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

  return [...alarmDefaultSorted, ...alarmSeparate.alarmWithoutDefault]
}

@withRouter
@withAlarmForm
@connect(null, { createAlarm, deleteAlarm, createListAlarm })
export default class AlarmExceed extends Component {
  state = {
    qcvnList: [],
    loadingStandard: false,
  }

  getQCVNList = async () => {
    const result = await QCVNApi.getQCVN({}, {})
    if (result.success) {
      return result.data
    }
  }

  componentDidMount = async () => {
    this.setState({ loadingStandard: true })
    const qcvnList = await this.getQCVNList()
    this.setState({ qcvnList, loadingStandard: false })

    this.handleCreateAlarmInit()
  }

  handleCreateAlarmInit = async () => {
    const { dataSource, stationId, createListAlarm, form } = this.props

    if (!dataSource) {
      await createListAlarm(ALARM_LIST_INIT.DATA_LEVEL, stationId)
      setFormValues(form, ALARM_LIST_INIT.DATA_LEVEL)
      return
    }

    const alarmDefaultInit = ALARM_LIST_INIT.DATA_LEVEL.reduce(
      (base, currentAlarm) => {
        const existAlarmDefault = dataSource.find(
          alarmItem =>
            get(alarmItem, 'config.type') === currentAlarm.config.type
        )

        if (!existAlarmDefault) {
          base.push(currentAlarm)
        }

        return base
      },
      []
    )

    await createListAlarm(alarmDefaultInit, stationId)
    setFormValues(form, alarmDefaultInit)
  }

  handleSubmit = async () => {
    const { getQueryParamGeneral, handleSubmitAlarm, stationId } = this.props

    const paramGeneral = getQueryParamGeneral()
    const measuringListEnable = this.getMeasureListEnable()

    const params = paramGeneral
      .filter(paramItem => paramItem.config)
      .filter(paramItem => {
        if (get(paramItem, 'config.name') === '') return false

        const configAlarmType = get(paramItem, 'config.type')
        if (isDefaultDataLevel(configAlarmType)) return true

        if (isNil(get(paramItem, 'config.standardId'))) return false

        return true
      })
      .map(paramItem => ({
        ...paramItem,
        config: {
          ...paramItem.config,
          type: paramItem.config.type || 'standard',
          [FIELDS.MEASURING_LIST]: measuringListEnable,
        },
        stationId: stationId,
        type: FIELDS.DATA_LEVEL,
      }))

    await handleSubmitAlarm(params)
    await this.handleCreateAlarmInit()
  }

  handleAdd = () => {
    const { stationId, createAlarm, form } = this.props

    const uuid = uuidv4()
    const newData = {
      _id: uuid,
      isCreateLocal: true,
      type: FIELDS.DATA_LEVEL,
      stationId,
      config: {
        type: 'standard',
      },
    }

    form.setFieldsValue({ [newData._id]: newData })
    createAlarm(newData)
  }

  handleDelete = id => {
    const { deleteAlarm, setIdsDeleted } = this.props

    deleteAlarm(id)
    setIdsDeleted(id)
  }

  getMeasureListEnable = () => {
    const { form } = this.props

    const { measuringListEnable } = form.getFieldsValue()

    const measureListEnable = Object.entries(measuringListEnable)
      .filter(([, value]) => Boolean(value))
      .map(([keyMeasure]) => keyMeasure)

    return measureListEnable
  }

  getQcvnSelected = () => {
    const { form } = this.props
    const { qcvnList } = this.state

    const qcvnListObj = keyBy(qcvnList, '_id')

    const { measuringListEnable, ...qcvnsFormValues } = form.getFieldsValue()

    const qcvnsFormArray = Object.values(qcvnsFormValues || {})

    const qcvnsSelected = qcvnsFormArray.filter(qcvn =>
      get(qcvn, [FIELDS.CONFIG, FIELDS.STANDARD_ID])
    )

    const qcvnsSelectedMapValue = qcvnsSelected.map(qcvn => ({
      ...get(qcvnListObj, get(qcvn, [FIELDS.CONFIG, FIELDS.STANDARD_ID])),
      name: get(qcvn, [FIELDS.CONFIG, FIELDS.NAME]),
    }))

    return qcvnsSelectedMapValue
  }

  getMeasuringList = () => {
    const { measuringListStation } = this.props

    return (
      measuringListStation.map(measuring => ({
        ...measuring,
        measuringListEnable: measuring.key,
      })) || []
    )
  }

  getDefaultDataLevelValue = () => {
    const { form } = this.props
    const valuesForm = form.getFieldsValue()
    const dataLevelValueObj = groupBy(
      Object.values(valuesForm || {}),
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
    const { qcvnList, loadingStandard } = this.state

    const {
      form,
      users,
      roles,
      measuringListStation,
      dataSource,
      visibleAlarmDetail,
      alarmDetail,
      stationName,
      setAlarmDetail,
      handleShowAlarmDetail,
      setHiddenFields,
      stationId,
      loadingSubmit,
      handleCloseAlarmDetail,
    } = this.props

    const qcvnListSelected = this.getQcvnSelected()

    const measuringList = this.getMeasuringList()

    const alarmHaveMeasuringList = (dataSource || []).find(
      alarm => !isEmpty(get(alarm, 'config.measuringList'))
    )

    const measureListValue = get(
      alarmHaveMeasuringList,
      'config.measuringList',
      []
    )

    const defaultDataLevelValue = this.getDefaultDataLevelValue()

    return (
      <React.Fragment>
        <Skeleton loading={loadingSubmit}>
          <TableAlarmExceedForm
            dataSource={sortDataSource(dataSource)}
            form={form}
            users={users}
            roles={roles}
            onAdd={this.handleAdd}
            onDelete={this.handleDelete}
            qcvnList={qcvnList}
            setAlarmDetail={setAlarmDetail}
            qcvnListSelected={qcvnListSelected}
            handleShowAlarmDetail={handleShowAlarmDetail}
            setHiddenFields={setHiddenFields}
          />
        </Skeleton>
        <Clearfix height={24} />
        {!loadingStandard && (
          <TableQCVN
            form={form}
            measuringListStation={measuringListStation}
            qcvnList={qcvnListSelected}
            dataSource={measuringList}
            alarmList={dataSource}
            measureListValue={measureListValue}
            defaultDataLevelValue={defaultDataLevelValue}
          />
        )}
        <Clearfix height={32} />
        <Row type="flex" justify="end">
          <Col span={5}>
            <Button
              loading={loadingSubmit}
              type="primary"
              block
              size="large"
              onClick={this.handleSubmit}
            >
              {i18n().button.save}
            </Button>
          </Col>
        </Row>
        {alarmDetail && (
          <FormAlarmDetail
            qcvnList={qcvnList}
            form={form}
            visible={visibleAlarmDetail}
            onClose={handleCloseAlarmDetail}
            alarmDetail={alarmDetail}
            stationId={stationId}
            stationName={stationName}
            dataSource={dataSource}
            handleSubmit={this.handleSubmit}
            alarmType={FIELDS.DATA_LEVEL}
            showTimeRepeat
          />
        )}
      </React.Fragment>
    )
  }
}
