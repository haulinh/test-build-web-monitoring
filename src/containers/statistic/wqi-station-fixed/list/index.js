import { Table } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'
import { get } from 'lodash-es'

function i18n() {
  return {
    pointName: t('wqiStationFix.pointName'),
    avgTime: t('wqiStationFix.avgTime'),
    wqiValue: t('wqiStationFix.wqiValue'),
    wqiLevel: t('wqiStationFix.wqiLevel'),
  }
}
const TableCustom = styled(Table)`
  tr > td {
    background: #ffffff !important;
  }
`

class WQIList extends React.Component {
  columns = [
    {
      title: i18n().pointName,
      key: 'name',
      render: (_, record) => {
        const obj = {
          children: get(record, 'point.name'),
          props: {
            rowSpan: record.size ? record.size : 1,
            colSpan: record.size ? 1 : 0,
          },
        }
        return obj
      },
    },
    {
      title: i18n().avgTime,
      key: 'time',
      dataIndex: 'datetime',
    },
    {
      title: i18n().wqiValue,
      key: 'wqi',
      dataIndex: 'wqiResult.wqi',
      render: value => (value ? Math.round(value) : '-'),
    },
    {
      title: i18n().wqiLevel,
      key: 'status',
      dataIndex: 'wqiResult.level.name',
      render: value => (value ? value : '-'),
    },
  ]

  render() {
    const { loading, dataSource } = this.props

    return (
      <TableCustom
        loading={loading}
        bordered
        rowKey={record => `${record.point.key}_${record.datetime}`}
        dataSource={dataSource}
        columns={this.columns}
        pagination={false}
      />
    )
  }
}

export default WQIList
