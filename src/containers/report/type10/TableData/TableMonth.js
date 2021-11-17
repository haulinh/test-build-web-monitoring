import React from 'react'
import { i18n } from '../index'
import moment from 'moment-timezone'
import { getFormatNumber, ROUND_DIGIT } from 'constants/format-number'
import { DD_MM_YYYY } from 'constants/format-date'
import get from 'lodash/get'
import { Table } from 'antd'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'

export default function TableMonth({
  dataSource,
  loading,
  hidden,
  parentProps,
}) {
  const dataSortByStationType = dataSource.sort((a, b) =>
    _.get(b.station, 'stationType.key', '').localeCompare(
      _.get(a.station, 'stationType.key', '')
    )
  )

  const columns = [
    {
      title: i18n().header1,
      dataIndex: 'name',
      align: 'left',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n().header6,
      dataIndex: 'activatedAt',
      align: 'left',
      render: value => {
        if (!value) {
          return '-'
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
          <div style={{ textAlign: 'right' }}>
            {_.isNumber(value) ? getFormatNumber(value, 0) : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'totalDesign',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {_.isNumber(value) ? getFormatNumber(value, 0) : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'totalFact',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {_.isNumber(value) ? getFormatNumber(value, 0) : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'percentageReceived',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {value ? value : '-'}
          </div>
        )
      },
    },
  ]
  return (
    <div style={{ display: hidden && 'none' }}>
      <Table
        loading={loading}
        size="small"
        rowKey="_id"
        columns={columns}
        bordered={true}
        dataSource={dataSortByStationType}
        locale={{
          emptyText: translate('dataSearchFrom.table.emptyText'),
        }}
        pagination={false}
      />
    </div>
  )
}
