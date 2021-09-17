import { InputNumber, Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'

const i18n = () => ({
  typeFee: t('billing.table.quarter.typeFee'),
  month: t('billing.table.quarter.month'),
  amountOfWastewater: t('billing.table.quarter.amountOfWastewater'),
  price: t('billing.table.quarter.price'),
  totalFee: t('billing.table.quarter.totalFee'),
  debt: t('billing.table.quarter.debt'),
})

export default function TableQuarter({ resultReport = {}, form }) {
  const dataSource = [
    ...(resultReport.data || []),
    {
      extra: true,
      month: 'Tổng quí',
      flow: _.get(resultReport, 'summary.totalQuaterFlow'),
    },
    {
      extra: true,
      month: 'Trung bình mỗi ngày',
      flow: _.get(resultReport, 'summary.avgFeePerDate'),
    },
    {
      extra: true,
      month: 'Tổng phí biến đổi trong quý',
      flow: _.get(resultReport, 'summary.totalQuaterFee'),
    },
    {
      extra: true,
      title: 'Phí cố định',
      month: 'f/4',
      flow: _.get(resultReport, 'summary.fixedFee'),
    },
  ]
  const columns = [
    {
      title: i18n().typeFee,
      dataIndex: 'title',
      render: (value, row, index) => {
        const obj = {
          children: value ? value : 'Phí biến đổi',
          props: {},
        }

        const rowSpan = _.get(resultReport, 'data.length', 0) + 3

        if (index === 0) {
          obj.props.rowSpan = rowSpan
        }

        if (index > 0 && index < rowSpan) {
          obj.props.rowSpan = 0
        }

        return obj
      },
      align: 'center',
    },
    {
      title: i18n().month,
      dataIndex: 'month',
      render: (value, record) => (
        <div>{record.extra ? value : moment(value).format('M')}</div>
      ),
      align: 'center',
    },
    {
      title: i18n().amountOfWastewater,
      dataIndex: 'flow',
      render: value => <div>{value}</div>,
      align: 'center',
    },
    {
      title: i18n().price,
      dataIndex: 'fee',
      align: 'center',
      render: value => <div>{value}</div>,
    },
  ]

  const debt = form.getFieldValue('debt')

  const BodyWrapper = props => {
    const renderFooter = () => {
      return (
        <React.Fragment>
          <tr className="ant-table-row">
            <td colSpan="2" style={{ textAlign: 'center' }}>
              {i18n().debt}
            </td>
            <td>
              {form.getFieldDecorator('debt', { trigger: 'onBlur' })(
                <InputNumber style={{ width: '100%' }} />
              )}
            </td>
            <td></td>
          </tr>
          <tr className="ant-table-row">
            <td colSpan="2" style={{ textAlign: 'center' }}>
              {i18n().totalFee}
            </td>
            <td style={{ textAlign: 'center' }}>
              {_.get(resultReport, 'summary.totalFee', 0) + (debt || 0)}
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
    <React.Fragment>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        components={{ body: { wrapper: BodyWrapper } }}
        rowKey={record => record.month}
      />
    </React.Fragment>
  )
}
