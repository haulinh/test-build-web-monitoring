import { Table } from 'antd'
import { DD_MM_YYYY } from 'constants/format-date'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

const i18n = () => ({
  stt: t('billing.table.month.stt'),
  date: t('billing.table.month.date'),
  avgPrice: t('billing.table.month.avgPrice'),
  avgValue: t('billing.table.month.avgValue'),
  price: t('billing.table.month.price'),
  sumPrice: t('billing.table.month.sumPrice'),
  flow: t('billing.table.month.flow'),
  sum: t('billing.table.month.sum'),
})

export default function TableMonth({ resultReport = {} }) {
  const measuringList = _.get(resultReport, ['billingConfig', 'measurings'], [])

  const columns = [
    {
      title: i18n().stt,
      render: (_, __, index) => <div>{index + 1}</div>,
      align: 'center',
    },
    {
      title: i18n().date,
      dataIndex: 'datetime',
      render: value => <div>{moment(value).format(DD_MM_YYYY)}</div>,
      align: 'center',
    },
    {
      title: i18n().flow,
      dataIndex: 'total',
      render: value => <div>{value.flow}</div>,
      align: 'center',
    },
    {
      title: i18n().avgValue,
      align: 'center',
      children: measuringList.map(measure => ({
        title: measure.key,
        dataIndex: 'measure',
        align: 'center',
        render: value => {
          return <div>{_.get(value, `${measure.key}.value`, '-')}</div>
        },
      })),
    },
    {
      title: i18n().price,
      children: measuringList.map(measure => ({
        title: measure.key,
        dataIndex: 'measure',
        align: 'center',
        render: value => {
          return <div>{_.get(value, `${measure.key}.fee`, '-')}</div>
        },
      })),
    },
    {
      title: i18n().sumPrice,
      dataIndex: 'total',
      align: 'center',
      render: value => <div>{value.fee}</div>,
    },
  ]

  const BodyWrapper = props => {
    const renderFooter = () => {
      return (
        <React.Fragment>
          <tr className="ant-table-row">
            <td colSpan="2" style={{ textAlign: 'center' }}>
              <b>{i18n().sum}</b>
            </td>
            <td style={{ textAlign: 'center' }}>
              <b>{_.get(resultReport, ['total', 'fee'], 0)}</b>
            </td>
            <td></td>
          </tr>
        </React.Fragment>
      )
    }

    return (
      <tbody {...props}>
        <React.Fragment>{props.children}</React.Fragment>
        {renderFooter()}
      </tbody>
    )
  }

  return (
    <Table
      bordered
      dataSource={resultReport.data}
      columns={columns}
      pagination={false}
      components={{ body: { wrapper: BodyWrapper } }}
      rowKey={record => record.datetime}
    />
  )
}
