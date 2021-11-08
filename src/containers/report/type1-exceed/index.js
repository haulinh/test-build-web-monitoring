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
import styled from 'styled-components'
import {translate as t} from 'hoc/create-lang'
import _ from 'lodash'

export const FIELDS = {
  REPORT_TYPE: 'reportType',
  TIME: 'time',
  PROVINCE: 'province',
  STATION_KEY: 'stationKeys',
  SELECT_TIME: 'selectTime',
  IS_FILTER: 'isFilter',
}

const Text = styled.div`
  font-size: ${props => `${props.fontSize}px`};
  font-weight: ${props => `${props.fontWeight}`};
`

export function i18n() {
  return {
    reportType: {
      label: t('report.label.reportType'),
      option: {
        year: t('report.type1_exceed.option.reportYear'),
        date: t('report.type1_exceed.option.reportDay'),
      }
    },
    time: {
      label: t('report.label.time'),
    },
    province: {
      label: t('report.label.province'),
    },
    station: {
      label: t('report.label.station'),
    },

  }
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
    console.log(params)
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

  getDetailTitle = () => {
    const { form } = this.props
    const values = form.getFieldsValue()

    if (values.reportType === 'year' ) {
      const startTitle = t('report.type1_exceed.detailTitle.reportYear') + moment(values.time.value, 'YYYY').format('YYYY')
      return startTitle
    }

    if (values.reportType === 'date') {
      const startTitle = t('report.type1_exceed.detailTitle.reportDay') + values.time.value.format('DD/MM/YYYY')
      return startTitle
    }
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
    const { time: { type, value: timeValue } = {} } =
      form.getFieldsValue() || {}

    const Report = {
      date: <TableDate data={data} />,
      year: <TableYear data={data} />,
    }
    const getTitle = () => {
      const title = {
        year: t('report.type1_exceed.title.year'),
        date: t('report.type1_exceed.title.date'),
      }
  
      return title[type]
    }

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
            <Col span={20}>
              <Row type="flex" justify="center" align="middle">
                <Text fontSize={20} fontWeight={600}>{getTitle()}</Text>
              </Row>
              <Clearfix height={16}/>
              <Row type="flex" justify="center" align="middle">
                {!_.isEmpty(timeValue) && (
                  <Text fontSize={16} fontWeight={400}>{this.getDetailTitle()}</Text>
                )}
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" justify="end">
                <Button type="primary">{t('report.exportExcel')}</Button>
              </Row>
            </Col>
          </Row>
          <Clearfix height={31}/>
          {Report[type]}
        </div>
      </PageContainer>
    )
  }
}
