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

const FIELDS = {
  stationKeys: 'stationKeys',
  broadcastTime: 'broadcastTime',
}

const i18n = {
  broadcastTime: 'Ngày phát bản tin',
  stationKeys: 'Trạm quan trắc',
}

@Form.create()
export default class SearchContainer extends Component {
  state = {
    stations: [],
    data: {},
    loading: false,
  }

  async componentDidMount() {
    const result = await PeriodicForecastApi.getStationPeriodicForecast({})
    this.setState({ stations: result.data })
  }

  handleOnSearch = async () => {
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
    this.setState({ loading: true })
    const result = await PeriodicForecastApi.getDataPeriodicForecast(params)
    this.setState({ data: result, loading: false })
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
        <Search onSearch={this.handleOnSearch} loading={loading}>
          <BoxShadow>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label={i18n.broadcastTime}>
                  {form.getFieldDecorator(FIELDS.broadcastTime, {
                    // initialValue: moment(),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label={i18n.stationKeys}>
                  {form.getFieldDecorator(FIELDS.stationKeys)(
                    <SelectStation
                      onFetchStationSuccess={this.onFetchStationSuccess}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </BoxShadow>
        </Search>
        <TabResult data={data} loading={loading} />
      </PageContainer>
    )
  }
}
