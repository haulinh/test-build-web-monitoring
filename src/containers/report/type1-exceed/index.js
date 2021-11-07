import { Button, Col, Form, Row } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment'
import React, { Component } from 'react'
import { getTimeUTC } from 'utils/datetime'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'
import { TableDate, TableYear } from './TableData'

export const FIELDS = {
  REPORT_TYPE: 'reportType',
  TIME: 'time',
  PROVINCE: 'province',
  STATION_KEY: 'stationKeys',
  SELECT_TIME: 'selectTime',
  IS_FILTER: 'isFilter',
}

@Form.create()
export default class ReportExceed extends Component {
  state = {
    data: [],
    loading: false,
  }

  getQueryParams = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const type = values.reportType
    const queryParams = {
      year: this.getQueryParamsYear,
      date: this.getQueryParamsDate,
    }
    return queryParams[type]()
  }

  getQueryParamsGeneral = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const params = {
      ...values,
      [FIELDS.IS_FILTER]: values[FIELDS.IS_FILTER],
      [FIELDS.STATION_KEY]: values.stationKeys.join(','),
    }
    return params
  }

  getQueryParamsYear = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const params = {
      ...paramsGeneral,
      [FIELDS.TIME]: getTimeUTC(
        moment(paramsGeneral[FIELDS.TIME].value, 'YYYY').startOf('year')
      ),
    }
    return params
  }

  getQueryParamsDate = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const params = {
      ...paramsGeneral,
      [FIELDS.TIME]: getTimeUTC(paramsGeneral[FIELDS.TIME].value),
    }
    return params
  }

  handleOnSearch = async () => {
    const params = await this.getQueryParams()
    try {
      this.setState({ loading: true })
      const results = await DataInsight.getExceedData(params.reportType, params)
      this.setState({ data: results, loading: false })
    } catch (err) {
      this.setState({ loading: false })
      console.log(err)
    }
  }

  resetData = () => this.setState({ data: [] })

  render() {
    const { form } = this.props
    const { loading, data } = this.state

    const Report = {
      date: <TableDate data={data} />,
      year: <TableYear data={data} />,
    }

    const type = form.getFieldValue(FIELDS.REPORT_TYPE)

    return (
      <PageContainer>
        <div style={{ height: '100vh' }}>
          <Clearfix height={16} />
          <Breadcrumb items={['type1_exceed']} />
          <Search loading={loading} onSearch={this.handleOnSearch}>
            <BoxShadow>
              <Filter form={form} resetData={this.resetData} />
            </BoxShadow>
          </Search>
          <Clearfix height={32} />

          <Row gutter={32}>
            <Col span={12}>
              <p>BÁO CÁO DỮ LIỆU VƯỢT NGƯỠNG THEO NĂM</p>
            </Col>
            <Col span={4}>
              <Button type="primary">Xuất dữ liệu excel</Button>
            </Col>
          </Row>
          {Report[type]}
        </div>
      </PageContainer>
    )
  }
}
