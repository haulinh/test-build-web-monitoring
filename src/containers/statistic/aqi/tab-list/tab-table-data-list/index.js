import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import * as _ from 'lodash'
// import { DD_MM_YYYY } from "constants/format-date";
// import moment from "moment-timezone";
@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataAQI: PropTypes.array,
    loading: PropTypes.bool,
  }

  getColumns() {
    const childrenValue = []
    for (let index = 0; index < 24; index++) {
      const ti = _.padStart(`${index}`, 2, '0')
      childrenValue.push({
        title: ti,
        align: 'center',
        dataIndex: `${ti}.AQI`,
        key: ti,
        width: 50,
      })
    }

    const colValue = {
      title: translate('statistic.aqi.title'),
      children: childrenValue,
    }

    const columns = [
      {
        title: translate('statistic.aqi.time'),
        align: 'center',
        children: [
          {
            title: translate('statistic.aqi.day'),
            align: 'center',
            dataIndex: 'time',
            key: 'time',
            width: 120,
            render: (value, record) => {
              // console.log( moment(value).format(DD_MM_YYYY) )
              // console.log(record,"record")
              return <div>{value}</div>
            },
          },
        ],
      },
      colValue,
      {
        title: 'AQI',
        align: 'center',
        children: [
          {
            title: translate('statistic.aqi.day'),
            align: 'center',
            dataIndex: 'aqiDay',
            key: 'aqiDay',
            width: 70,
          },
        ],
      },
    ]
    return columns
  }

  showTotal = (total, range) => ` ${range[1]}/${total}`
  render() {
    return (
      <div>
        <Table
          size="small"
          bordered
          rowKey="time"
          columns={this.getColumns()}
          dataSource={this.props.dataAQI}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
          scroll={{ x: 1200 }}
        />
      </div>
    )
  }
}
