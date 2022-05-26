import { Clearfix } from 'components/elements'
import React, { Component } from 'react'
import { Tab } from 'react-bootstrap'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'
import { FIELDS } from '../../index'
import { get, groupBy, isEmpty, keyBy, uniqBy } from 'lodash'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'

export default class AlarmConfigExceed extends Component {
  getQcvnSelected = () => {
    const { form, qcvnList } = this.props

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

    const uniqueMeasuringList = uniqBy([...measuringList], 'key')

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
    const {
      alarmList,
      form,
      users,
      roles,
      onAdd,
      onDelete,
      qcvnList,
      measuringListStation,
    } = this.props

    const qcvnListSelected = this.getQcvnSelected()
    const measuringList = this.getMeasuringList()

    const alarmHaveMeasuringList = alarmList.find(
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
          dataSource={alarmList}
          form={form}
          users={users}
          roles={roles}
          onAdd={onAdd}
          onDelete={onDelete}
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
      </div>
    )
  }
}
