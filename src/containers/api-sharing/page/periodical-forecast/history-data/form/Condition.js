import { Col, DatePicker, Form, Row } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import {
  isCreate,
  isView,
} from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import SelectStation from 'components/elements/select-data/periodic-forecast/SelectStation'
import _ from 'lodash'
import moment from 'moment-timezone'
import React from 'react'

const FIELDS = {
  stationKeys: 'stationKeys',
  broadcastTime: 'broadcastTime',
}

@withApiSharingDetailContext
export default class Condition extends React.Component {
  state = {
    stations: [],
    loading: false,
  }

  async componentDidMount() {
    const result = await PeriodicForecastApi.getStationPeriodicForecast({})
    this.setState({ stations: result.data })
  }

  onFetchStationSuccess = stations => {
    const { rule } = this.props
    if (!isCreate(rule)) return
    const stationKeys = stations.map(station => station.key)
    const latestBroadcastTime = this.getLatestBroadcastTime(stations)
    const { form } = this.props
    form.setFieldsValue({
      [`config.${FIELDS.stationKeys}`]: stationKeys,
      [`config.${FIELDS.broadcastTime}`]: latestBroadcastTime,
    })
  }

  getLatestBroadcastTime = stations => {
    const latestBroadcastTimeStations = stations
      .filter(station => station.latestBroadcastTime)
      .map(station => moment(station.latestBroadcastTime))
    return moment.max(latestBroadcastTimeStations)
  }

  isDisable = fieldName => {
    const { rule, fieldsDefault = {} } = this.props
    return isView(rule) && fieldsDefault[fieldName]
  }

  render() {
    const { form, isQuery } = this.props
    return (
      <BoxShadow>
        {!isQuery && <Header>{i18n.detailPage.header.condition}</Header>}
        <Row gutter={12}>
          <Col span={16}>
            <Form.Item label={i18n.detailPage.label.stationName}>
              {form.getFieldDecorator(`config.${FIELDS.stationKeys}`, {
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireStation,
                  },
                ]
              })(
                <SelectStation
                  onFetchStationSuccess={this.onFetchStationSuccess}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.broadcastTime}>
              {form.getFieldDecorator(`config.${FIELDS.broadcastTime}`,{
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireBroadcastTime,
                  },
                ]
              })(
                <DatePicker style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
