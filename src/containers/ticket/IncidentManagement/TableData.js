import { Table } from 'antd'
import React from 'react'
import { i18n } from './index'

export const TableData = ({ data }) => {
  const columns = [
    {
      title: '#',
      render: (_, __, index) => <div>{index}</div>,
    },
    {
      title: i18n().name,
      render: () => <div></div>,
    },
    {
      title: i18n().incidentType,
      render: () => <div></div>,
    },
    {
      title: i18n().incidentType,
      render: () => <div></div>,
    },
    {
      title: i18n().incidentType,
      render: () => <div></div>,
    },
    {
      title: i18n().incidentType,
      render: () => <div></div>,
    },
    {
      title: i18n().incidentType,
      render: () => <div></div>,
    },
  ]
  return <Table columns={columns} />
}
