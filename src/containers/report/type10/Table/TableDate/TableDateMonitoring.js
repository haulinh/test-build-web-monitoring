import { Table } from 'antd'
import { DD_MM_YYYY } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import _, { get, isEmpty } from 'lodash'
import moment from 'moment'
import React from 'react'
import { i18n } from '../../constants'

const TableDateMonitoring = ({ dataSource, loading, dataFrequency }) => {
  const getDataSource = () => {
    if (isEmpty(dataSource)) return

    const dataStation = get(dataSource, ['0', 'data']).reduce(
      (base, current) => {
        const dataMeasureKeys = Object.keys(get(current, 'measuringLogs')) || []
        const dataMeasuringLogs = dataMeasureKeys.map((measure, index) => {
          return {
            measure,
            date: current.date,
            key: current.date,
            ...current.measuringLogs[measure],
            ...(index === 0 && {
              spanMerge: dataMeasureKeys.length || 0,
              indexMerge: true,
            }),
          }
        })

        return [...base, ...dataMeasuringLogs]
      },
      []
    )

    return {
      station: dataSource[0].station,
      data: dataStation,
    }
  }

  const columns = [
    {
      title: translate('dataSearchFilterForm.form.time'),
      dataIndex: 'date',
      align: 'left',
      render: (value, record) => {
        const obj = {
          children: <div>{value ? moment(value).format(DD_MM_YYYY) : '-'}</div>,
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }
        return obj
      },
    },
    {
      title: i18n().header2,
      align: 'right',
      render: (value, record) => {
        const obj = {
          children: (
            <div>{_.isNumber(dataFrequency) ? dataFrequency : '-'}</div>
          ),
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }
        return obj
      },
    },
    {
      title: 'Thông số',
      dataIndex: 'measure',
      align: 'right',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: 'Số giá trị quan trắc theo thiết kế',
      dataIndex: 'totalDesign',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'countTotal',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: 'Số giá trị quan trắc lỗi/ bất thường',
      dataIndex: 'countError',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: 'Tỷ lệ số liệu nhận được so với số giá trị theo thiết kế (%)',
      dataIndex: 'ratioTotal',
      align: 'right',
      render: value => {
        return <div>{getFormatNumber(value, 2)}</div>
      },
    },
    {
      title: 'Tỷ lệ số liệu lỗi/bất thường so với số giá trị nhận được (%)',
      dataIndex: 'ratioError',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
  ]

  const dataSourceStation = getDataSource()

  return (
    <Table
      loading={loading}
      size="small"
      rowKey="_id"
      columns={columns}
      bordered={true}
      dataSource={get(dataSourceStation, 'data')}
      locale={{
        emptyText: translate('dataSearchFrom.table.emptyText'),
      }}
      pagination={false}
    />
  )
}

export default TableDateMonitoring
