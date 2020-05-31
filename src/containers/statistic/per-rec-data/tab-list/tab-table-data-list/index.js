import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import * as _ from 'lodash'

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    loading: PropTypes.bool,
  }

  getColumns() {
    const columns = [
      {
        title: translate('statistic.perRecDataFrom.time'),
        align: 'center',
        dataIndex: 'timeDay',
        key: 'timeDay',
        flex: 1,
      },
      {
        title: translate('statistic.perRecDataFrom.totalFile'),
        align: 'center',
        dataIndex: 'totalFile',
        key: 'totalFile',
        flex: 1,
      },
      {
        title: translate('statistic.perRecDataFrom.totalFileReceivedAt'),
        align: 'center',
        dataIndex: 'totalFileReceivedAt',
        key: 'totalFileReceivedAt',
        flex: 1,
      },
      {
        title: translate('statistic.perRecDataFrom.perFileReceivedAt'),
        align: 'center',
        dataIndex: 'perFileReceivedAt',
        key: 'perFileReceivedAt',
        flex: 1,
        render: (value, record) => {
          return value
        },
      },
    ]
    return columns
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataAqiHours, this.props.dataAqiHours)) {
      this.setState({ dataAqiHours: nextProps.dataAqiHours })
    }
    if (!_.isEqual(nextProps.dataAqiDays, this.props.dataAqiDays)) {
      this.setState({ dataAqiDays: nextProps.dataAqiDays })
    }
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`
  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey="timeDay"
          bordered
          columns={this.getColumns()}
          dataSource={this.props.dataSource}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
