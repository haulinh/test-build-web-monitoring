import { Table, Tabs } from 'antd'
import { DD_MM_YYYY_HH_MM, HH_MM_DD_MM_YYYY } from 'constants/format-date'
import _ from 'lodash'
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

const TableStation = ({ data, station, loading }) => {
  const measure = _.get(station, 'measuringList[0].name', '')
  const unit = _.get(station, 'measuringList[0].unit', '')
  const columns = [
    {
      title: '#',
      render: (value, _, index) => {
        return <div>{index + 1}</div>
      },
    },
    {
      title: i18n.date,
      dataIndex: 'datetime',
      render: value => {
        return <div>{moment(value).format(DD_MM_YYYY_HH_MM)}</div>
      },
    },
    {
      title: i18n.dataType,
      align: 'center',
      dataIndex: 'dataType',
      render: value => {
        return <div>{valueMapKey.dataType[value]}</div>
      },
    },
    {
      title: `${measure} ${unit && `(${unit})`}`,
      align: 'center',
      dataIndex: 'measureValue',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelI,
      align: 'center',
      dataIndex: 'alarmLevelI',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelII,
      align: 'center',
      dataIndex: 'alarmLevelII',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.alarmLevelIII,
      align: 'center',
      dataIndex: 'alarmLevelIII',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.dataSource,
      align: 'center',
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
            <TableStation
              data={data[tabKey].data}
              station={data[tabKey].station}
              loading={loading}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
