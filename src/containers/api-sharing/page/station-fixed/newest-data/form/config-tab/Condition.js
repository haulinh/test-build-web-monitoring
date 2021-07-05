import { Col, Form, Row, Switch } from 'antd'
import { SelectPoint } from 'components/elements/select-data'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import _ from 'lodash'
import React from 'react'

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
    points: [],
    provinceSelected: {},
    stationTypeSelected: {},
    stationTypes: [],
  }

  setPoints = points => {
    this.setState({ points })
  }

  setProvinceSelected = provinceSelected => {
    this.setState({ provinceSelected })
  }

  setStationTypeSelected = stationTypeSelected => {
    this.setState({ stationTypeSelected })
  }

  setStationTypes = stationTypes => {
    this.setState({ stationTypes })
  }

  // handleOnFieldChange = () => {
  //   const { form } = this.props
  //   const value = form.getFieldsValue()
  //   form.resetFields()
  //   // const { pointKey } = form.getFieldsValue()
  //   // if (!pointKey) {
  //   //   form.resetFields([`config.${FIELDS.MEASURING_LIST}`])
  //   // }
  // }

  getPoints = () => {
    let { points } = this.state
    const { form } = this.props
    const { config: { province, stationType } = {} } = form.getFieldsValue()
    if (province) {
      points = points.filter(point => point.provinceId === province)
    }

    if (stationType) {
      points = points.filter(point => point.stationTypeId === stationType)
    }

    return points
  }

  getMeasuringList = () => {
    const points = this.getPoints()
    const measureList = points.reduce(
      (base, current) => [...base, ...current.measuringList],
      []
    )
    return _.uniqBy(measureList, 'key')
  }

  getInitialValue = () => {
    const measuringList = this.getMeasuringList()
    const initialValueMeasuringList = measuringList.map(item => item.key)

    const { stationTypes } = this.state
    const initialStationType = (stationTypes[0] || {})._id

    const points = this.getPoints()
    const initialPoints = points.map(item => item.key)

    return {
      measuringList: initialValueMeasuringList,
      stationType: initialStationType,
      points: initialPoints,
    }
  }

  render() {
    const { form } = this.props
    const { provinceSelected, stationTypeSelected } = this.state
    const measuringList = this.getMeasuringList()
    const initialValues = this.getInitialValue()
    const { province, stationType } = form.getFieldsValue()
    return (
      <BoxShadow>
        <Header>{i18n.detailPage.header.condition}</Header>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.province}>
              {form.getFieldDecorator(`config.${FIELDS.PROVINCE}`, {
                onChange: this.handleOnFieldChange,
              })(<SelectProvince fieldValue="_id" isShowAll />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.stationType}>
              {form.getFieldDecorator(`config.${FIELDS.STATION_TYPE}`, {
                onChange: this.handleOnFieldChange,
                initialValue: initialValues.stationType,
              })(
                <SelectStationType
                  fieldValue="_id"
                  isAuto={false}
                  onFetchSuccess={this.setStationTypes}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="i18n.detailPage.label.point">
              {form.getFieldDecorator(`config.${FIELDS.POINT}`, {
                initialValue: initialValues.points,
              })(
                <SelectPoint
                  mode="multiple"
                  stationTypeId={stationType}
                  provinceId={province}
                  onChangeObject={this.setPoints}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.parameter}>
              {form.getFieldDecorator(`config.${FIELDS.MEASURING_LIST}`, {
                initialValue: initialValues.measuringList,
              })(<SelectMeasureParameter measuringList={measuringList} />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
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
