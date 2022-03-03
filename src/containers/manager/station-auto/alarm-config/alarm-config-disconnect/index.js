import React, { Component } from 'react'
import TableAlarmDisconnect from './TableAlarmDisconnect'

export default class AlarmConfigDisconnect extends Component {
  render() {
    const { alarmList, form, onDelete, onAdd, users, roles } = this.props

    return (
      <React.Fragment>
        <div className="title">Cảnh báo mất tín hiệu</div>

        <TableAlarmDisconnect
          form={form}
          handleDelete={onDelete}
          dataSource={alarmList}
          handleAdd={onAdd}
          users={users}
          roles={roles}
        />
      </React.Fragment>
    )
  }
}
