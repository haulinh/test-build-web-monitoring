import { Table } from 'antd'
import { DD_MM_YYYY } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment-timezone'
import React from 'react'
import { i18n } from '../../constants'

const TableMonthObtained = ({ dataSource, loading }) => {
  const dataSortByStationType = dataSource.sort((a, b) =>
    _.get(b.station, 'stationType.key', '').localeCompare(
      _.get(a.station, 'stationType.key', '')
    )
  )

  const columns = [
    {
      title: i18n().header1,
      dataIndex: 'station.name',
      align: 'left',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n().header6,
      dataIndex: 'station.activatedAt',
      align: 'left',
      render: value => {
        if (!value) {
          return '-'
        }
        return (
          <div style={{ textAlign: 'left' }}>
            {moment(value).format(DD_MM_YYYY)}
          </div>
        )
      },
    },
    {
      title: i18n().header2,
      dataIndex: 'station.dataFrequency',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {_.isNumber(value) ? value : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'data[0].record',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {_.isNumber(value) ? value : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'data[0].total',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {_.isNumber(value) ? value : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'data[0].obtainedRatio',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>{getFormatNumber(value, 2)}</div>
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
      dataSource={dataSortByStationType}
      locale={{
        emptyText: translate('dataSearchFrom.table.emptyText'),
      }}
      pagination={false}
    />
  )
}

export default TableMonthObtained
