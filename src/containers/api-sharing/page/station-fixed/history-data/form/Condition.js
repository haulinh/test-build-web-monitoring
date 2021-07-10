import { Col, Form, Row, Switch } from 'antd'
import OptionsTimeRange from 'components/elements/options-time-range'
import { SelectPhase, SelectPoint } from 'components/elements/select-data'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import {
  getMeasuringListFromStationAutos,
  isCreate,
  isView,
} from 'containers/api-sharing/util'
import React from 'react'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  RANGE_TIME: 'rangeTime',
  POINT: 'stationKeys',
  MEASURING_LIST: 'measuringList',
  IS_EXCEEDED: 'isExceeded',
  PHASE: 'phaseIds',
}

export default class Condition extends React.Component {
  state = {
    points: [],
    stationTypes: [],
    phases: [],
  }

  onFetchPointsSuccess = points => {
    this.setState({ points }, () => {
      this.setFormInit()
    })
  }

  onFetchStationTypesSuccess = stationTypes => {
    this.setState({ stationTypes }, () => {
      this.setFormInit()
    })
  }

  onFetchPhaseSuccess = phases => {
    this.setState({ phases }, () => {
      this.setFormInit()
    })
  }

  setFormInit = () => {
    const { form, rule } = this.props
    if (!isCreate(rule)) {
      return
    }
    const { stationTypes } = this.state
    const stationTypeInit = (stationTypes[0] || {})._id
    if (!stationTypeInit) return
    form.setFieldsValue({
      [`config.${FIELDS.STATION_TYPE}`]: stationTypeInit,
    })

    const stationAutos = this.getPoints()
    const stationAutoInit = stationAutos.map(stationAuto => stationAuto.key)

    const phases = this.getPhases()
    const phasesInit = phases.map(phase => phase._id)

    const measuringListInit = getMeasuringListFromStationAutos(
      stationAutos
    ).map(item => item.key)

    form.setFieldsValue({
      [`config.${FIELDS.POINT}`]: stationAutoInit,
      [`config.${FIELDS.PHASE}`]: phasesInit,
      [`config.${FIELDS.MEASURING_LIST}`]: measuringListInit,
      [`config.${FIELDS.PROVINCE}`]: '',
    })
  }

  handleOnFieldChange = () => {
    const { form } = this.props
    form.setFieldsValue({
      'config.stationKeys': undefined,
      'config.measuringList': undefined,
    })
  }

  handleOnPointChange = () => {
    const { form } = this.props
    form.setFieldsValue({
      'config.measuringList': undefined,
    })
  }

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

  getPhases = () => {
    let { phases } = this.state
    const { form } = this.props
    const { config: { stationType } = {} } = form.getFieldsValue()

    if (stationType) {
      phases = phases.filter(phases => phases.stationTypeId === stationType)
    }

    return phases
  }

  getMeasuringList = () => {
    const {
      config: { stationKeys = [] } = {},
    } = this.props.form.getFieldsValue()
    const stationAutos = this.state.points.filter(stationAuto =>
      stationKeys.includes(stationAuto.key)
    )
    const measuringList = getMeasuringListFromStationAutos(stationAutos)
    return measuringList
  }

  render() {
    const { form, rule } = this.props
    const measuringList = this.getMeasuringList()
    const { config: { province, stationType } = {} } = form.getFieldsValue()
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
                  disabled={isView(rule)}
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
                  disabled={isView(rule)}
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
                  disabled={isView(rule)}
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
                onChange: this.handleOnPointChange,
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectPoint
                  disabled={isView(rule)}
                  mode="multiple"
                  stationTypeId={stationType}
                  provinceId={province}
                  onFetchSuccess={this.onFetchPointsSuccess}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.parameter}>
              {form.getFieldDecorator(`config.${FIELDS.MEASURING_LIST}`, {
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectMeasureParameter
                  disabled={isView(rule)}
                  measuringList={measuringList}
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.timeLabel}>
              {form.getFieldDecorator(`config.${FIELDS.RANGE_TIME}`, {
                initialValue: 1,
              })(<OptionsTimeRange disabled={isView(rule)} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={i18n.detailPage.label.isExceeded}>
              {form.getFieldDecorator(`config.${FIELDS.IS_EXCEEDED}`, {
                valuePropName: 'checked',
              })(<Switch disabled={isView(rule)} />)}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
