import { Button, Table, Tabs, Empty } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

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
  date: t('apiSharingNew.detailPage.table.date'),
  dataType: t('apiSharingNew.detailPage.table.dataType'),
  measureValue: t('apiSharingNew.detailPage.table.measureValue'),
  alarmLevelI: t('apiSharingNew.detailPage.table.alarmLevelI'),
  alarmLevelII: t('apiSharingNew.detailPage.table.alarmLevelII'),
  alarmLevelIII: t('apiSharingNew.detailPage.table.alarmLevelIII'),
  dataSource: t('apiSharingNew.detailPage.table.dataSource'),
  nodata: t('apiSharingNew.detailPage.table.nodata'),
  exportData: t('apiSharingNew.detailPage.table.exportData'),
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
      defaultSortOrder: 'ascend',
      sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
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

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={i18n.nodata}
      />
    )
  }

  return (
    <Table
      columns={columns}
      loading={loading}
      dataSource={data}
      pagination={false}
    />
  )
}

export default function TabResult({ data, loading, exportData }) {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={i18n.nodata}
      />
    )
  }

  const tabs = Object.keys(data)
  return (
    <div>
      <Tabs
        tabBarExtraContent={
          <Button type="primary" onClick={exportData} icon="file-excel">
            {i18n.exportData}
          </Button>
        }
      >
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
