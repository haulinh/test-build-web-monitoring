import { Table, Tabs } from 'antd'
import { HH_MM_DD_MM_YYYY } from 'constants/format-date'
import moment from 'moment'
import React from 'react'

const { TabPane } = Tabs

const valueMapKey = {
  dataType: {
    Dinh_trieu: 'Đỉnh triều',
    Chan_trieu: 'Chân triều',
  },
  dataSource: {
    Du_lieu_du_bao: 'Dữ liệu dự báo',
    Du_lieu_that: 'Dữ liệu thực tế',
  },
}

const i18n = {
  date: 'Ngày',
  dataType: 'Kiểu dữ liệu',
  measureValue: 'Mực nước',
  alarmLevelI: 'Cấp báo động I',
  alarmLevelII: 'Cấp báo động II',
  alarmLevelIII: 'Cấp báo động III',
  dataSource: 'Nguồn dữ liệu',
}

const TableStation = ({ data, loading }) => {
  const columns = [
    {
      title: '#',
      render: (value, _, index) => {
        return <div>{index + 1}</div>
      },
    },
    {
      title: i18n.date,
      dataIndex: 'createdAt',
      render: value => {
        return <div>{moment(value).format(HH_MM_DD_MM_YYYY)}</div>
      },
    },
    {
      title: i18n.dataType,
      dataIndex: 'dataType',
      render: value => {
        return <div>{valueMapKey.dataType[value]}</div>
      },
    },
    {
      title: i18n.measureValue,
      dataIndex: 'measureValue',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelI,
      dataIndex: 'alarmLevelI',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelII,
      dataIndex: 'alarmLevelII',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelIII,
      dataIndex: 'alarmLevelIII',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelIII,
      dataIndex: 'dataSource',
      render: value => {
        return <div>{valueMapKey.dataSource[value]}</div>
      },
    },
  ]

  return (
    <Table
      columns={columns}
      loading={loading}
      dataSource={data}
      pagination={false}
    />
  )
}

export default function TabResult({ data, loading }) {
  const tabs = Object.keys(data)
  return (
    <div>
      <Tabs>
        {tabs.map(tabKey => (
          <TabPane tab={data[tabKey].station.name} key={tabKey}>
            <TableStation data={data[tabKey].data} loading={loading} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
