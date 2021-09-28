import { Table } from 'antd'
import React from 'react'
import { i18n, incidentType } from './index'
import { translate as t } from 'hoc/create-lang'

export const TableData = ({ data }) => {
  const columns = [
    {
      title: '#',
      render: (_, __, index) => <div>{index}</div>,
    },
    {
      dataIndex: 'name',
      title: i18n().name,
      render: value => <div>{value}</div>,
    },
    {
      dataIndex: 'type',
      title: i18n().incidentType,
      render: value => <div>{incidentType()[value]}</div>,
    },
    {
      title: i18n().stationName,
      render: () => <div></div>,
    },
    {
      title: t('menuApp.config.stationAuto'),
      render: () => <div></div>,
    },
    {
      title: t('userManager.list.status'),
      render: () => <div></div>,
    },
    {
      title: t('avgSearchFrom.selectTimeRange.startTime'),
      render: () => <div></div>,
    },
    {
      title: t('avgSearchFrom.selectTimeRange.endTime'),
      render: () => <div></div>,
    },
  ]

  return <Table columns={columns} dataSource={data} />
}
