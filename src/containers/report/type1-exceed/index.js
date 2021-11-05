import { Form, Row, Col, Button } from 'antd'
import DataInsight from 'api/DataInsight'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import moment from 'moment'
import React, { Component } from 'react'
import styled from 'styled-components'
import { getTimeUTC } from 'utils/datetime'
import Breadcrumb from '../breadcrumb'
import Filter from './Filter'

const Text = styled.div`
  font-size: 16px;
  font-weight: 600px;
`

export const FIELDS = {
  REPORT_TYPE: 'reportType',
  TIME: 'time',
  PROVINCE: 'province',
  STATIONKEY: 'stationKeys',
  SELECTTIME: 'selectTime',
  ISFILTER: 'isFilter',
}

@Form.create()
export default class ReportExceed extends Component {
  state = {
    resultReport: {},
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
      [FIELDS.ISFILTER]: values[FIELDS.ISFILTER],
      [FIELDS.STATIONKEY]: values.stationKeys.join(','),
    }
    return params
  }

  getQueryParamsYear = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const params = {
      ...paramsGeneral,
      [FIELDS.TIME]: getTimeUTC(
        moment(paramsGeneral.time, 'YYYY').startOf('year')
      ),
    }
    return params
  }

  getQueryParamsDate = () => {
    const paramsGeneral = this.getQueryParamsGeneral()
    const params = {
      ...paramsGeneral,
      [FIELDS.TIME]: paramsGeneral.time
                 .clone()
                 .utc()
                 .format()
      ,
    }
    return params
  }

  handleOnSearch = async () => {
    const params = await this.getQueryParams()
    try {
      const results = await DataInsight.getExceedData(params.reportType, params)
      console.log(results)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { form } = this.props
    const { loading } = this.state

    return (
      <PageContainer>
        <div style={{ height: '100vh' }}>
          <Clearfix height={16} />
          <Breadcrumb items={['type1_exceed']} />
          <Search loading={loading} onSearch={this.handleOnSearch}>
            <BoxShadow>
              <Filter form={form} />
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
        </div>
      </PageContainer>
    )
  }
}
