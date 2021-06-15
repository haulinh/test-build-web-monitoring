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
            rowSpan: index === 0 ? 2 : 1,
            colSpan: index === 0 ? 1 : 0,
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
      key: 'time',
    },
    {
      title: i18n.wqiLevel,
      key: 'time',
    }
  ]

  render() {
    const defaultData = [
      {
        name: 'Test',
        time: 1
      },
      {
        name: 'Test',
        time: 2
      },
      {
        name: 'Test'
      },
    ]
    const {dataSource = defaultData} = this.props
    return <Table dataSource={dataSource} columns={this.columns} />
  }
}

export default WQIList
