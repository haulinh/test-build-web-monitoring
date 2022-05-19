import { Col, Form, Row, Switch } from 'antd'
import SortableMultiSelect from 'components/core/select/SortableMultiSelect'
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
import _, { get, isEmpty } from 'lodash'
import moment from 'moment-timezone'
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

  componentDidMount = () => {
    const { formData, form } = this.props
    if (isEmpty(formData)) return

    const initValues = this.getInitValuesFormData()
    form.setFieldsValue(initValues)
  }

  getFilterDefault = () => {
    const { stationAutos, stationTypes } = this.state

    const firstStationType = get(stationTypes, ['0', 'key'])
    const firstStationKey = this.getInitialStationKey(
      stationAutos,
      firstStationType
    )
    const initMeasuring = this.getMeasureKeys(firstStationKey)

    const firstValues = {
      [fields.rangesDate]: 1,
      [fields.stationKey]: firstStationKey,
      [fields.stationType]: firstStationType,
      [fields.measuringList]: initMeasuring,
      [fields.province]: '',
      [fields.dataType]: 'origin',
      [fields.isExceeded]: false,
    }
    return firstValues
  }

  getInitValuesFormData = () => {
    const { formData } = this.props
    const from = moment(formData.fromDate)
    const to = moment(formData.toDate)

    const initValues = {
      [fields.rangesDate]: [from, to],
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
    const { onSearch, formData, setFilterDefault } = this.props
    const filterDefault = this.getFilterDefault()
    setFilterDefault(filterDefault)

    if (!_.isEmpty(formData)) return
    const success = this.setInitValues(stationAutos)

    if (success) onSearch()
  }

  setFieldValueMeasuringOption = stationAutoValue => {
    const { form } = this.props

    const measuringOptionsKey = this.getMeasureKeys(stationAutoValue)
    form.setFieldsValue({
      [fields.measuringList]: measuringOptionsKey,
    })
  }

  getMeasureKeys = stationAuto => {
    const measuringOptions = this.getMeasureOptions(stationAuto || '')
    const measuringOptionsKey = measuringOptions.map(measure => measure.value)
    return measuringOptionsKey
  }

  setInitValues = stationAutos => {
    const { form } = this.props

    const stationTypeSelected = form.getFieldValue(fields.stationType)

    if (!stationTypeSelected) return false

    const initialStationKey = this.getInitialStationKey(
      stationAutos,
      stationTypeSelected
    )

    form.setFieldsValue({
      [fields.stationKey]: initialStationKey,
    })

    this.setFieldValueMeasuringOption()

    return true
  }

  getInitialStationKey = (stationAutos, stationKey) => {
    const stationAutosBelongStationTypeSelect =
      stationAutos.find(
        stationAuto => _.get(stationAuto, 'stationType.key') === stationKey
      ) || {}

    return stationAutosBelongStationTypeSelect.key
  }

  handleOnChangeStationAuto = stationAutoValue => {
    this.setFieldValueMeasuringOption(stationAutoValue)
  }

  onStationTypeChange = stationType => {
    const { stationAutos } = this.state
    const { form } = this.props

    let stationAutoList

    const province = form.getFieldValue(fields.province)

    stationAutoList = stationAutos.filter(
      stationAuto => stationAuto.stationType.key === stationType
    )

    if (province !== '')
      stationAutoList = stationAutoList.filter(
        stationAuto => _.get(stationAuto, ['province', 'key']) === province
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
                  allowClear={false}
                  size="large"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem label={t('stationType.label')}>
              {form.getFieldDecorator(fields.stationType, {
                rules: [
                  {
                    required: true,
                    message: translate('avgSearchFrom.form.stationType.error'),
                  },
                ],
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
              })(<SortableMultiSelect options={measureOptions} />)}
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
