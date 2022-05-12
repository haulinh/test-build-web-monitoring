import { Clearfix } from 'components/elements'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { get, keyBy } from 'lodash'
import React, { Component } from 'react'
import { FIELDS } from '../index'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'

export default class AlarmConfigExceed extends Component {
  refForm = React.createRef()

  getMeasuringList = () => {
    const qcvnsSelected = this.getQcvnSelected()

    const measuringList = getMeasuringListFromStationAutos(qcvnsSelected)
    return measuringList || []
  }

  getQcvnSelected = () => {
    const { form, qcvnList } = this.props
    const qcvnListObj = keyBy(qcvnList, '_id')

    const values = form.getFieldsValue()
    const qcvnsForm = Object.values(values[FIELDS.DATA_LEVEL] || {})
    const qcvnsSelected = qcvnsForm.filter(
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
    } = this.props

    const measuringList = this.getMeasuringList()
    const qcvnListSelected = this.getQcvnSelected()

    const measureListValue = get(alarmList[0], 'config.measureListEnable', [])

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
        />
      </div>
    )
  }
}
