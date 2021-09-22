import { InputNumber, Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { formatCurrency } from 'utils/string'

const i18n = () => ({
  typeFee: t('billing.table.quarter.typeFee'),
  month: t('billing.table.quarter.month'),
  amountOfWastewater: t('billing.table.quarter.amountOfWastewater'),
  price: t('billing.table.quarter.price'),
  totalFee: t('billing.table.quarter.totalFee'),
  debt: t('billing.table.quarter.debt'),
})

export default function TableQuarter({ resultReport = {}, form }) {
  const fixedFee = _.get(resultReport, 'summary.fixedFee')
  const dataSource = [
    ...(resultReport.data || []),
    {
      extra: true,
      month: `Tổng quý ${moment(resultReport.data[0].month).format('Q')}`,
      fee: _.get(resultReport, 'summary.totalQuaterFee', 0),
      flow: _.get(resultReport, 'summary.totalQuaterFlow', 0),
    },
    {
      extra: true,
      month: 'Trung bình mỗi ngày',
      flow: _.get(resultReport, 'summary.avgFlowPerDate'),
    },
    {
      extra: true,
      month: 'Tổng phí biến đổi trong quý',
      fee: _.get(resultReport, 'summary.totalQuaterFee'),
    },
    {
      extra: true,
      title: 'Phí cố định',
      month: `f/4=${fixedFee}/4 (E)`,
      fee: Math.round(fixedFee / 4),
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
      title: `${i18n().amountOfWastewater} ${`(M³)`}`,
      dataIndex: 'flow',
      render: value => {
        return <div>{value && formatCurrency(Number(value.toFixed(3)))}</div>
      },
      align: 'center',
    },
    {
      title: `${i18n().price} ${`(VNĐ)`}`,
      dataIndex: 'fee',
      align: 'center',
      render: value => <div>{value && formatCurrency(value)}</div>,
    },
  ]

  const debt = form.getFieldValue('debt')
  const totalFee =
    _.get(resultReport, 'summary.totalQuaterFee', 0) +
    fixedFee / 4 +
    (Number(debt) || 0)

  const BodyWrapper = props => {
    const renderFooter = () => {
      return (
        <React.Fragment>
          <tr className="ant-table-row">
            <td colSpan="2" style={{ textAlign: 'center' }}>
              {i18n().debt}
            </td>
            <td colSpan="2">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {form.getFieldDecorator('debt', { trigger: 'onBlur' })(
                  <InputNumber
                    min="1"
                    step="1"
                    formatter={value => value && formatCurrency(value)}
                  />
                )}
              </div>
            </td>
          </tr>
          <tr className="ant-table-row">
            <td colSpan="2" style={{ textAlign: 'center' }}>
              {i18n().totalFee}
            </td>
            <td colSpan="2" style={{ textAlign: 'center' }}>
              {formatCurrency(totalFee)}
            </td>
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
