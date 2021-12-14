import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Table, Tooltip } from 'antd'
import styled from 'styled-components'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import { DD_MM_YYYY_HH_MM, DD_MM_YYYY } from 'constants/format-date'
import { get as _get } from 'lodash'
import {
  getFormatNumber,
  FORMAT_VALUE_MEASURING,
} from 'constants/format-number'
import { colorLevels } from 'constants/warningLevels'

const COLOR = {
  EXCEEDED_PREPARING: colorLevels.EXCEEDED_PREPARING,
  EXCEEDED: colorLevels.EXCEEDED,
}

const TableDataListWrapper = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    text-align: center !important;
  }
`

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
    typeReport: PropTypes.string,
    qcvns: PropTypes.array,
  }

  getColumns() {
    let formatDate = ''
    switch (this.props.typeReport) {
      case 'year':
        formatDate = 'YYYY'
        break
      case 'month':
        formatDate = 'MM/YYYY'
        break
      case '1440': // kiểu dữ liệu ngày
        formatDate = DD_MM_YYYY
        break

      default:
        formatDate = DD_MM_YYYY_HH_MM
        break
    }

    const getMeasuringValue = (list, key) => {
      const measure = list.find(item => item.key === key)
      const { minLimit, maxLimit } = measure || {}
      if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
        return [minLimit, maxLimit].join('-')
      if (minLimit || minLimit === 0) return `≥ ${minLimit}`
      if (maxLimit || maxLimit === 0) return `≤ ${maxLimit}`
      return '-'
    }

    const columnReceivedAt = {
      title: translate('avgSearchFrom.table.receivedAt'),
      dataIndex: 'date_utc',
      key: 'date_utc',
      width: 170,
      fixed: 'left',
      render(value, record) {
        if (record.isQCVN) {
          let startTime = record.begin
            ? moment(record.begin).format('DD/MM/YYYY') + ' - '
            : ''
          let endTime = record.expired
            ? moment(record.expired).format('DD/MM/YYYY')
            : translate('qcvn.form.expired.isApplying')
          return (
            <Tooltip title={startTime + endTime}>
              <div style={{ color: 'rgba(0,0,0,.8)' }}>{record.name}</div>
            </Tooltip>
          )
        }
        return <div>{moment(record.receivedAt).format(formatDate)}</div>
      },
    }

    const columnsMeasuring = this.props.measuringData
      .map(measuring => ({
        title: (
          <strong>
            {measuring.name} <br />{' '}
            {_get(measuring, 'unit', '')
              ? `(${_get(measuring, 'unit', '').trim()})`
              : ''}
          </strong>
        ),
        dataIndex: `measuringLogs.${measuring.key}`,
        key: measuring.key,
        width: 120,
        align: 'right',
        render: (value, item) => {
          if (item.isQCVN) {
            return (
              <div>{getMeasuringValue(item.measuringList, measuring.key)}</div>
            )
          }
          // console.log(value, '==value==')
          // console.log(JSON.stringify(this.props.dataSource, null, 2), '==dataSource==')
          if (value === null || value === undefined) return <div>-</div>

          return (
            <div
              style={{
                color: COLOR[value.warningLevel],
                fontWeight: value.isMerged ? 700 : 400,
              }}
            >
              <Tooltip
                title={value.isMerged ? translate('qcvn.invalid') : value.qcvn}
              >
                {getFormatNumber(value.value, FORMAT_VALUE_MEASURING)}
              </Tooltip>
            </div>
          )
        },
      }))
    const columnData = [columnReceivedAt, ...columnsMeasuring]
    return columnData
  }

  getDataSource(dataSource) {
    return [
      ...dataSource,
      ...this.props.qcvns.map(qc => ({ ...qc, isQCVN: true })),
    ]
  }

  render() {
    const { dataSource, pagination, ...otherProps } = this.props

    return (
      <TableDataListWrapper>
        <Table
          size="large"
          rowKey="date_utc"
          columns={this.getColumns()}
          {...otherProps}
          dataSource={this.getDataSource(dataSource)}
          pagination={{
            ...pagination,
            pageSize: this.props.qcvns.length + 50,
          }}
          locale={{ emptyText: translate('avgSearchFrom.table.emptyText') }}
          scroll={{ x: 'max-content', y: 500 }}
        />
      </TableDataListWrapper>
    )
  }
}
