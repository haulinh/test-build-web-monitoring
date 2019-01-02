import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import { autobind } from 'core-decorators'
import { Table } from 'antd'
import * as _ from 'lodash'

@autobind
export default class TableDataList extends React.PureComponent {
  static propTypes = {
    dataAQI: PropTypes.array,
    loading: PropTypes.bool
  }

  getColumns () {
    const childrenValue = []
    for (let index = 0; index < 24; index++) {
      const ti = _.padStart(`${index}`, 2, '0')
      childrenValue.push({
        title: ti,
        align: 'center',
        dataIndex: ti,
        key: ti,
        width: 50
      })
    }
    const colValue = {
      title: translate('statistic.aqi.title'),
      children: childrenValue
    }

    const columns = [
      {
        title: translate('statistic.aqi.time'),
        children: [
          {
            title: translate('statistic.aqi.day'),
            align: 'center',
            dataIndex: 'label',
            key: 'timeDay',
            width: 100,
            render: (value) => {
              return <div>{value}</div>
            }
          }
        ]
      },
      colValue,
      {
        title: 'AQI',
        children: [
          {
            title: translate('statistic.aqi.day'),
            align: 'center',
            dataIndex: 'aqi',
            key: 'AQI',
            width: 100
          }
        ]
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
          dataSource={this.props.dataAQI}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
