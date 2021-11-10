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
import { i18n } from 'containers/api-sharing/constants'
import { getLanguage } from 'utils/localStorage'
import { downFileExcel } from 'utils/downFile'

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
    if (!timeValue || _.isEmpty(timeValue)) {
      validates = [
        ...validates,
        form.setFields({
          [FIELDS.REPORT_TIME]: {
            value: values.reportTime,
            errors: [new Error(i18n().rules.requireChoose)],
          },
        }),
      ]
    }
    const [valueForm, valueTime] = await Promise.all(validates)
    if (!valueForm && !valueTime) return
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
    if (_.isEmpty(timeValue))
      return {
        time: '',
        timeRange: '',
      }
    if (type === 'year') {
      from = moment(timeValue, 'yyyy')
        .startOf('year')
        .format('L')
      to = moment(timeValue, 'yyyy')
        .endOf('year')
        .format('L')
      return {
        time: `${t('report.type2_flow.range.year')} ${moment(
          timeValue,
          'YYYY'
        ).format('YYYY')}`,
        timeRange: `${t('report.type2_flow.range.from')} ${from} ${t(
          'report.type2_flow.range.to'
        )} ${to}`,
      }
    }
    if (type === 'custom') {
      from = timeValue[0].startOf('day').format('L')
      to = timeValue[1].endOf('day').format('L')
      return {
        time: `${from} - ${to}`,
        timeRange: `${t('report.type2_flow.range.from')} ${from} ${t(
          'report.type2_flow.range.to'
        )} ${to}`,
      }
    }
    if (type === 'month') {
      from = timeValue.startOf('month').format('L')
      to = timeValue.endOf('month').format('L')
      return {
        time: `${timeValue.format('MM/YYYY')}`,
        timeRange: `${t('report.type2_flow.range.from')} ${from} ${t(
          'report.type2_flow.range.to'
        )} ${to}`,
      }
    }
    if (type === 'anyYear') {
      from = moment(timeValue[0], 'yyyy')
        .startOf('year')
        .format('L')
      to = moment(timeValue[1], 'yyyy')
        .endOf('year')
        .format('L')
      return {
        time: `${t('report.type2_flow.range.year')} ${moment(
          timeValue[0],
          'YYYY'
        ).format('YYYY')} - ${moment(timeValue[1], 'YYYY').format('YYYY')}`,
        timeRange: `${t('report.type2_flow.range.from')} ${from} ${t(
          'report.type2_flow.range.to'
        )} ${to}`,
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
    const params = this.getQueryParams()
    const time = this.getTime()
    const newParams = { ...params, lang: getLanguage() }
    const results = await DataInsight.exportDataFlow(newParams)
    downFileExcel(results.data, `${t('report.type2_flow.title')} ${time.time}`)
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
            <Col>
              <Button onClick={this.exportExcel} type="primary">
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
