import { Table } from 'antd'
import _ from 'lodash'
import React, { Component } from 'react'
import uuid from 'uuid'
import { i18n } from '../constants'

export default class TableQCVN extends Component {
  getColumns = () => {
    const { qcvnList } = this.props
    const columns = qcvnList.map(qcvn => {
      const measuringQcvnObj = _.keyBy(qcvn.measuringList, 'key')

      return {
        title: qcvn.name,
        children: [
          {
            key: `minLimit-${qcvn.key}-${uuid()}`,
            title: i18n().qcvnMin,
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
            key: `minLimit-${qcvn.key}-${uuid()}`,
            title: i18n().qcvnMax,
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
        title: i18n().measure,
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
        rowKey={record => record.key}
        columns={this.getColumns()}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    )
  }
}
