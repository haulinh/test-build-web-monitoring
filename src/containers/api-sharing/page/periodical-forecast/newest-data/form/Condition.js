import { Col, Row } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import { Clearfix } from 'components/elements'
import SelectStation from 'components/elements/select-data/periodic-forecast/SelectStation'
import FormItem from 'containers/api-sharing/component/FormItem'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import { isCreate, isView } from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import moment from 'moment-timezone'
import React from 'react'

const FIELDS = {
  stationKeys: 'stationKeys',
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
    const { form } = this.props
    form.setFieldsValue({
      [`config.${FIELDS.stationKeys}`]: stationKeys,
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
        {!isQuery && <Header>{i18n().detailPage.header.condition}</Header>}
        <Clearfix height={12} />
        <Row gutter={12}>
          <Col span={16}>
            <FormItem label={i18n().detailPage.label.stationName}>
              {form.getFieldDecorator(`config.${FIELDS.stationKeys}`, {
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireStation,
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
    )
  }
}
