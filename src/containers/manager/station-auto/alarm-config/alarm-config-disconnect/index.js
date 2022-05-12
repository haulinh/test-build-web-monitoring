import React, { Component } from 'react'
import TableAlarmDisconnect from './TableAlarmDisconnect'

export default class AlarmConfigDisconnect extends Component {
  render() {
    const { alarmList, form, onDelete, onAdd, users, roles } = this.props

    return (
      <TableAlarmDisconnect
        form={form}
        handleDelete={onDelete}
        dataSource={alarmList}
        handleAdd={onAdd}
        users={users}
        roles={roles}
      />
    )
  }
}
