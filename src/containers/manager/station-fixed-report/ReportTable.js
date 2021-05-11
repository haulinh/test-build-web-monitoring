import { Table } from 'antd'
import { colorLevels } from 'constants/warningLevels'
import _ from 'lodash'
import React from 'react'
import { i18n, PAGE_SIZE } from './station-fixed-report'

const COLOR = {
  EXCEEDED_PREPARING: colorLevels.EXCEEDED_PREPARING,
  EXCEEDED: colorLevels.EXCEEDED,
}

const ReportTable = ({
  dataPoints,
  pagination,
  pageNumber,
  loading,
  form,
  standardsVNObject,
}) => {
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

  const BodyWrapper = props => {
    const optionalInfoValue = form.getFieldsValue()
    const optionalInfoColumn = Object.keys(optionalInfoValue).filter(
      option => optionalInfoValue[option]
    )
    const measureList = _.get(dataPoints, 'measureList', [])

    const renderFooter = () => {
      if (!_.isEmpty(standardsVNObject)) {
        const measureStandards = new Map(
          _.get(standardsVNObject, 'measuringList', []).map(measure => [
            measure.key,
            measure,
          ])
        )

        const renderQCVN = measure => {
          const { minLimit, maxLimit } = measure || {}
          if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
            return [minLimit, maxLimit].join('-')
          if (minLimit || minLimit === 0) return `≤ ${minLimit}`
          if (maxLimit || maxLimit === 0) return `≥ ${maxLimit}`
          return '-'
        }

        return (
          <tr className="ant-table-row">
            <td />
            <td />
            <td />
            <td>{standardsVNObject.name}</td>
            {optionalInfoColumn.map(_ => (
              <td>_</td>
            ))}
            {measureList.map(measure => {
              const value = measureStandards.get(measure.key)
              return (
                <td style={{ textAlign: 'center' }}>{renderQCVN(value)}</td>
              )
            })}
          </tr>
        )
      }
      return <React.Fragment />
    }

    return (
      <tbody {...props}>
        <React.Fragment>{props.children}</React.Fragment>
        {renderFooter()}
      </tbody>
    )
  }

  return (
    <Table
      components={{ body: { wrapper: BodyWrapper } }}
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
