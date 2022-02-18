import { Col, Form, Row, Switch } from 'antd'
import OptionsTimeRange from 'components/elements/options-time-range'
import SelectAnt from 'components/elements/select-ant'
import SelectProvince from 'components/elements/select-province'
import SelectQueryType from 'components/elements/select-query-type'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { autobind } from 'core-decorators'
import createLang, { translate } from 'hoc/create-lang'
import createQueryFormDataBrowser from 'hoc/query-formdata-browser'
import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { fields } from '../index'

const Container = styled.div`
  padding: 16px 16px;
`

const qaqcObj = {
  zero: 'Zero',
  negative: 'Negative',
  repeat: 'Repeat',
  error: 'Error',
  calibration: 'Calibration',
  beyondMeasuringRange: 'BeyondMeasuringRange',
  timeRange: 'TimeRange',
  valueRange: 'ValueRange',
}

const qaqcOptions = [
  {
    value: qaqcObj.beyondMeasuringRange,
    name: translate('qaqcConfig.beyondMeasuringRange'),
  },
  {
    value: qaqcObj.error,
    name: translate('qaqcConfig.deviceError'),
  },
  {
    value: qaqcObj.calibration,
    name: translate('qaqcConfig.deviceCalibration'),
  },
  {
    value: qaqcObj.zero,
    name: translate('qaqcConfig.zero'),
  },
  {
    value: qaqcObj.negative,
    name: translate('qaqcConfig.negative'),
  },
  {
    value: qaqcObj.timeRange,
    name: translate('qaqcConfig.timeRange'),
  },
  {
    value: qaqcObj.valueRange,
    name: translate('qaqcConfig.valueRange'),
  },
  {
    value: qaqcObj.repeat,
    name: translate('qaqcConfig.basic.repeat'),
  },
]

// function validate(values) {
//   const errors = {}
//   if (!values.stationType)
//     errors.stationType = translate('avgSearchFrom.form.stationType.error')
//   if (!values.stationAuto || values.stationAuto === '')
//     errors.stationAuto = translate('avgSearchFrom.form.stationAuto.error')
//   if (!values.type) errors.type = translate('avgSearchFrom.form.type.error')

//   if (!values.rangesDate) {
//     errors.rangesDate = translate('avgSearchFrom.form.rangesDate.error')
//   }

//   if (values.measuringList && values.measuringList.length === 0)
//     errors.measuringList = translate('avgSearchFrom.form.measuringList.require')

//   return errors
// }

@Form.create()
@createLang
@createQueryFormDataBrowser()
@autobind
export default class SearchFormHistoryData extends React.Component {
  state = {
    stationAutoSelected: {},
    stationAutos: [],
    stationTypes: [],
  }

  componentDidMount() {
    const { form, onSearch, formData } = this.props
    if (_.isEmpty(formData)) return

    const initValues = this.getInitValuesFormData()
    form.setFieldsValue(initValues)
    const values = form.getFieldsValue()
    onSearch({ valuesForm: values })
  }

  getInitValuesFormData = () => {
    const { formData } = this.props

    const initValues = {
      [fields.rangesDate]: 1,
      [fields.stationKey]: formData.stationAuto,
      [fields.stationType]: formData.stationType,
      [fields.measuringList]: formData.measuringList,
    }
    return initValues
  }

  getMeasureOptions = stationAutoValue => {
    const { stationAutos } = this.state
    const { form } = this.props

    const stationAutoKeySelected =
      stationAutoValue || form.getFieldValue(fields.stationKey)
    const stationAutoSelected = stationAutos.find(
      stationAuto => stationAuto.key === stationAutoKeySelected
    )

    const measuringList = getMeasuringListFromStationAutos([
      stationAutoSelected,
    ])
    const measureOptions = measuringList.map(measure => ({
      value: measure.key,
      name: measure.name,
    }))

    return measureOptions
  }

  setStationAutoSelected = stationAutoSelected => {
    this.setState({ stationAutoSelected })
  }

  onFetchSuccessStationType = stationTypes => {
    this.setState({
      stationTypes,
    })
    const { form, formData } = this.props
    if (!_.isEmpty(formData)) return
    const stationTypeInit = stationTypes[0].key
    form.setFieldsValue({ [fields.stationType]: stationTypeInit })
  }

  onFetchSuccessStationAuto = stationAutos => {
    this.setState({ stationAutos })
    const { onSearch, formData } = this.props
    if (!_.isEmpty(formData)) return
    const success = this.setInitValues(stationAutos)

    if (success) onSearch()
  }

  setFieldValueMeasuringOption = stationAuto => {
    const { form } = this.props

    const measuringOptions = this.getMeasureOptions(stationAuto || '')
    const measuringOptionsKey = measuringOptions.map(measure => measure.value)
    form.setFieldsValue({
      [fields.measuringList]: measuringOptionsKey,
    })
  }

  setInitValues = stationAutos => {
    const { form } = this.props
    const stationTypeSelected = form.getFieldValue(fields.stationType)
    if (!stationTypeSelected) return false

    const stationAutosBelongStationTypeSelect =
      stationAutos.find(
        stationAuto =>
          _.get(stationAuto, 'stationType.key') === stationTypeSelected
      ) || {}

    form.setFieldsValue({
      [fields.stationKey]: stationAutosBelongStationTypeSelect.key,
    })

    this.setFieldValueMeasuringOption()

    return true
  }

