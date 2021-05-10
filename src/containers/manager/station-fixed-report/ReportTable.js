import React from 'react'
import { Table } from 'antd'
import { i18n, PAGE_SIZE } from './station-fixed-report'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import moment from 'moment'
import _ from 'lodash'
import { colorLevels } from 'constants/warningLevels'

const COLOR = {
  EXCEEDED_PREPARING: colorLevels.EXCEEDED_PREPARING,
  EXCEEDED: colorLevels.EXCEEDED,
}

const ReportTable = ({ dataPoints, pagination, pageNumber, loading, form }) => {
  const getColumns = () => {
    const columnIndex = {
      title: i18n.numberOrder,
      dataIndex: 'Index',
      key: 'Index',
      render(value, record, index) {
        return <div>{(pageNumber - 1) * PAGE_SIZE + (index + 1)}</div>
      },
    }

    const columnReceivedAt = {
      title: i18n.receivedAt,
      dataIndex: 'datetime',
      key: 'datetime',
      render(value) {
        return <div>{moment(value).format(DD_MM_YYYY_HH_MM)}</div>
      },
    }

    const columnPhase = {
      title: i18n.phaseName,
      dataIndex: 'phase',
      key: 'phase',
      render(value) {
        return <div>{value.name}</div>
      },
    }

    const columnPoint = {
      title: i18n.pointName,
      dataIndex: 'point',
      key: 'point',
      render(value) {
        return <div>{value.name}</div>
      },
    }

    const optionalInfoValue = form.getFieldsValue()
    const optionalInfoColumn = Object.keys(optionalInfoValue)
      .filter(option => optionalInfoValue[option])
      .map(option => ({
        title: i18n.optionalInfo[option],
        dataIndex: `${option}`,
        key: `${option}`,
        align: 'center',
        render: value => {
          return <div>{value}</div>
        },
      }))

    const measureList = _.get(dataPoints, 'measureList', [])
    const columnsMeasuring = measureList.map(measuring => ({
      title: `${measuring.name} (${measuring.unit})`,
      dataIndex: `measuringLogs.${measuring.key}`,
      key: measuring.key,
      align: 'center',
      render: valueColumn => {
        if (!valueColumn) return
        if (valueColumn.textValue === 'KPH') return valueColumn.textValue
        return (
          <div
            style={{ color: valueColumn && COLOR[valueColumn.warningLevel] }}
          >
            {valueColumn && valueColumn.value}
          </div>
        )
      },
    }))

    return [
      columnIndex,
      columnReceivedAt,
      columnPhase,
      columnPoint,
      ...optionalInfoColumn,
      ...columnsMeasuring,
    ]
  }

  console.log({ data: dataPoints.data })

  return (
    <Table
      // locale={locale}
      size="small"
      rowKey="_id"
      columns={getColumns()}
      dataSource={dataPoints.data}
      loading={loading}
      pagination={pagination}
    />
  )
}

export default ReportTable
