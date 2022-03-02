import { Table } from 'antd'
import _ from 'lodash'
import React, { Component } from 'react'

export default class TableExceedQCVN extends Component {
  getColumns = () => {
    const { qcvnList } = this.props
    const columns = qcvnList.map((qcvn, index) => {
      const measuringQcvnObj = _.keyBy(qcvn.measuringList, 'key')
      return {
        title: qcvn.name,
        children: [
          {
            title: 'Giới hạn tối thiểu',
            align: 'left',
            dataIndex: 'key',
            render: measureKey => {
              const measureValue = _.get(measuringQcvnObj, [
                measureKey,
                'minLimit',
              ])

              return <div>{measureValue}</div>
            },
          },
          {
            title: 'Giới hạn tối đa',
            dataIndex: 'key',
            render: measureKey => {
              const measureValue = _.get(measuringQcvnObj, [
                measureKey,
                'maxLimit',
              ])

              return <div>{measureValue}</div>
            },
            align: 'left',
          },
        ],
      }
    })
    return [
      {
        title: 'Thông số',
        dataIndex: 'key',
        align: 'left',
        width: '10%',
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
