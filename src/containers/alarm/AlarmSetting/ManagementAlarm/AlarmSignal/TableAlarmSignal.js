import { Switch, Table } from 'antd'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import React, { Component } from 'react'
import DropdownMoreAction from '../../components/DropdownMoreAction'
import { SelectTime } from '../../components/SelectTime'
import { i18n } from '../../constants'

const dataSource = [
  {
    _id: '9eae4924-5d19-4d38-9d2a-cfcb7cd7cbac',
    type: 'disconnect',
    isCreateLocal: true,
    maxDisconnectionTime: 1800,
    status: false,
  },
  {
    _id: 'f33a0807-2cbb-4aec-95e6-4bfb3fa2081e',
    type: 'disconnect',
    isCreateLocal: true,
    maxDisconnectionTime: 3600,
    status: false,
  },
  {
    _id: 'c17d3797-6525-48f9-b7ac-2626555cdfc5',
    type: 'disconnect',
    isCreateLocal: true,
    maxDisconnectionTime: 7200,
    status: false,
  },
]

export default class TableAlarmSignal extends Component {
  columns = [
    {
      title: i18n().timeLabel,
      width: '20%',
      align: 'left',
      render: () => <SelectTime />,
    },
    {
      title: i18n().recipient,
      dataIndex: 'recipients',
      align: 'center',
      width: '50%',
      render: () => {
        const { users, roles } = this.props
        return <TreeSelectUser users={users} roles={roles} />
      },
    },
    {
      title: i18n().alarm,
      width: '13%',
      align: 'center',
      render: () => <Switch />,
    },
    {
      title: '',
      width: '13%',
      align: 'center',
      render: () => <DropdownMoreAction />,
    },
  ]
  render() {
    return (
      <Table
        columns={this.columns}
        bordered
        dataSource={dataSource}
        pagination={false}
      />
    )
  }
}
