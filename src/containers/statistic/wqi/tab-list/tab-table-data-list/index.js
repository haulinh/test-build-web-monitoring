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
    dataWQI: PropTypes.array,
    loading: PropTypes.bool
  }

  getColumns() {
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
        title: translate('statistic.wqi.time'),
        children:[
          {
            title: translate('statistic.wqi.day'),
            align:'center',
            dataIndex: 'label',
            key: 'timeDay',
            width: 100
          }
        ]
      },
      colValue
    ]
    return columns
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataWQI, this.props.dataWQI)) {
      this.setState({ dataWQI: nextProps.dataWQI })
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
          dataSource={_.orderBy(this.props.dataWQI, 'label')}
          pagination={{ showTotal: this.showTotal }}
          loading={this.props.loading}
          locale={{ emptyText: translate('dataSearchFrom.table.emptyText') }}
        />
      </div>
    )
  }
}
