import { Table, Tooltip } from 'antd'
import { colorLevels } from 'constants/warningLevels'
import _ from 'lodash'
import moment from 'moment'
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
      render(value) {
        return <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
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
      .map(option => {
        let dataIndex = option
        if (option === 'month' || option === 'year') {
          dataIndex = 'datetime'
        }

        return {
          title: i18n.optionalInfo[option],
          dataIndex: `${dataIndex}`,
          key: `${option}`,
          align: 'center',
          render: value => {
            let formatValue = value
            if (option === 'month') formatValue = moment(value).format('M')
            if (option === 'year') formatValue = moment(value).format('YYYY')
            return <div>{formatValue}</div>
          },
        }
      })

    const measureList = _.get(dataPoints, 'measureList', [])
    const columnsMeasuring = measureList.map(measuring => ({
      title: `${measuring.name} (${measuring.unit})`,
      dataIndex: `measuringLogs.${measuring.key}`,
      key: measuring.key,
      align: 'center',
      render: (valueColumn, item) => {
        let qcvn = ''
        let isMerged = false

        if (_.has(item, `measuringLogs.${measuring.key}`)) {
          qcvn = item.measuringLogs[measuring.key].qcvn
          isMerged = item.measuringLogs[measuring.key].isMerged
        }
        if (!valueColumn) return

        const textValue = valueColumn.textValue || ''
        const value = valueColumn.value

        if (!_.isNumber(value)) {
          if (textValue.length <= 20) return textValue
          return (
            <Tooltip title={textValue}>
              <div style={{
                maxWidth: 100,
                fontSize: 14,
                color: "#262626",
                textOverflow: "ellipsis",
                whiteSpace: "pre",
                overflow: "hidden"
              }}>
                {textValue}
              </div>
            </Tooltip>
          )
        }

        return (
          <div
            style={{
              fontWeight: isMerged ? 700 : 400,
              color: valueColumn && COLOR[valueColumn.warningLevel],
            }}
          >
            <Tooltip title={isMerged ? i18n.qcvn.invalid : qcvn}>
              {textValue}
            </Tooltip>
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
        return (
          <React.Fragment>
            {standardsVNObject.map(standard => {
              const measureStandards = new Map(
                _.get(standard, 'measuringList', []).map(measure => [
                  measure.key,
                  measure,
                ])
              )

              let startTime = standard.begin
                ? moment(standard.begin).format('DD/MM/YYYY') + ' - '
                : ''
              let endTime = standard.expired
                ? moment(standard.expired).format('DD/MM/YYYY')
                : i18n.qcvn.isApplying

              const renderQCVN = measure => {
                const { minLimit, maxLimit } = measure || {}
                if (
                  (minLimit || minLimit === 0) &&
                  (maxLimit || maxLimit === 0)
                )
                  return [minLimit, maxLimit].join('-')
                if (minLimit || minLimit === 0) return `≥ ${minLimit}`
                if (maxLimit || maxLimit === 0) return `≤ ${maxLimit}`
                return '-'
              }

              return (
                <tr className="ant-table-row">
                  <td />
                  <td />
                  <td />
                  <td>
                    <Tooltip title={startTime + endTime}>
                      {standard.name}
                    </Tooltip>
                  </td>
                  {optionalInfoColumn.map(_ => (
                    <td>_</td>
                  ))}
                  {measureList.map(measure => {
                    const value = measureStandards.get(measure.key)
                    return (
                      <td style={{ textAlign: 'center' }}>
                        {renderQCVN(value)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </React.Fragment>
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
