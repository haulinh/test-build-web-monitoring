import { Form, Row, Col, Button } from 'antd'
import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import Filter from './Filter'
import moment from 'moment'
import _ from 'lodash'
import { getTimeUTC } from 'utils/datetime/index'
import DataInsight from 'api/DataInsight'
import { TableAnyYears, TableDate, TableYear } from './TableData'
import TableMonth from './TableData/TableMonth'
import { translate as t } from 'hoc/create-lang'
import { getLanguage } from 'utils/localStorage'
import { downFileExcel } from 'utils/downFile'
import protectRole from 'hoc/protect-role/forMenu'
import ROLE from 'constants/role'

export const FIELDS = {
  REPORT_TYPE: 'reportType',
  PROVINCE: 'reportProvince',
  REPORT_TIME: 'reportTime',
  STATION_AUTO: 'stationKeys',
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_NAME: 'stationName',
  FILTER_DATA: 'isFilter',
}
@Form.create()
@protectRole(ROLE.REPORT_FLOW.VIEW)
export default class ReportFlow extends React.Component {
  state = {
    data: [],
    loading: false,
    time: [],
  }
  getQueryParamsGeneral = () => {
    const { form } = this.props
    const values = form.getFieldsValue()

    const params = {
      ...values,
      [FIELDS.STATION_AUTO]: values[FIELDS.STATION_AUTO].join(','),
      [FIELDS.MEASURING_LIST]: values[FIELDS.MEASURING_LIST],
    }
    return params
  }

  getQueryParamsDate = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const {
      reportTime,
      stationType,
      reportProvince,
      ...newParams
    } = paramsGeneral

