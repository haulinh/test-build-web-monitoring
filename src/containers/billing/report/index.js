import { Button, Col, Empty, Form, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import { translate as t } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import React, { Component } from 'react'
import { downFileExcel } from 'utils/downFile'
import { getLanguage } from 'utils/localStorage'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'
import TableMonth from './result/TableMonth'
import TableQuarter from './result/TableQuarter'
import { DD_MM_YYYY } from 'constants/format-date'

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
      debt: values.debt,
      from,
      to,
    }

    return params
  }

  handleExportBilling = async () => {
    const params = await this.getQueryParams()
    const result = await CalculateApi.exportReportBilling({
      ...params,
      lang: getLanguage(),
    })
    const { from, to } = this.getTimes()
    downFileExcel(result.data, `${t('billing.title.name')} ${from} - ${to}`)
  }

  handleOnSearch = async () => {
    const params = await this.getQueryParams()

    try {
      this.setState({ loading: true })
      const result = await CalculateApi.getReportBilling(params)
      this.setState({ resultReport: result, loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  getTimes = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    let from = '',
      to = ''

    if (!_.get(values, 'time.value')) return { from, to }

    if (values.reportType === 'month') {
      from = values.time.value.startOf('month').format(DD_MM_YYYY)
      to = values.time.value.endOf('month').format(DD_MM_YYYY)
    } else {
      if (!Array.isArray(_.get(values, 'time.value'))) return { from, to }
      from = values.time.value[0].format(DD_MM_YYYY)
      to = values.time.value[1].format(DD_MM_YYYY)
    }
    return { from, to }
  }

  getDetailTitle = () => {
    const { form } = this.props
    const { from, to } = this.getTimes()
    const values = form.getFieldsValue()
    let time = ''
    if (values.reportType === 'month') {
      time = `tháng ${values.time.value.format('M')}`
    } else {
      if (!Array.isArray(_.get(values, 'time.value'))) return time
      time = `quý ${values.time.value[0].format('Q')}`
      if (values.time.type === 'month')
        time = `tháng ${values.time.value[0].format('Q')}`
    }
    const startTitle = t('billing.title.detail', { time, from, to })
    return startTitle
  }

  render() {
    const { form } = this.props
    const { loading, resultReport } = this.state

    const { time: { type, value: timeValue } = {} } =
      form.getFieldsValue() || {}

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
            <Button onClick={this.handleExportBilling} type="primary">
              {t('billing.button.exportReport')}
            </Button>
          </Col>
        </Row>
        <Row type="flex" justify="center" align="center">
          <Col span={24}>
            <div
              style={{
                fontSize: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {t('billing.title.name')}{' '}
            </div>
          </Col>
          {!_.isEmpty(timeValue) && (
            <Col span={24}>
              <div style={{ fontSize: '16px', textAlign: 'center' }}>
                {this.getDetailTitle()}
              </div>
            </Col>
          )}
        </Row>
        <Clearfix height={16} />
        {_.isEmpty(resultReport) ? (
          <Empty
            style={{ margin: '0 auto', padding: '8px 16px' }}
            description={t('apiSharingNew.button.nodata')}
          />
        ) : (
          Result[type]
        )}
      </PageContainer>
    )
  }
}