  handleOnChangeStationAuto = stationAutoValue => {
    this.setFieldValueMeasuringOption(stationAutoValue)
  }

  onStationTypeChange = stationType => {
    const { stationAutos } = this.state
    const { form } = this.props

    const stationAutoList = stationAutos.filter(
      stationAuto => stationAuto.stationType.key === stationType
    )

    const firstValue = _.get(stationAutoList, '0.key')

    form.setFieldsValue({ [fields.stationKey]: firstValue })

    this.setFieldValueMeasuringOption(firstValue)
  }

  getStationTypes = province => {
    const stationAutoTypeKeys = this.state.stationAutos
      .filter(stationAuto => {
        const provinceValue = _.get(stationAuto, ['province', 'key'], '')
        return provinceValue === province
      })
      .filter(station => station.stationType)
      .map(station => station.stationType.key)

    return this.state.stationTypes.filter(stationType =>
      stationAutoTypeKeys.includes(stationType.key)
    )
  }

  onProvinceChange = province => {
    const { form } = this.props
    const { stationAutos } = this.state

    let stationAutoList = stationAutos

    const stationTypes = this.getStationTypes(province)

    const stationTypeKeys = stationTypes.map(stationType => stationType.key)

    const firstValueStationType = _.get(stationTypes, '0.key')

    stationAutoList = stationAutos.filter(
      stationAuto =>
        stationAuto.stationType.key === firstValueStationType &&
        _.get(stationAuto, ['province', 'key']) === province
    )

    if (province === '')
      stationAutoList = stationAutos.filter(
        stationAuto =>
          _.get(stationAuto, ['stationType', 'key']) === firstValueStationType
      )

    const firstValue = _.get(stationAutoList, '0.key')

    form.setFieldsValue({
      [fields.stationKey]: firstValue,
      [fields.stationType]: stationTypeKeys[0],
    })
    this.setFieldValueMeasuringOption(firstValue)
  }

  getConditionsFilter = () => {
    const conditions = qaqcOptions.map(condition => condition.value)
    return conditions
  }

  render() {
    const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    const { form } = this.props
    const { stationAutos } = this.state

    const {
      [fields.province]: province,
      [fields.stationType]: stationType,
      [fields.dataType]: dataType,
    } = form.getFieldsValue()

    const measureOptions = this.getMeasureOptions()

    return (
      <Container>
        <Row gutter={[16, 24]}>
          <Col span={3}>
            <FormItem label={translate('qaqc.province.label')}>
              {form.getFieldDecorator(fields.province, {
                initialValue: '',
                onChange: this.onProvinceChange,
              })(
                <SelectProvince
                  isShowAll
                  size="large"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label={t('stationType.label')}>
              {form.getFieldDecorator(fields.stationType, {
                onChange: this.onStationTypeChange,
              })(
                <SelectStationType
                  province={province}
                  stationAutos={stationAutos}
                  onFetchSuccess={this.onFetchSuccessStationType}
                />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={t('stationAuto.label')}>
              {form.getFieldDecorator(fields.stationKey, {
                rules: [
                  {
                    required: true,
                    message: translate('avgSearchFrom.form.stationAuto.error'),
                  },
                ],
                onChange: this.handleOnChangeStationAuto,
              })(
                <SelectStationAuto
                  allowClear={false}
                  onFetchSuccess={this.onFetchSuccessStationAuto}
                  isShowAll
                  onChangeObject={this.setStationAutoSelected}
                  size="large"
                  province={province}
                  stationType={stationType}
                />
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem label={t('time')}>
              {form.getFieldDecorator(fields.rangesDate, { initialValue: 1 })(
                <OptionsTimeRange style={{ width: '100%' }} size="large" />
              )}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label={t('measuringList.label')}>
              {form.getFieldDecorator(fields.measuringList, {
                rules: [
                  {
                    required: true,
                    message: translate(
                      'avgSearchFrom.form.measuringList.require'
                    ),
                  },
                ],
              })(
                <SelectAnt
                  mode="multiple"
                  options={measureOptions}
                  style={{ width: '100%' }}
                  size="large"
                  showSearch
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label={t('isExceeded.label')}>
              {form.getFieldDecorator(fields.isExceeded, {
                valuePropName: 'checked',
              })(<Switch size="large" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label={translate('dataSearchFrom.queryType')}>
              {form.getFieldDecorator(fields.dataType, {
                initialValue: 'origin',
              })(<SelectQueryType size="large" isShowAll />)}
            </FormItem>
          </Col>
          {dataType === 'invalid' && (
            <Col span={12}>
              <FormItem label={translate('dataSearchFrom.filterDataBy')}>
                {form.getFieldDecorator(fields.filterBy, {
                  initialValue: this.getConditionsFilter(),
                  rules: [
                    {
                      required: true,
                      message: translate(
                        'dataSearchFrom.form.filterDataBy.require'
                      ),
                    },
                  ],
                })(
                  <SelectAnt
                    style={{ width: '100%' }}
                    options={qaqcOptions}
                    mode="multiple"
                    size="large"
                    showSearch
                  />
                )}
              </FormItem>
            </Col>
          )}
        </Row>
      </Container>
    )
  }
}
