import React, { Component } from 'react'

import Search from 'containers/api-sharing/component/Search'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import { Row, Col, DatePicker, Form } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import SelectStation from 'components/elements/select-data/periodic-forecast/SelectStation'
import TabResult from './TabResult'
import Breadcrumb from '../breadcrumb'
import moment from 'moment-timezone'
import { getLanguage } from 'utils/localStorage'
import { downFileExcel } from 'utils/downFile'
import { DD_MM_YYYY } from 'constants/format-date'
import styled from 'styled-components'
import Clearfix from 'components/elements/clearfix'
import { translate as t } from 'hoc/create-lang'

const FIELDS = {
  stationKeys: 'stationKeys',
  broadcastTime: 'broadcastTime',
}

const i18n = {
  broadcastTime: t('apiSharingNew.fields.broadcastTime'),
  stationKeys: t('apiSharingNew.fields.stationKeys'),
  requireBroadcastTime: t('apiSharingNew.detailPage.rules.requireBroadcastTime'),
  requireStation: t('apiSharingNew.detailPage.rules.requireStation'),
}

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
  font-size: 14;
  font-weight: 600;
  .ant-form-item-label {
    line-height: unset;
    label {
      margin: 0;
    }
  }
  .switch-filter {
    display: flex;
    flex-direction: row-reverse;
  }
`

@Form.create()
export default class SearchContainer extends Component {
  state = {
    stations: [],
    data: {},
    loading: false,
  }

  getPrams = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const params = {
      stationKeys: values.stationKeys.join(','),
      broadcastTime:
        values.broadcastTime &&
        values.broadcastTime
          .clone()
          .utc()
          .format(),
    }
    return params
  }

  exportData = async () => {
    const params = this.getPrams()
    const lang = getLanguage()
    const result = await PeriodicForecastApi.exportData({ ...params, lang })
    downFileExcel(
      result.data,
      `${t('periodicalForecast.export')} ${moment(params.broadcastTime).format(DD_MM_YYYY)}`
    )
  }

  handleOnSearch = async () => {
    const { form } = this.props

    const validateFields = await form.validateFields()
    if (!validateFields) {
      return
    }

    const values = form.getFieldsValue()
    const params = {
      stationKeys: values.stationKeys.join(','),
      broadcastTime:
        values.broadcastTime &&
        values.broadcastTime
          .clone()
          .utc()
          .format(),
    }
    this.setState({ loading: true })
    try {
      const result = await PeriodicForecastApi.getDataPeriodicForecast(params)
      if (result) {
        this.setState({ data: result, loading: false })
      }
    } catch (error) {
      this.setState({ data: {} })
      console.log(error)
    }
  }

  onFetchStationSuccess = stations => {
    const stationKeys = stations.map(station => station.key)
    const latestBroadcastTime = this.getLatestBroadcastTime(stations)
    const { form } = this.props
    form.setFieldsValue({
      [FIELDS.stationKeys]: stationKeys,
      [FIELDS.broadcastTime]: latestBroadcastTime,
    })
    this.handleOnSearch()
  }

  getLatestBroadcastTime = stations => {
    const latestBroadcastTimeStations = stations
      .filter(station => station.latestBroadcastTime)
      .map(station => moment(station.latestBroadcastTime))
    return moment.max(latestBroadcastTimeStations)
  }

  render() {
    const { form } = this.props
    const { data, loading } = this.state
    return (
      <PageContainer>
        <Breadcrumb items={['search']} />
        <Clearfix height={16} />
        <Search onSearch={this.handleOnSearch} loading={loading}>
          <BoxShadow>
            <Row gutter={12}>
              <Col span={8}>
                <FormItem label={i18n.broadcastTime}>
                  {form.getFieldDecorator(FIELDS.broadcastTime, {
                    rules: [
                      {
                        required: true,
                        message: i18n.requireBroadcastTime,
                      },
                    ],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem label={i18n.stationKeys}>
                  {form.getFieldDecorator(FIELDS.stationKeys, {
                    rules: [
                      {
                        required: true,
                        message: i18n.requireStation,
                      },
                    ],
                  })(
                    <SelectStation
                      onFetchStationSuccess={this.onFetchStationSuccess}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </BoxShadow>
        </Search>
        <TabResult data={data} loading={loading} exportData={this.exportData} />
      </PageContainer>
    )
  }
}
