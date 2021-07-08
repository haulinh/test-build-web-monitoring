import { Col, Form, Row, Switch } from 'antd'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectQueryType from 'components/elements/select-query-type'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import _, { get } from 'lodash'
import React from 'react'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  OPERATOR: 'operator',
  RANGE_TIME: 'rangeTime',
  STATION_AUTO: 'stationKeys',
  MEASURING_LIST: 'measuringList',
  IS_EXCEEDED: 'isExceeded',
  DATA_TYPE: 'dataType',
}

export default class Condition extends React.Component {
  state = {
    stationAutoSelected: {},
  }

  setStationAutoSelected = stationAutoSelected => {
    this.setState({ stationAutoSelected })
  }

  handleOnFieldChange = () => {
    const { form } = this.props
    form.setFieldsValue({
      [`config.${FIELDS.STATION_AUTO}`]: undefined,
      [`config.${FIELDS.MEASURING_LIST}`]: undefined,
    })
  }

  handleFieldStationAutoChange = () => {
    const { form } = this.props
    form.resetFields([FIELDS.MEASURING_LIST])
  }

  getMeasuringList = () => {
    const measureList = get(this.state, 'stationAutoSelected.measuringList', [])
    return measureList
  }

  render() {
    const { form } = this.props
    const { config: { province, stationType } = {} } = form.getFieldsValue()
    const measuringList = this.getMeasuringList()

    return (
      <BoxShadow>
        <Header>{i18n.detailPage.header.condition}</Header>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.province}>
              {form.getFieldDecorator(`config.${FIELDS.PROVINCE}`, {
                onChange: this.handleOnFieldChange,
              })(<SelectProvince isShowAll />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.stationType}>
              {form.getFieldDecorator(`config.${FIELDS.STATION_TYPE}`, {
                onChange: this.handleOnFieldChange,
              })(<SelectStationType />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.stationName}>
              {form.getFieldDecorator(`config.${FIELDS.STATION_AUTO}`, {
                onChange: this.handleFieldStationAutoChange,
              })(
                <SelectStationAuto
                  province={province}
                  stationType={stationType}
                  onChangeObject={this.setStationAutoSelected}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.parameter}>
              {form.getFieldDecorator(`config.${FIELDS.MEASURING_LIST}`)(
                <SelectMeasureParameter measuringList={measuringList} />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.typeData}>
              {form.getFieldDecorator(`config.${FIELDS.DATA_TYPE}`)(
                <SelectQueryType />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.timeLabel}>
              {form.getFieldDecorator(`config.${FIELDS.RANGE_TIME}`, {
                initialValue: 1,
              })(<OptionsTimeRange />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.isExceeded}>
              {form.getFieldDecorator(`config.${FIELDS.IS_EXCEEDED}`, {
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
