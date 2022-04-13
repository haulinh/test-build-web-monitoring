import { Table } from 'antd'
import { DD_MM_YYYY } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { i18n } from '../../constants'

const TableDateObtained = ({ loading, dataSource, dataFrequency }) => {
  const columns = [
    {
      title: translate('dataSearchFilterForm.form.time'),
      dataIndex: 'date',
      align: 'left',
      render: (value, record) => {
        return <div>{value ? moment(value).format(DD_MM_YYYY) : '-'}</div>
      },
    },
    {
      title: i18n().header2,
      align: 'right',
      render: () => {
        return <div>{_.isNumber(dataFrequency) ? dataFrequency : '-'}</div>
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'totalDesign',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'totalFact',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'ratio',
      align: 'right',
      render: value => {
        return <div>{getFormatNumber(value, 2)}</div>
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

export default TableDateObtained
