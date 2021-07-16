import { Col, Form, Row } from 'antd'
import { SelectPoint } from 'components/elements/select-data'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import {
  getMeasuringListFromStationAutos,
  isCreate,
} from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
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

@withApiSharingDetailContext
export default class Condition extends React.Component {
  state = {
    points: [],
    stationTypes: [],
    phases: [],
  }

  onFetchPointsSuccess = points => {
    this.setState({ points }, () => {
      this.setFormInit()
      const measureListData = this.getMeasuringList()
      this.props.setMeasureListData(measureListData)
    })
  }

  onFetchStationTypesSuccess = stationTypes => {
    this.setState({ stationTypes }, () => {
      this.setFormInit()
      const measureListData = this.getMeasuringList()
      this.props.setMeasureListData(measureListData)
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
    const stationTypeInit = (stationTypes[2] || {})._id
    if (!stationTypeInit) return
    form.setFieldsValue({
      [`config.${FIELDS.STATION_TYPE}`]: stationTypeInit,
    })

    const stationAutos = this.getPoints()
    const stationAutoInit = stationAutos.map(stationAuto => stationAuto.key)

    const phases = this.getPhases()
    const phasesInit = phases.map(phase => phase._id)

    const measuringList = this.getMeasuringList()
    const measuringListInit = measuringList.map(item => item.key)

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
    const { config: { stationType } = {} } = this.props.form.getFieldsValue()
    const stationAutos = this.state.points.filter(
      stationAuto => stationAuto.stationType._id === stationType
    )
    const measuringList = getMeasuringListFromStationAutos(stationAutos)
    return measuringList
  }

  render() {
    const { form, fieldsDefault = {} } = this.props
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
                  disabled={fieldsDefault[FIELDS.PROVINCE]}
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
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectStationType
                  disabled={fieldsDefault[FIELDS.STATION_TYPE]}
                  fieldValue="_id"
                  isAuto={false}
                  onFetchSuccess={this.onFetchStationTypesSuccess}
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
                  disabled={fieldsDefault[FIELDS.POINT]}
                  mode="multiple"
                  stationTypeId={stationType}
                  provinceId={province}
                  onFetchSuccess={this.onFetchPointsSuccess}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}