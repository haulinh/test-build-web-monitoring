import { Col, Form, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { SelectPoint } from 'components/elements/select-data'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import {
  getMeasuringListFromStationAutos,
  isCreate,
  isView,
} from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import React from 'react'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  RANGE_TIME: 'rangeTime',
  POINT: 'stationKeys',
  POINT_NAME: 'stationNames',
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
    this.setState({ phases }, () => {
      this.setFormInit()
    })
  }

  setFormInit = () => {
    const {form, rule} = this.props
    const {stationTypes} = this.state
    if (!isCreate(rule)) return
    if (stationTypes.length === 0) return

    const stationTypeInit = stationTypes[0]._id

    const stationAutos = this.getPoints({stationType: stationTypeInit})

    const stationKeys = stationAutos.map(stationAuto => stationAuto.key)
    const stationNames = stationAutos.map(stationAuto => stationAuto.name)

    form.setFieldsValue({
      [`config.${FIELDS.PROVINCE}`]: '',
      [`config.${FIELDS.STATION_TYPE}`]: stationTypeInit,
      [`config.${FIELDS.POINT}`]: stationKeys,
      [`config.${FIELDS.POINT_NAME}`]: stationNames,
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

  getPoints = ({stationType}) => {
    let {points} = this.state
    if (stationType) points = points.filter(point => point.stationTypeId === stationType)
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

  isDisable = fieldName => {
    const {rule, fieldsDefault = {}} = this.props
    return isView(rule) && fieldsDefault[fieldName]
  }

  render() {
    const { form } = this.props
    const { config: { province, stationType } = {} } = form.getFieldsValue()
    form.getFieldDecorator(`config.${FIELDS.POINT_NAME}`)
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
                rules: [
                  {
                    required: true,
                    message: i18n.rules.requireChoose,
                  },
                ],
              })(
                <SelectStationType
                  disabled={this.isDisable(FIELDS.STATION_TYPE)}
                  api={CalculateApi.getStationTypeCalculateByWQI}
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
                  disabled={this.isDisable(FIELDS.POINT)}
                  mode="multiple"
                  stationTypeId={stationType}
                  provinceId={province}
                  condition={{calculateType: 'WQI'}}
                  onFetchSuccess={this.onFetchPointsSuccess}
                  pointNames={form.getFieldValue(`config.${FIELDS.POINT_NAME}`)}
                  onChangeName={pointNames => form.setFieldsValue({
                    [`config.${FIELDS.POINT_NAME}`]: pointNames
                  })}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
