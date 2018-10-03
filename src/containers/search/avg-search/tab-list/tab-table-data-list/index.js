import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import styled from 'styled-components'
import moment from 'moment/moment'
import roundTo from 'round-to'
import { translate } from 'hoc/create-lang'
import { DD_MM_YYYY_HH_MM, DD_MM_YYYY } from 'constants/format-date'

const TableDataListWrapper = styled.div``

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
    typeReport: PropTypes.string
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
      case 1440:
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
      render(value, record) {
        return <div>{moment(record._id).format(formatDate)}</div>
      }
    }
    const columnsMeasurings = this.props.measuringData
      .filter(measuring => this.props.measuringList.includes(measuring.key))
      .map(measuring => ({
        title: `${measuring.name}(${measuring.unit})`,
        dataIndex: `${measuring.key}`,
        key: measuring.key,
        // format number to LocaleString(language bowser)
        render: value => (
          <div>
            {value.toLocaleString(navigator.language) &&
              value.toLocaleString(navigator.language) !== '' &&
              roundTo(value, 2).toLocaleString(navigator.language)}
          </div>
        )
      }))
    return [columnReceivedAt, ...columnsMeasurings]
  }

  render() {
    return (
      <TableDataListWrapper>
        <Table
          size="large"
          rowKey="_id"
          columns={this.getColumns()}
          {...this.props}
          locale={{ emptyText: translate('avgSearchFrom.table.emptyText') }}
        />
      </TableDataListWrapper>
    )
  }
}
