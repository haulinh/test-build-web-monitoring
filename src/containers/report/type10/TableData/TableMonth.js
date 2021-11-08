import React from 'react'
import { i18n } from '../index'
import moment from 'moment-timezone'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { DD_MM_YYYY } from 'constants/format-date'
import get from 'lodash/get'
import { Table } from 'antd'
import { translate } from 'hoc/create-lang'

export default function TableMonth({ dataSource, loading, parentProps }) {
  const columns = [
    {
      title: i18n().header1,
      dataIndex: 'name',
      align: 'center',
      render: value => {
        return <div style={{ textAlign: 'left' }}>{value}</div>
      },
    },
    {
      title: i18n().header6,
      dataIndex: 'activatedAt',
      align: 'center',
      render: value => {
        if (!value) {
          return null
        }
        return (
          <div style={{ textAlign: 'left' }}>
            {moment(value)
              .tz(get(parentProps, 'timeZone.value', ''))
              .format(DD_MM_YYYY)}
          </div>
        )
      },
    },
    {
      title: i18n().header2,
      dataIndex: 'dataFrequency',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>{getFormatNumber(value, 0)}</div>
        )
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'totalDesign',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>{getFormatNumber(value, 0)}</div>
        )
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'totalFact',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>{getFormatNumber(value, 0)}</div>
        )
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'percentageReceived',
      align: 'center',
      render: value => {
        if (!value) return null
        return (
          <div style={{ textAlign: 'right' }}>
            {getFormatNumber(value, ROUND_DIGIT)}
          </div>
        )
      },
    },
  ]
  return (
    <Table
      loading={loading}
      size="small"
      rowKey="_id"
      columns={columns}
      bordered={true}
      dataSource={dataSource}
      locale={{
        emptyText: translate('dataSearchFrom.table.emptyText'),
      }}
      pagination={false}
    />
  )
}
