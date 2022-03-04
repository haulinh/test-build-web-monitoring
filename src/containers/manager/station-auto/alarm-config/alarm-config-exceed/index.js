import { Clearfix } from 'components/elements'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { keyBy } from 'lodash'
import React, { Component } from 'react'
import { FIELDS } from '../index'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'
import { i18n } from '../constants'

export default class AlarmConfigExceed extends Component {
  getMeasuringList = () => {
    const qcvnsSelected = this.getQcvnSelected()

    const measuringList = getMeasuringListFromStationAutos(qcvnsSelected)
    return measuringList || []
  }

  getQcvnSelected = () => {
    const { form, qcvnList } = this.props
    const qcvnListObj = keyBy(qcvnList, '_id')

    const values = form.getFieldsValue()
    const qcvnsForm = Object.values(values[FIELDS.BY_STANDARD] || {})
    const qcvnsSelected = qcvnsForm.filter(qcvn => qcvn[FIELDS.STANDARD_ID])
    const qcvnsSelectedMapValue = qcvnsSelected.map(qcvn => ({
      ...qcvnListObj[qcvn[FIELDS.STANDARD_ID]],
    }))
    return qcvnsSelectedMapValue
  }

  render() {
    // const { qcvnList } = this.state
    const {
      qcvnList,
      alarmList,
      form,
      onDelete,
      onAdd,
      users,
      roles,
    } = this.props

    const measuringList = this.getMeasuringList()
    const qcvnListSelected = this.getQcvnSelected()

    return (
      <div>
        <div className="title">{i18n().alarmExceed}</div>

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
        <TableQCVN qcvnList={qcvnListSelected} dataSource={measuringList} />
      </div>
    )
  }
}
