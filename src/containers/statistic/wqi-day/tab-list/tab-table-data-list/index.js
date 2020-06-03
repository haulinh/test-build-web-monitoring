import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import moment from 'moment'
import { DD_MM_YYYY } from 'constants/format-date'
import { values as _values, forEach as _forEach } from 'lodash'
import { getFormatNumber } from 'constants/format-number'

const TableWrapper = styled.div`
  th.column-style {
    text-align: center !important;
  }
`

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataAQI: PropTypes.array,
    dataSource: PropTypes.array,
    loading: PropTypes.bool,
  }

  getColumns() {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'time',
        className: 'column-style',
        width: 150,
        render: (text, record) => {
          return <div>{moment(record.time).format(DD_MM_YYYY)}</div>
        },
      },
    ]
    const arrData = _values(this.props.dataSource[0])
    console.log(arrData, '--arrData--')
    _forEach(arrData, item => {
      if (item.key) {
        const column = {
          title: item.name,
          className: 'column-style',
          dataIndex: item.key,
          render: (obj, record) => {
            return (
              <div style={{ textAlign: 'right' }}>
                {getFormatNumber(obj.wqiDay, 0)}
              </div>
            )
          },
        }
        columns.push(column)
      }
    })

    return columns
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`
  render() {
    // console.log(this.props.dataSource, 'this.props.dataSource')
    return (
      <TableWrapper>
        <Table
          size="small"
          rowKey="time"
          bordered
          columns={this.getColumns()}
          dataSource={this.props.dataSource}
          pagination={{ showTotal: this.showTotal, pageSize: 20 }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </TableWrapper>
    )
  }
}
