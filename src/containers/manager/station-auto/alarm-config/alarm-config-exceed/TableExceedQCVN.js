import { Table } from 'antd'
import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default class TableExceedQCVN extends Component {
  onChange = e => {}

  onCheckAllChange = e => {
    console.log(e.target.checked)
  }

  getColumns = () => {
    const { qcvnList } = this.props
    const columns = qcvnList.map((qcvn, index) => {
      return {
        title: qcvn.name,
        children: [
          {
            title: 'Giới hạn tối thiểu',
            dataIndex: `${qcvn._id}.minLimit`,
            align: 'center',
          },
          {
            title: 'Giới hạn tối đa',
            dataIndex: `${qcvn._id}.maxLimit`,
            align: 'center',
          },
        ],
      }
    })
    return [
      {
        title: 'Thông số',
        dataIndex: 'key',
        align: 'center',
      },
      ...columns,
    ]
  }

  render() {
    const { dataSource } = this.props
    return (
      <Table
        columns={this.getColumns()}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    )
  }
}
