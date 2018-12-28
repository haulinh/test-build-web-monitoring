import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import * as _ from 'lodash'
import moment from 'moment/moment'

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    dataFrequency: PropTypes.number,
    loading: PropTypes.bool
  }

  getColumns() {
    const columns = [
      {
        title: translate('statistic.perRecDataFrom.time'),
        align:'center',
        dataIndex: 'timeDay',
        key: 'timeDay',
        flex: 1
      },
      {
        title: translate('statistic.perRecDataFrom.totalFile'),
        align:'center',
        dataIndex: 'totalFile',
        key: 'totalFile',
        flex: 1
      },
      {
        title: translate('statistic.perRecDataFrom.totalFileReceivedAt'),
        align:'center',
        dataIndex: 'totalFileReceivedAt',
        key: 'totalFileReceivedAt',
        flex: 1
      },
      {
        title: translate('statistic.perRecDataFrom.perFileReceivedAt'),
        align:'center',
        dataIndex: 'perFileReceivedAt',
        key: 'perFileReceivedAt',
        flex: 1,
        render: (value, record) => {
          return value 
        }
      }
    ]
    return columns
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataAqiHours, this.props.dataAqiHours)) {
      this.setState({ dataAqiHours: nextProps.dataAqiHours })
    }
    if (!_.isEqual(nextProps.dataAqiDays, this.props.dataAqiDays)) {
      this.setState({ dataAqiDays:nextProps.dataAqiDays })
    }
  }

  getDataAQI () {
    const listData = []
    _.forEachRight(this.props.dataSource, (item) => {
       const timeDay = moment(_.get(item, '[0].receivedAt', null)).format('DD/MM/YYYY')
       const total = (60/this.props.dataFrequency) *24
       listData.push({
        timeDay: timeDay,
        totalFile: total,
        totalFileReceivedAt: item.length,
        perFileReceivedAt: _.round(((item.length)/total) * 100, 2)
       })
      })
    console.log(listData)
    return listData
  }


  showTotal = (total, range) => ` ${range[1]}/${total}`
  render() {
    this.getDataAQI()
    return (
      <div>
        <Table
          size="small"
          rowKey="timeDay"
          bordered
          columns={this.getColumns()}
          dataSource = {this.getDataAQI()}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
