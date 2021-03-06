import { Button, Col, Empty, Form, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import Clearfix from 'components/elements/clearfix'
import ModalLangExport from 'components/elements/modal-lang-export'
import { Search } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import ROLE from 'constants/role'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import { translate as t } from 'hoc/create-lang'
import {
  default as createProtectRole,
  default as protectRole,
} from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { downFileExcel } from 'utils/downFile'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'
import TableMonth from './result/TableMonth'
import TableQuarter from './result/TableQuarter'
import createLanguage from 'hoc/create-lang'
import { i18n } from './constants'

@createProtectRole(ROLE.BILLING_REPORT.VIEW)
@Form.create()
@createLanguage
export default class BillingReport extends Component {
  state = {
    resultReport: {},
    loading: false,
    visableModal: false,
    langExport: 'vi',
  }

  getQueryParams = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    const time = _.get(values, 'time.value')
    if (
      !time ||
      (values.reportType === 'quarter' && _.isEmpty(time)) ||
      (values.reportType === 'custom' &&
        (!Array.isArray(time) || _.isEmpty(time)))
    ) {
      form.setFields({
        time: {
          value: _.get(values, 'time'),
          errors: [new Error(i18n().time.required)],
        },
      })
      return
    }

    if (values.reportType === 'custom' && values.time.type === 'quarter') {
      const quarter1 = values.time.value[0].format('YYYY-Q')
      const quarter2 = values.time.value[1].format('YYYY-Q')
      if (quarter1 !== quarter2) {
        form.setFields({
          time: {
            value: {
              type: 'quarter',
            },
            errors: [new Error(i18n().time.sameQuarter)],
          },
        })
        return
      }
    }

    if (!values) return

    let from, to

    if (values.reportType === 'month') {
      from = values.time.value
        .clone()
        .startOf('month')
        .toDate()
      to = values.time.value
        .clone()
        .endOf('month')
        .toDate()
    } else if (values.reportType === 'quarter') {
      const date = moment(values.time.value, 'YYYY-Q')
      from = date.startOf('quarter').toDate()
      to = date.endOf('quarter').toDate()
    } else if (
      values.reportType === 'custom' &&
      values.time.type === 'quarter'
    ) {
      from = values.time.value[0].startOf('month').toDate()
      to = values.time.value[1].endOf('month').toDate()
      console.log('field quarter')
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
    const {
      lang: { translateManual },
    } = this.props
    const params = await this.getQueryParams()
    const result = await CalculateApi.exportReportBilling({
      ...params,
      lang: this.state.langExport,
    })
    const { from, to } = this.getTimes()
    downFileExcel(
      result.data,
      `${translateManual(
        'billing.title.name',
        null,
        null,
        this.state.langExport
      )} ${from} - ${to}`
    )
    this.setState({
      visableModal: false,
    })
  }

  handleOkModal = e => {
    this.setState({
      visableModal: true,
    })
  }

  handleCancelModal = e => {
    this.setState({
      visableModal: false,
    })
  }

  onChangeModal = e => {
    this.setState({
      langExport: e.target.value,
    })
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
      return { from, to }
    }

    if (values.reportType === 'quarter') {
      const date = moment(values.time.value, 'YYYY-Q')
      from = date.startOf('quarter').format(DD_MM_YYYY)
      to = date.endOf('quarter').format(DD_MM_YYYY)
      return { from, to }
    }

    if (!Array.isArray(_.get(values, 'time.value'))) return { from, to }
    from = values.time.value[0].format(DD_MM_YYYY)
    to = values.time.value[1].format(DD_MM_YYYY)
    return { from, to }
  }

  getDetailTitle = () => {
    const { form } = this.props
    const { from, to } = this.getTimes()
    const values = form.getFieldsValue()
    let time = ''
    if (
      !values.time.value ||
      (values.reportType === 'custom' && !Array.isArray(values.time.value))
    )
      return time

    if (values.reportType === 'month') {
      time = t('billing.title.reportMonth', {
        param: values.time.value.format('M'),
      })

      const startTitle = t('billing.title.detail', { time, from, to })
      return startTitle
    }

    if (values.reportType === 'quarter') {
      time = t('billing.title.reportQuarter', {
        param: moment(values.time.value, 'YYYY-Q').format('Q'),
      })

      const startTitle = t('billing.title.detail', { time, from, to })
      return startTitle
    }

    time = `qu?? ${values.time.value[0].format('Q')}`
    if (values.time.type === 'month')
      time = t('billing.title.reportMonth', {
        param: values.time.value[0].format('Q'),
      })

    const startTitle = t('billing.title.detail', { time, from, to })
    return startTitle
  }

  setResultReport = resultReport => {
    this.setState({ resultReport })
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
            <Filter form={form} setResultReport={this.setResultReport} />
          </BoxShadow>
        </Search>
        <Clearfix height={32} />

        {protectRole(ROLE.BILLING_REPORT.EXPORT)(
          <Row type="flex" justify="end">
            <Col>
              <Button onClick={this.handleOkModal} type="primary">
                {t('billing.button.exportReport')}
              </Button>
            </Col>
          </Row>
        )}

        <Row type="flex" justify="center" align="center">
          <Col span={24}>
            <div
              style={{
                fontSize: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {t('billing.title.name')}
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
        <ModalLangExport
          showModal={this.state.visableModal}
          handleOkModal={this.handleExportBilling}
          handleCancelModal={this.handleCancelModal}
          onChangeModal={this.onChangeModal}
          langExport={this.state.langExport}
        />
        {_.isEmpty(resultReport.data) ? (
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
