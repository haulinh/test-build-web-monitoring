import { Button, Col, Row, Switch, Table } from 'antd'
import { Clearfix } from 'components/elements'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import React, { Component } from 'react'
import DropdownMoreAction from 'containers/alarm/AlarmSetting/components/DropdownMoreAction'
import { SelectTime } from 'containers/alarm/AlarmSetting/components/SelectTime'
import { i18n } from 'containers/alarm/AlarmSetting/constants'

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

export default class AlarmDisconnect extends Component {
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
    const { dataSource } = this.props
    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          bordered
          dataSource={dataSource}
          pagination={false}
        />
        <Clearfix height={24} />
        <Row type="flex" justify="end">
          <Col span={5}>
            <Button type="primary" block size="large">
              Lưu
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

AlarmDisconnect.defaultProps = {
  dataSource,
}
