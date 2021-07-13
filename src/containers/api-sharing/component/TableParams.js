import { Table } from 'antd'
import React from 'react'
import { i18n } from '../constants'
import { Header } from '../layout/styles'

export default function TableParams({ form }) {
  const fields = Object.keys(form.getFieldsValue().config)

  const dataSource = fields
    .filter(field => field !== 'rangeTime')
    .map(field => ({
      fieldName: field,
      type: i18n.types[field] || field,
      description: i18n.description[field] || field,
    }))

  const columns = [
    {
      dataIndex: 'fieldName',
      title: i18n.detailPage.label.field,
      render: value => <div>{value}</div>,
    },
    {
      dataIndex: 'type',
      title: i18n.detailPage.label.type,
      render: value => <div>{value}</div>,
    },
    {
      dataIndex: 'description',
      title: i18n.detailPage.label.description,
      render: value => <div>{value}</div>,
    },
  ]

  return (
    <React.Fragment>
      <Header>{i18n.detailPage.header.parameter}</Header>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </React.Fragment>
  )
}
