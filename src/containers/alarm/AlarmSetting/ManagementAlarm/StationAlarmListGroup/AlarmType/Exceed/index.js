import { Button, Col, Row } from 'antd'
import QCVNApi from 'api/QCVNApi'
import { Clearfix } from 'components/elements'
import withAlarmForm, {
  isDefaultDataLevel,
} from 'containers/alarm/AlarmSetting/hoc/withAlarmForm'
import { FIELDS } from 'containers/alarm/AlarmSetting/index'
import { ALARM_LIST_INIT } from 'containers/manager/station-auto/alarm-config/constants'
import { get, groupBy, isEmpty, keyBy, omit } from 'lodash'
import { Component, default as React } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createAlarm, deleteAlarm } from 'redux/actions/alarm'
import { v4 as uuidv4 } from 'uuid'
import FormAlarmDetail from '../../FormAlarmDetail'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'

@withRouter
@withAlarmForm
@connect(null, { createAlarm, deleteAlarm })
export default class AlarmExceed extends Component {
  state = {
    qcvnList: [],
  }

  componentDidMount = async () => {
    const { dataSource } = this.props
    this.setState({ loading: true })
    const qcvnList = await this.getQCVNList()

    this.setInitValues(dataSource, qcvnList)
  }

  getInitValues = alarmList => {
    //#region set alarm data level
    if (alarmList) {
      const alarmDataLevelDefault = ALARM_LIST_INIT.DATA_LEVEL.map(
        alarmDataLevelDefaultItem => {
          const existAlarmDataLevelItem = alarmList.find(
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

      const alarmStandardWithoutDefault = alarmList.filter(
        alarmStandardItem =>
          !isDefaultDataLevel(get(alarmStandardItem, 'config.type'))
      )

      const alarmStandardWithDefault = [
        ...alarmDataLevelDefault,
        ...alarmStandardWithoutDefault,
      ]

      return alarmStandardWithDefault
    } else {
      return ALARM_LIST_INIT.DATA_LEVEL
    }
  }

  setInitValues = (alarmList, qcvnList) => {
    const { setFormValues } = this.props

    this.setState({ qcvnList })

    //#region set alarm data level
    setFormValues(this.getInitValues(alarmList))
    //#endregion set alarm data level
  }

  getQCVNList = async () => {
    const result = await QCVNApi.getQCVN({}, {})
    if (result.success) {
      return result.data
    }
  }

  handleSubmit = () => {
    const { getQueryParamGeneral, handleSubmitAlarm, stationId } = this.props

    const paramGeneral = getQueryParamGeneral()
    const measuringListEnable = this.getMeasureListEnable()

    const params = paramGeneral
      .filter(paramItem => paramItem.config)
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

    handleSubmitAlarm(params)
  }

  handleAdd = () => {
    const { stationId, createAlarm } = this.props
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

    createAlarm(newData)
  }

  handleDelete = id => {
    const { deleteAlarm, setIdsDeleted } = this.props

    deleteAlarm(id)
    setIdsDeleted(id)
  }

  getMeasureListEnable = () => {
    // let config = null
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

  handleCloseAlarmDetail = () => {
    const { handleCloseAlarmDetail } = this.props
    handleCloseAlarmDetail()
  }

  render() {
    const { qcvnList } = this.state
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
        <TableAlarmExceedForm
          dataSource={this.getInitValues(dataSource)}
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
        <Clearfix height={24} />
        <TableQCVN
          form={form}
          measuringListStation={measuringListStation}
          qcvnList={qcvnListSelected}
          dataSource={measuringList}
          measureListValue={measureListValue}
          defaultDataLevelValue={defaultDataLevelValue}
        />
        <Clearfix height={32} />
        <Row type="flex" justify="end">
          <Col span={5}>
            <Button
              style={{ width: '328px' }}
              type="primary"
              block
              size="large"
              onClick={this.handleSubmit}
            >
              Lưu
            </Button>
          </Col>
        </Row>
        {alarmDetail && (
          <FormAlarmDetail
            qcvnList={qcvnList}
            form={form}
            visible={visibleAlarmDetail}
            onClose={this.handleCloseAlarmDetail}
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
