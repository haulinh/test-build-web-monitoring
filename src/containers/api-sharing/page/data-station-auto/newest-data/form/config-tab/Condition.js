import { Col, Form, Row, Switch } from 'antd'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectQueryType from 'components/elements/select-query-type'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import React from 'react'
import { BoxShadow, Header } from '../styles'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  OPERATOR: 'operator',
  RANGE_TIME: 'rangeTime',
  STATION_AUTO: 'stationAuto',
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
    form.resetFields([FIELDS.STATION_AUTO])
    const { stationAuto } = form.getFieldsValue()
    if (!stationAuto) {
      form.resetFields([FIELDS.MEASURING_LIST])
    }
  }

  handleFieldStationAutoChange = () => {
    const { form } = this.props
    form.resetFields([FIELDS.MEASURING_LIST])
  }

  render() {
    const { form } = this.props
    const { stationAutoSelected } = this.state
    const { province, stationType } = form.getFieldsValue()

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
        </Row>

        <Row gutter={12}>
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
                <SelectMeasureParameter
                  measuringList={stationAutoSelected.measuringList}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.typeData}>
              {form.getFieldDecorator(`config.${FIELDS.DATA_TYPE}`)(
                <SelectQueryType />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.isExceed}>
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
