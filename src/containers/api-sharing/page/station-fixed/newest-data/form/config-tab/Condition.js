import { Col, Form, Row, Switch } from 'antd'
import { SelectPoint } from 'components/elements/select-data'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectQueryType from 'components/elements/select-query-type'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import React from 'react'
import { BoxShadow, Header } from '../styles'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  OPERATOR: 'operator',
  RANGE_TIME: 'rangeTime',
  POINT: 'pointKey',
  MEASURING_LIST: 'measuringList',
  IS_EXCEEDED: 'isExceeded',
  DATA_TYPE: 'dataType',
}

export default class Condition extends React.Component {
  state = {
    pointSelected: {},
    provinceSelected: {},
    stationTypeSelected: {},
  }

  setPointSelected = pointSelected => {
    this.setState({ pointSelected })
  }

  setProvinceSelected = provinceSelected => {
    this.setState({ provinceSelected })
  }

  setStationTypeSelected = stationTypeSelected => {
    this.setState({ stationTypeSelected })
  }

  handleOnFieldChange = () => {
    const { form } = this.props
    form.setFieldsValue({ [`config.${FIELDS.POINT}`]: undefined })
    const { pointKey } = form.getFieldsValue()
    if (!pointKey) {
      form.resetFields([`config.${FIELDS.MEASURING_LIST}`])
    }
  }

  handleFieldPointChange = () => {
    const { form } = this.props
    form.resetFields([`config.${FIELDS.MEASURING_LIST}`])
  }

  render() {
    const { form } = this.props
    const { pointSelected, provinceSelected, stationTypeSelected } = this.state

    return (
      <BoxShadow>
        <Header>{i18n.detailPage.header.condition}</Header>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.province}>
              {form.getFieldDecorator(`config.${FIELDS.PROVINCE}`, {
                onChange: this.handleOnFieldChange,
              })(
                <SelectProvince
                  isShowAll
                  onHandleChange={this.setProvinceSelected}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.stationType}>
              {form.getFieldDecorator(`config.${FIELDS.STATION_TYPE}`, {
                onChange: this.handleOnFieldChange,
              })(
                <SelectStationType
                  isAuto={false}
                  onHandleChange={this.setStationTypeSelected}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="i18n.detailPage.label.point">
              {form.getFieldDecorator(`config.${FIELDS.POINT}`, {
                onChange: this.handleFieldPointChange,
              })(
                <SelectPoint
                  stationTypeId={stationTypeSelected._id}
                  provinceId={provinceSelected._id}
                  pointKey={pointSelected.key}
                  onChangeObject={this.setPointSelected}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.parameter}>
              {form.getFieldDecorator(`config.${FIELDS.MEASURING_LIST}`)(
                <SelectMeasureParameter
                  measuringList={pointSelected.measuringList}
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