    const params = {
      ...newParams,
      from: getTimeUTC(
        paramsGeneral[FIELDS.REPORT_TIME].value[0].startOf('day')
      ),
      to: getTimeUTC(paramsGeneral[FIELDS.REPORT_TIME].value[1].endOf('day')),
    }
    return params
  }

  getQueryParamsMonth = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const {
      reportTime,
      stationType,
      reportProvince,
      ...newParams
    } = paramsGeneral
    const params = {
      ...newParams,
      from: getTimeUTC(
        paramsGeneral[FIELDS.REPORT_TIME].value.startOf('month')
      ),
      to: getTimeUTC(paramsGeneral[FIELDS.REPORT_TIME].value.endOf('month')),
    }
    return params
  }

  getQueryParamsYear = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const {
      reportTime,
      stationType,
      reportProvince,
      ...newParams
    } = paramsGeneral
    const params = {
      ...newParams,
      from: getTimeUTC(
        moment(paramsGeneral[FIELDS.REPORT_TIME].value, 'yyyy').startOf('year')
      ),
      to: getTimeUTC(
        moment(paramsGeneral[FIELDS.REPORT_TIME].value, 'yyyy').endOf('year')
      ),
    }
    return params
  }

  getParamsRangeYear = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const {
      reportTime,
      stationType,
      reportProvince,
      ...newParams
    } = paramsGeneral
    const params = {
      ...newParams,
      from: getTimeUTC(
        moment(paramsGeneral[FIELDS.REPORT_TIME].value[0], 'yyyy').startOf(
          'year'
        )
      ),
      to: getTimeUTC(
        moment(paramsGeneral[FIELDS.REPORT_TIME].value[1], 'yyyy').endOf('year')
      ),
    }
    return params
  }
  getQueryParams = async () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const timeValue = values[FIELDS.REPORT_TIME].value
    let validates = [form.validateFields()]
    const typeReport = values[FIELDS.REPORT_TYPE]

    if (
      !timeValue ||
      (['custom', 'anyYear'].includes(typeReport) && _.isEmpty(timeValue))
    ) {
      validates = [
        ...validates,
        form.setFields({
          [FIELDS.REPORT_TIME]: {
            value: values.reportTime,
            errors: [new Error(t('avgSearchFrom.form.rangesDate.error'))],
          },
        }),
      ]
    }
    const [valueForm] = await Promise.all(validates)
    if (!valueForm || _.isEmpty(timeValue)) return

    const type = values[FIELDS.REPORT_TYPE]
    const queryParams = {
      custom: this.getQueryParamsDate,
      month: this.getQueryParamsMonth,
      year: this.getQueryParamsYear,
      anyYear: this.getParamsRangeYear,
    }
    return queryParams[type]()
  }

  getTime() {
    const { form } = this.props
    const values = form.getFieldsValue()
    if (!values) return
    const type = values[FIELDS.REPORT_TYPE]
    const timeValue = _.get(values, 'reportTime.value')
    let to, from
    const i18n = {
      from: t('report.type2_flow.range.from'),
      to: t('report.type2_flow.range.to'),
      day: t('report.type2_flow.range.day'),
      month: t('report.type2_flow.range.month'),
      year: t('report.type2_flow.range.year'),
      byDay: t('report.type2_flow.by.byDay'),
      mutipleYear: t('report.type2_flow.by.mutipleYear'),
    }
    if (_.isEmpty(timeValue))
      return {
        time: '',
        timeRange: '',
      }
    if (type === 'year') {
      from = moment(timeValue, 'yyyy')
        .startOf('year')
        .format('MM/YYYY')
      to = moment(timeValue, 'yyyy')
        .endOf('year')
        .format('MM/YYYY')
      return {
        time: `${i18n.year} ${moment(timeValue, 'YYYY').format('YYYY')}`,
        timeRange: `${i18n.from} ${i18n.month} ${from} ${i18n.to} ${i18n.month} ${to}`,
      }
    }
    if (type === 'custom') {
      from = timeValue[0].startOf('day').format('L')
      to = timeValue[1].endOf('day').format('L')
      return {
        time: i18n.byDay,
        timeRange: `${i18n.from} ${i18n.day} ${from} ${i18n.to} ${i18n.day} ${to}`,
      }
    }
    if (type === 'month') {
      from = timeValue.startOf('month').format('L')
      to = timeValue.endOf('month').format('L')
      return {
        time: `${t('report.type2_flow.option.month')} ${timeValue.format(
          'MM/YYYY'
        )}`,
        timeRange: `${i18n.from} ${i18n.day} ${from} ${i18n.to} ${i18n.day} ${to}`,
      }
    }
    if (type === 'anyYear') {
      from = moment(timeValue[0], 'yyyy')
        .startOf('year')
        .format('YYYY')
      to = moment(timeValue[1], 'yyyy')
        .endOf('year')
        .format('YYYY')
      return {
        time: i18n.mutipleYear,
        timeRange: `${i18n.from} ${i18n.year} ${from} ${i18n.to} ${i18n.year} ${to}`,
      }
    }
  }
  handleOnSearch = async () => {
    const params = await this.getQueryParams()
    const time = this.getTime()

    this.setState({
      time: time,
    })

    try {
      this.setState({ loading: true })
      const results = await DataInsight.getDataFlow(params)
      this.setState({
        data: results,
        loading: false,
      })
    } catch (error) {
      this.setState({
        loading: false,
      })
    }
  }

  exportExcel = async () => {
    const { form } = this.props
    await form.validateFields()
    const params = await this.getQueryParams()
    const { from, to, reportType } = params
    const newParams = { ...params, lang: getLanguage() }
    const results = await DataInsight.exportDataFlow(newParams)
    const titleName = t('report.type2_flow.title')
    const range = {
      day: t('report.type2_flow.range.day'),
      month: t('report.type2_flow.range.month'),
      year: t('report.type2_flow.range.year'),
    }
    const dynamicNameFile = {
      custom: `${titleName} ${range.day}_${moment(from).format(
        'DDMMYYYY'
      )}_${moment(to).format('DDMMYYYY')}`,
      month: `${titleName} ${range.month}_${moment(to).format('MMYYYY')}`,
      year: `${titleName} ${range.year}_${moment(to).format('YYYY')}`,
      anyYear: `${titleName} ${t(range.year)}_${moment(from).format(
        'YYYY'
      )}_${moment(to).format('YYYY')}`,
    }
    downFileExcel(results.data, dynamicNameFile[reportType])
  }

  render() {
    const { form } = this.props
    const { loading, data, time } = this.state

    const Report = {
      custom: <TableDate data={data} loading={loading} />,
      year: <TableYear data={data} loading={loading} />,
      month: <TableMonth data={data} loading={loading} />,
      anyYear: <TableAnyYears data={data} loading={loading} />,
      undefined: <React.Fragment />,
    }

    const type = form.getFieldValue(FIELDS.REPORT_TYPE)

    return (
      <PageContainer>
        <div style={{}}>
          <Breadcrumb items={['type2_flow']} />
          <Clearfix height={16} />
          <Search onSearch={this.handleOnSearch} loading={loading}>
            <BoxShadow>
              <Filter form={form} />
            </BoxShadow>
          </Search>
          <Clearfix height={32} />

          <Row type="flex" justify="end">
            {protectRole(ROLE.REPORT_FLOW.EXPORT)(
              <Col>
                <Button onClick={this.exportExcel} type="primary">
                  {t('billing.button.exportReport')}
                </Button>
              </Col>
            )}
          </Row>

          <Row type="flex" justify="center" align="center">
            <Col span={24}>
              <div
                style={{
                  fontSize: '20px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {t('report.type2_flow.title')} {time.time}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  textAlign: 'center',
                }}
              >
                {t('report.type2_flow.subTitle')} {time.timeRange}
              </div>
            </Col>
          </Row>
          <Clearfix height={50} />
          {Report[type]}
        </div>
        <Clearfix height={50} />
      </PageContainer>
    )
  }
}
