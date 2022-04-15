import { Table } from 'antd'
import { DD_MM_YYYY } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import _, { flatten, isEmpty, isNumber } from 'lodash'
import get from 'lodash/get'
import moment from 'moment-timezone'
import React from 'react'
import { i18n } from '../../constants'

const TableMonthMonitoring = ({ dataSource, loading, measuresObj }) => {
  const dataSortByStationType = dataSource.sort((a, b) =>
    _.get(b.station, 'stationType.key', '').localeCompare(
      _.get(a.station, 'stationType.key', '')
    )
  )

  const getDataSource = () => {
    const dataStation = dataSortByStationType.map(dataStationItem => {
      const data = dataStationItem.data.reduce((base, current) => {
        if (isEmpty(current.logs)) return []

        const measureKeys = Object.keys(get(current, 'logs'))
        const dataMeasuringLogs = measureKeys.map((measure, index) => {
          return {
            measure,
            date: current.date,
            key: current.date,
            station: dataStationItem.station,
            ...current.logs[measure],
            ...(index === 0 && {
              spanMerge: measureKeys.length || 0,
              indexMerge: true,
            }),
          }
        })
        return [...base, ...dataMeasuringLogs]
      }, [])

      return data
    }, [])

    return flatten(dataStation)
  }

  const dataSourceTable = getDataSource()

  const columns = [
    {
      title: i18n().header1,
      dataIndex: 'station.name',
      align: 'left',
      render: (value, record) => {
        const obj = {
          children: <div>{value}</div>,
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
      title: i18n().header6,
      dataIndex: 'station.activatedAt',
      align: 'left',
      render: (value, record) => {
        const obj = {
          children: (
            <div style={{ textAlign: 'left' }}>
              {value ? moment(value).format(DD_MM_YYYY) : '-'}
            </div>
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
      title: i18n().header2,
      dataIndex: 'station.dataFrequency',
      align: 'right',
      render: (value, record) => {
        const obj = {
          children: <div>{value}</div>,
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
      title: i18n().table.title.measure,
      dataIndex: 'measure',
      align: 'left',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>{measuresObj[value].name}</div>
        )
      },
    },
    {
      title: i18n().table.title.valuesByDesign,
      dataIndex: 'total',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {isNumber(value) ? value : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().table.title.valuesReceived,
      dataIndex: 'record',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {isNumber(value) ? value : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().table.title.numberOfError,
      dataIndex: 'error',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {isNumber(value) ? value : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().table.title.percentageReceived,
      dataIndex: 'obtainedRatio',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {isNumber(value) ? getFormatNumber(value, 2) : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().table.title.percentageError,
      dataIndex: 'errorRatio',
      align: 'right',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {isNumber(value) ? getFormatNumber(value, 2) : '-'}
          </div>
        )
      },
    },
  ]

  return (
    <Table
      loading={loading}
      size="small"
      rowKey={record => record.measure}
      columns={columns}
      bordered={true}
      dataSource={dataSourceTable}
      locale={{
        emptyText: translate('dataSearchFrom.table.emptyText'),
      }}
      pagination={false}
    />
  )
}

export default TableMonthMonitoring
