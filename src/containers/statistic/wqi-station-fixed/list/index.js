import {Table} from 'antd';
import React from 'react';
import {translate as t} from 'hoc/create-lang';

const i18n = {
  pointName: t('wqiStationFix.pointName'),
  avgTime: t('wqiStationFix.avgTime'),
  wqiValue: t('wqiStationFix.wqiValue'),
  wqiLevel: t('wqiStationFix.wqiLevel'),
}

class WQIList extends React.Component {
  columns = [
    {
      title: i18n.pointName,
      key: 'name',
      render: (_, record, index) => {
        const obj = {
          children: record.name,
          props: {
            rowSpan: record.size ? record.size : 1,
            colSpan: record.size ? 1 : 0,
          }
        }
        return obj
      }
    },
    {
      title: i18n.avgTime,
      key: 'time',
      dataIndex: 'time'
    },
    {
      title: i18n.wqiValue,
      key: 'wqi',
      dataIndex: 'wqi'
    },
    {
      title: i18n.wqiLevel,
      key: 'status',
    }
  ]

  render() {

    const {dataSource = []} = this.props

    const sizes = dataSource.reduce((prev, item) => ({
      ...prev, 
      [item.name]: (prev[item.name] || 0) + 1 
    }), {})

    const processData = dataSource.map((item, idx) => {
      if (!dataSource[idx - 1] || item.name != dataSource[idx - 1].name) {
        return {...item, size: sizes[item.name]}
      }
      return item
    })

    return (
      <Table
        bordered
        rowKey={(record) => `${record.name}_${record.time}`}
        dataSource={processData}
        columns={this.columns}
      />
    )
  }
}

export default WQIList
