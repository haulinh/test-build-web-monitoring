import QCVNApi from 'api/QCVNApi'
import { Clearfix } from 'components/elements'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { keyBy } from 'lodash'
import React, { Component } from 'react'
import TableAlarmExceedForm from './TableAlarmExceedForm'
import TableQCVN from './TableQCVN'
import { FIELDS } from '../index'

export default class AlarmConfigExceed extends Component {
  // state = {
  //   qcvnList: [],
  // }

  // async componentDidMount() {
  //   try {
  //     const result = await QCVNApi.getQCVN({}, {})
  //     if (result.success) {
  //       this.setState({
  //         qcvnList: result.data,
  //       })
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  getMeasuringList = () => {
    const qcvnsSelected = this.getQcvnSelected()

    const measuringList = getMeasuringListFromStationAutos(qcvnsSelected)
    return measuringList || []
  }

  getQcvnSelected = () => {
    const { form, qcvnList } = this.props
    // const { qcvnList } = this.state
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
    const { qcvnList, alarmList, form, onDelete, onAdd } = this.props

    const measuringList = this.getMeasuringList()
    const qcvnListSelected = this.getQcvnSelected()

    return (
      <div>
        <div className="title">Cảnh báo vượt ngưỡng</div>

        <TableAlarmExceedForm
          qcvnList={qcvnList}
          form={form}
          onDelete={onDelete}
          dataSource={alarmList}
          onAdd={onAdd}
        />
        <Clearfix height={12} />
        <TableQCVN qcvnList={qcvnListSelected} dataSource={measuringList} />
      </div>
    )
  }
}
