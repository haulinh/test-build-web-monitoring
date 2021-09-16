import { Button, Col, Form, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import { translate as t } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'
import TableMonth from './result/TableMonth'
import TableQuarter from './result/TableQuarter'

export const Fields = {
  stationType: 'stationType',
  stationKey: 'stationKey',
  reportType: 'reportType',
  billingConfigId: 'billingConfigId',
  time: 'time',
}

export const i18n = {
  reportType: {
    label: t('billing.label.reportType'),
  },
  time: {
    label: t('billing.label.time'),
  },
  stationType: {
    label: t('billing.label.stationType'),
  },
  stationName: {
    label: t('billing.label.stationName'),
  },
  billingConfig: {
    label: t('billing.label.billingConfig'),
  },
}

@Form.create()
export default class BillingReport extends Component {
  state = {
    resultReport: {},
    loading: false,
  }

  getQueryParams = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    let from, to

    if (values.reportType === 'month') {
      from = values.time.value.startOf('month').toDate()
      to = values.time.value.endOf('month').toDate()
    } else {
      from = values.time.value[0].toDate()
      to = values.time.value[1].toDate()
    }

    const params = {
      stationKey: values.stationKey,
      billingConfigId: values.billingConfigId,
      reportType: values.time.type,
      from,
      to,
    }

    return params
  }

  handleOnSearch = async () => {
    const params = await this.getQueryParams()

    console.log({ params })

    try {
      this.setState({ loading: true })
      const result = await CalculateApi.getReportBilling(params)
      this.setState({ resultReport: result, loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { form } = this.props
    const { loading, resultReport } = this.state

    const { time: { type } = {} } = form.getFieldsValue() || {}

    const Result = {
      month: <TableMonth resultReport={resultReport} />,
      quarter: <TableQuarter resultReport={resultReport} form={form} />,
    }

    return (
      <PageContainer>
        <Clearfix height={16} />
        <Breadcrumb items={['report']} />
        <Search loading={loading} onSearch={this.handleOnSearch}>
          <BoxShadow>
            <Filter form={form} />
          </BoxShadow>
        </Search>
        <Clearfix height={32} />
        <Row type="flex" justify="end">
          <Col>
            <Button type="primary">Click</Button>
          </Col>
        </Row>
        <Clearfix height={16} />
        {Result[type]}
      </PageContainer>
    )
  }
}
