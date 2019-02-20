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
    measuringList: PropTypes.array,
    measuringListOrigin: PropTypes.array,
    loading: PropTypes.bool
  }

  getTitle = ({unit, name, key}) => {
    if (!name) name = key
    if (unit) return `${name} (${unit})`
    return name
  }

  getColumns() {
    const objMeasure = _.keyBy(this.props.measuringListOrigin, 'key')
    const cols = _.map(this.props.measuringList, item => ({
      title: this.getTitle(objMeasure[item]),
      dataIndex: item,
      key: item,
      align: 'center',
      render: value => value ? <div style={{color: 'red'}}>{value}</div> : value
    }))

    const columnReceivedAt = {
        title: translate('statistic.perRecDataFrom.time'),
        align:'center',
        dataIndex: 'receivedAt',
        key: 'receivedAt'
    }
    return [columnReceivedAt, ...cols]
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
          dataSource = {this.props.dataSource}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
