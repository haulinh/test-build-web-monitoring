import React, { Component } from 'react'
import TableAlarmDisconnect from './TableAlarmDisconnect'

export default class AlarmConfig extends Component {

  render () {
    const { alarmList, form, onDelete, onAdd } = this.props

    return (
      <div>
        <div className="title">Cảnh báo mất tín hiệu</div>

        <TableAlarmDisconnect
          form={form}
          handleDelete={onDelete}
          dataSource={alarmList}
          handleAdd={onAdd}
        />
      </div>
    )
  }
}
