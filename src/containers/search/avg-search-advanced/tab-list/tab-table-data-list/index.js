import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import styled from 'styled-components'
import moment from 'moment/moment'
import { translate } from 'hoc/create-lang'
import { DD_MM_YYYY_HH_MM, DD_MM_YYYY } from 'constants/format-date'
import { SHAPE } from 'themes/color'
import { get as _get } from 'lodash'
import {
  getFormatNumber,
  FORMAT_VALUE_MEASURING,
} from 'constants/format-number'
import { getcolorMeasure as getColorMeasure } from 'constants/warningLevels'

const TableDataListWrapper = styled.div`
  .ant-table-thead > tr > th {
    white-space: nowrap;
  }
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

    const columnReceivedAt = {
      title: translate('avgSearchFrom.table.receivedAt'),
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      width: 170,
      fixed: 'left',
      render(value, record) {
        return <div>{moment(record.date_utc).format(formatDate)}</div>
      },
    }
    const columnsMeasuring = this.props.measuringData
      .filter(measuring => this.props.measuringList.includes(measuring.key))
      .map(measuring => ({
        title: (
          <strong>
            {measuring.name} <br />{' '}
            {_get(measuring, 'unit', '').trim()
              ? `(${_get(measuring, 'unit', '')})`
              : ''}
          </strong>
        ),
        dataIndex: `measuringLogs.${measuring.key}`,
        key: measuring.key,
        width: 120,
        align: 'right',
        render: value => {
          if (value === null || value === undefined) return <div>-</div>

          let color = getColorMeasure(value.value, measuring, SHAPE.BLACK)
          return (
            <div style={{ color }}>
              {getFormatNumber(value.value, FORMAT_VALUE_MEASURING)}
            </div>
          )
        },
      }))
    const columnData = [columnReceivedAt, ...columnsMeasuring]
    return columnData
  }

  render() {
    return (
      <TableDataListWrapper>
        <Table
          size="large"
          rowKey="date_utc"
          columns={this.getColumns()}
          {...this.props}
          locale={{ emptyText: translate('avgSearchFrom.table.emptyText') }}
          scroll={{ x: 'max-content', y: 500 }}
        />
      </TableDataListWrapper>
    )
  }
}
