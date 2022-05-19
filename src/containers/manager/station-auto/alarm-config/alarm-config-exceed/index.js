import { Clearfix } from 'components/elements'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { get, isEmpty, keyBy, uniqBy } from 'lodash'
import React, { Component } from 'react'
import { FIELDS } from '../index'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'

export default class AlarmConfigExceed extends Component {
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
    }))
    return qcvnsSelectedMapValue
  }

  render() {
    const {
      qcvnList,
      alarmList,
      form,
      onDelete,
      onAdd,
      users,
      roles,
      standardFormRef,
      measuringListStation,
    } = this.props

    const measuringList = this.getMeasuringList()
    const qcvnListSelected = this.getQcvnSelected()

    const alarmHaveMeasuringList = alarmList.find(
      alarm => !isEmpty(alarm.config.measuringList)
    )
    const measureListValue = get(
      alarmHaveMeasuringList,
      'config.measuringList',
      []
    )

    return (
      <div>
        <TableAlarmExceedForm
          qcvnList={qcvnList}
          form={form}
          onDelete={onDelete}
          dataSource={alarmList}
          onAdd={onAdd}
          qcvnListSelected={qcvnListSelected}
          users={users}
          roles={roles}
        />
        <Clearfix height={12} />
        <TableQCVN
          ref={standardFormRef}
          qcvnList={qcvnListSelected}
          dataSource={measuringList}
          measureListValue={measureListValue}
          measuringListStation={measuringListStation}
        />
      </div>
    )
  }
}
