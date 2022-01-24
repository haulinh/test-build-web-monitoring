import { Col, Row, Switch } from 'antd'
import { Clearfix } from 'components/elements'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import SelectProvince from 'components/elements/select-province'
import SelectQueryType from 'components/elements/select-query-type'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import FormItem from 'containers/api-sharing/component/FormItem'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import {
  getMeasuringListFromStationAutos,
  isCreate,
  isView,
} from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import _ from 'lodash'
import React from 'react'

export const FIELDS = {
  PROVINCE: 'province',
  STATION_TYPE: 'stationType',
  OPERATOR: 'operator',
  RANGE_TIME: 'rangeTime',
  STATION_AUTO: 'stationKeys',
  STATION_NAME: 'stationNames',
  MEASURING_LIST: 'measuringList',
  IS_EXCEEDED: 'isExceeded',
  DATA_TYPE: 'dataType',
}

@withApiSharingDetailContext
export default class Condition extends React.Component {
  state = {
    stationAutoSelected: {},
    stationTypes: [],
    stationAutos: [],
  }

  setStationAutoSelected = stationAutoSelected => {
    const { form } = this.props
    form.setFieldsValue({
      [FIELDS.STATION_NAME]: _.get(stationAutoSelected, 'name'),
    })
    this.setState({ stationAutoSelected }, () => {})
  }

  setFormInit = () => {
    const { form, rule } = this.props
    if (!isCreate(rule)) return

    const { stationTypes } = this.state
    const stationTypeInit = (stationTypes[0] || {})._id
    if (!stationTypeInit) return
    form.setFieldsValue({
      [`config.${FIELDS.STATION_TYPE}`]: stationTypeInit,
    })

    const stationAutos = this.getStationAutos()
    const stationAutoInit = _.get(stationAutos[0], 'key', '')
    const stationAutoNameInit = _.get(stationAutos[0], 'name', '')

    const measuringList = this.getMeasuringList()
    const measuringListInit = measuringList.map(item => item.key)

    form.setFieldsValue({
      [`config.${FIELDS.STATION_AUTO}`]: stationAutoInit,
      [`config.${FIELDS.STATION_NAME}`]: stationAutoNameInit,
      [`config.${FIELDS.MEASURING_LIST}`]: measuringListInit,
      [`config.${FIELDS.DATA_TYPE}`]: 'origin',
      [`config.${FIELDS.PROVINCE}`]: '',
    })
  }

  getStationAutos = () => {
    let { stationAutos } = this.state
    const {
      config: { province, stationType } = {},
    } = this.props.form.getFieldsValue()

    if (province) {
      stationAutos = stationAutos.filter(
        stationAuto => stationAuto.province === province
      )
    }

    if (stationType) {
      stationAutos = stationAutos.filter(
        stationAuto => stationAuto.stationType._id === stationType
      )
    }

    return stationAutos
  }

  onStationTypeFetchSuccess = stationTypes => {
    this.setState({ stationTypes }, () => {
      this.props.setStationAutos(this.state.stationAutos)
      this.setFormInit()
    })
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({ stationAutos }, () => {
      this.props.setStationAutos(this.state.stationAutos)
      this.setFormInit()
    })
  }

  handleOnFieldChange = () => {
    const { form } = this.props
    form.setFieldsValue({
      [`config.${FIELDS.STATION_AUTO}`]: undefined,
      [`config.${FIELDS.MEASURING_LIST}`]: undefined,
    })
  }

  handleFieldStationAutoChange = () => {
    // const { form } = this.props
    // form.setFieldsValue({ [`config.${[FIELDS.MEASURING_LIST]}`]: undefined })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const { config: { stationType } = {} } = form.getFieldsValue()
    const stationAutos = this.state.stationAutos.filter(
      stationAuto => stationAuto.stationType._id === stationType
    )
    const measureList = getMeasuringListFromStationAutos(stationAutos)
    return measureList
  }

  isDisable = fieldName => {
    const { rule, fieldsDefault = {} } = this.props
    return isView(rule) && fieldsDefault[fieldName]
  }

  render() {
    const { form, isQuery } = this.props
    const { config: { province, stationType } = {} } = form.getFieldsValue()
    const measuringList = this.getMeasuringList()

    form.getFieldDecorator(`config.${FIELDS.STATION_NAME}`)

    return (
      <BoxShadow>
        {!isQuery && <Header>{i18n().detailPage.header.condition}</Header>}
        <Clearfix height={12} />
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label={i18n().detailPage.label.province}>
              {form.getFieldDecorator(`config.${FIELDS.PROVINCE}`, {
                onChange: this.handleOnFieldChange,
              })(
                <SelectProvince
                  fieldValue="_id"
                  isShowAll
                  disabled={this.isDisable(FIELDS.PROVINCE)}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={i18n().detailPage.label.stationType}>
              {form.getFieldDecorator(`config.${FIELDS.STATION_TYPE}`, {
                onChange: this.handleOnFieldChange,
              })(
                <SelectStationType
                  fieldValue="_id"
                  onFetchSuccess={this.onStationTypeFetchSuccess}
                  disabled={this.isDisable(FIELDS.STATION_TYPE)}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={i18n().detailPage.label.stationName}>
              {form.getFieldDecorator(`config.${FIELDS.STATION_AUTO}`, {
                onChange: this.handleFieldStationAutoChange,
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireChoose,
                  },
                ],
              })(
                <SelectStationAuto
                  disabled={this.isDisable(FIELDS.STATION_AUTO)}
                  fieldFilter="_id"
                  province={province}
                  stationType={stationType}
                  onChangeObject={this.setStationAutoSelected}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                  valueNames={form.getFieldValue(
                    `config.${FIELDS.STATION_NAME}`
                  )}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={i18n().detailPage.label.parameter}>
              {form.getFieldDecorator(`config.${FIELDS.MEASURING_LIST}`, {
                rules: [
                  {
                    required: true,
                    message: i18n().rules.requireChoose,
                  },
                ],
              })(
                <SelectMeasureParameter
                  disabled={this.isDisable(FIELDS.MEASURING_LIST)}
                  measuringList={measuringList}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={i18n().detailPage.label.typeData}>
              {form.getFieldDecorator(`config.${FIELDS.DATA_TYPE}`)(
                <SelectQueryType disabled={this.isDisable(FIELDS.DATA_TYPE)} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={i18n().detailPage.label.timeLabel}>
              {form.getFieldDecorator(`config.${FIELDS.RANGE_TIME}`, {
                initialValue: 1,
              })(
                <OptionsTimeRange
                  disabled={this.isDisable(FIELDS.RANGE_TIME)}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={i18n().detailPage.label.isExceeded}>
              {form.getFieldDecorator(`config.${FIELDS.IS_EXCEEDED}`, {
                valuePropName: 'checked',
              })(<Switch disabled={this.isDisable(FIELDS.IS_EXCEEDED)} />)}
            </FormItem>
          </Col>
        </Row>
      </BoxShadow>
    )
  }
}
