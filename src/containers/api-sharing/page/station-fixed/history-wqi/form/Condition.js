import React from 'react'
import {Col, DatePicker, Form, Radio, Row} from 'antd'
import {SelectPhase, SelectPoint} from 'components/elements/select-data'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import {MM_YYYY, YYYY} from 'constants/format-date'
import {i18n} from 'containers/api-sharing/constants'
import {BoxShadow, Header} from 'containers/api-sharing/layout/styles'
import { isCreate, isView, } from 'containers/api-sharing/util'
import {withApiSharingDetailContext} from 'containers/api-sharing/withShareApiContext'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  POINT: 'stationKeys',
  PHASE: 'phaseIds',
  RANGE_TIME: 'rangeTime',
  VIEW_BY: 'viewBy',
}

@withApiSharingDetailContext
export default class Condition extends React.Component {
  state = {
    points: [],
    stationTypes: [],
    phases: [],
  }

  onFetchPointsSuccess = points => {
    this.setState({points}, () => {
      this.setFormInit()
    })
  }

  onFetchStationTypesSuccess = stationTypes => {
    this.setState({stationTypes}, () => {
      this.setFormInit()
    })
  }

  onFetchPhaseSuccess = phases => {
    this.setState({phases}, () => {
      this.setFormInit()
    })
  }

  setFormInit = () => {
    const {form, rule} = this.props
    const {stationTypes} = this.state
    if (!isCreate(rule)) return
    if (stationTypes.length === 0) return

    const stationAutos = this.getPoints()
    const phases = this.getPhases()

    const stationTypeInit = stationTypes[0]._id
    const stationAutoInit = stationAutos.map(stationAuto => stationAuto.key)
    const phasesInit = phases.map(phase => phase._id)

    form.setFieldsValue({
      [`config.${FIELDS.PROVINCE}`]: '',
      [`config.${FIELDS.STATION_TYPE}`]: stationTypeInit,
      [`config.${FIELDS.PHASE}`]: phasesInit,
      [`config.${FIELDS.POINT}`]: stationAutoInit,
    })
  }

  handleOnFieldChange = () => {
    const {form} = this.props
    form.setFieldsValue({
      'config.stationKeys': undefined,
      'config.phaseIds': undefined,
    })
  }

  getPoints = () => {
    let {points} = this.state
    const {form} = this.props
    const {config: {province, stationType} = {}} = form.getFieldsValue()
    if (province) points = points.filter(point => point.provinceId === province)
    if (stationType) points = points.filter(point => point.stationTypeId === stationType)
    return points
  }

  getPhases = () => {
    let {phases} = this.state
    const {form} = this.props
    const {config: {stationType} = {}} = form.getFieldsValue()

    if (stationType) phases = phases.filter(phases => phases.stationTypeId === stationType)
    return phases
  }

  isDisable = fieldName => {
    const {rule, fieldsDefault = {}} = this.props
    return isView(rule) && fieldsDefault[fieldName]
  }

  render() {
    const {form} = this.props
    const {config: {province, stationType} = {}} = form.getFieldsValue()
    const formatTime = form.getFieldValue(`config.${FIELDS.VIEW_BY}`) === 'year' ? YYYY : MM_YYYY

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
                  disabled={this.isDisable(FIELDS.PROVINCE)}
                  fieldValue="_id"
                  isShowAll
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
                  disabled={this.isDisable(FIELDS.STATION_TYPE)}
                  fieldValue="_id"
                  isAuto={false}
                  onFetchSuccess={this.onFetchStationTypesSuccess}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.phase}>
              {form.getFieldDecorator(`config.${FIELDS.PHASE}`, {
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectPhase
                  disabled={this.isDisable(FIELDS.PHASE)}
                  mode="multiple"
                  stationTypeId={stationType}
                  provinceId={province}
                  onFetchSuccess={this.onFetchPhaseSuccess}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.point}>
              {form.getFieldDecorator(`config.${FIELDS.POINT}`, {
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectPoint
                  disabled={this.isDisable(FIELDS.POINT)}
                  mode="multiple"
                  stationTypeId={stationType}
                  provinceId={province}
                  onFetchSuccess={this.onFetchPointsSuccess}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={12}>
            <Form.Item label={i18n.wqi.viewBy}>
              {form.getFieldDecorator(`config.${FIELDS.VIEW_BY}`, {initialValue: 'month'})(
                <Radio.Group>
                  <Radio value={'month'}>{i18n.month}</Radio>
                  <Radio value={'quarter'}>{i18n.quarter}</Radio>
                  <Radio value={'year'}>{i18n.year}</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item label={i18n.wqi.time}>
              {form.getFieldDecorator(`config.${FIELDS.RANGE_TIME}`, {
                rules: [
                  {
                    required: true,
                    message: i18n.wqi.requireTime,
                  },
                ],
              })(
                <DatePicker.RangePicker format={formatTime} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
