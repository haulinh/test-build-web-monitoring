import { Form, Row, Col, Button } from 'antd'
import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import Filter from './Filter'
import moment from 'moment'
import { getTimeUTC } from 'utils/datetime/index'
import DataInsight from 'api/DataInsight'
import { TableAnyYears, TableDate, TableYear } from './TableData'

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
    const { reportTime, reportProvince, ...newParams } = paramsGeneral

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
    const { reportTime, reportProvince, ...newParams } = paramsGeneral
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
    const { reportTime, reportProvince, ...newParams } = paramsGeneral
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
    const { reportTime, reportProvince, ...newParams } = paramsGeneral
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

  getQueryParams = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
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
    const type = values[FIELDS.REPORT_TYPE]
    let from, to
    if (!type) return
    if (type === 'year') {
      from = moment(values[FIELDS.REPORT_TIME].value, 'yyyy')
        .startOf('year')
        .format('L')
      to = moment(values[FIELDS.REPORT_TIME].value, 'yyyy')
        .endOf('year')
        .format('L')
      return {
        time: `NĂM ${values[FIELDS.REPORT_TIME].value}`,
        timeRanger: `${from} đến ${to}`,
      }
    }
    if (type === 'custom') {
      from = values[FIELDS.REPORT_TIME].value[0].startOf('day').format('L')
      to = values[FIELDS.REPORT_TIME].value[1].endOf('day').format('L')
      return {
        time: `TỪ NGÀY ${from} - ${to}`,
        timeRanger: `${from} đến ${to}`,
      }
    }
    if (type === 'month') {
      from = values[FIELDS.REPORT_TIME].value.startOf('month').format('L')
      to = values[FIELDS.REPORT_TIME].value.endOf('month').format('L')
      return {
        time: `THÁNG ${values[FIELDS.REPORT_TIME].value.format('MM')}`,
        timeRanger: `${from} đến ${to}`,
      }
    }
    if (type === 'anyYear') {
      from = moment(values[FIELDS.REPORT_TIME].value[0], 'yyyy')
        .startOf('year')
        .format('L')
      to = moment(values[FIELDS.REPORT_TIME].value[1], 'yyyy')
        .endOf('year')
        .format('L')
      return {
        time: `TỪ NĂM ${values[FIELDS.REPORT_TIME].value[0]} - ${
          values[FIELDS.REPORT_TIME].value[1]
        }`,
        timeRanger: `${from} đến ${to}`,
      }
    }
  }

  handleOnSearch = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    if (!values) return
    const params = this.getQueryParams()
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

  render() {
    const { form } = this.props
    const { loading, data, time } = this.state

    const Report = {
      custom: <TableDate data={data} loading={loading} />,
      year: <TableYear data={data} loading={loading} />,
      anyYear: <TableAnyYears data={data} loading={loading} />,
      undefined: <React.Fragment />,
    }

    const type = form.getFieldValue(FIELDS.REPORT_TYPE)

    return (
      <PageContainer>
        <div style={{ height: '100vh' }}>
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
              <Button onClick={this.handleExportBilling} type="primary">
                Xuất báo cáo
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
                BÁO CÁO LƯU LƯỢNG PHÁT THẢI {time.time}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  textAlign: 'center',
                  marginBottom: '50px',
                }}
              >
                Các số liệu được thống kê theo từ {time.timeRanger}
              </div>
            </Col>
          </Row>
          {Report[type]}
        </div>
      </PageContainer>
    )
  }
}
