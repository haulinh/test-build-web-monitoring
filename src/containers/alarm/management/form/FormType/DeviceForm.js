import { Col, Row, Select, Switch } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { FIELDS } from '../../index'
import { i18n } from '../AlarmForm'

const frequency = {
  '15p': {
    label: '15p',
    value: 15,
  },
  '30p': {
    label: '30p',
    value: 30,
  },
  '1h': {
    label: '1h',
    value: 60,
  },
  '2h': {
    label: '2h',
    value: 2 * 60,
  },
  '4h': {
    label: '4h',
    value: 4 * 60,
  },
  '8h': {
    label: '8h',
    value: 8 * 60,
  },
}

const deviceStatus = {
  good: {
    label: () => translate('alarm.label.management.deviceStatus.good'),
    value: 0,
  },
  error: {
    label: () => translate('alarm.label.management.deviceStatus.error'),
    value: 2,
  },
  calibration: {
    label: () => translate('alarm.label.management.deviceStatus.calibration'),
    value: 1,
  },
}

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return {
    stationAutoById,
    alarmSelected: state.alarm.alarmSelected,
    alarmType: state.alarm.alarmType,
    isEdit: state.alarm.isEdit,
  }
}

@connect(mapStateToProp)
export default class DeviceForm extends React.Component {
  componentDidMount() {
    const { alarmSelected, form } = this.props

    if (!_.isEmpty(alarmSelected)) {
      const condition = _.get(alarmSelected, `${[FIELDS.CONDITIONS]}.0`, {})
      form.setFieldsValue({
        [FIELDS.CONDITIONS]: condition,
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { alarmSelected, form } = this.props
    if (
      !_.isEmpty(alarmSelected) &&
      prevProps.alarmSelected !== alarmSelected
    ) {
      const condition = _.get(alarmSelected, `${[FIELDS.CONDITIONS]}.0`, {})
      form.setFieldsValue({
        [FIELDS.CONDITIONS]: condition,
      })
    }
  }

  render() {
    const { form, stationAutoById, isEdit, getPopupContainer } = this.props
    const repeatConfig = form.getFieldValue(`${FIELDS.REPEAT_CONFIG}.active`)
    const stationIdSelected = form.getFieldValue(FIELDS.STATION_ID)
    const measuringList = _.get(
      stationAutoById,
      `${stationIdSelected}.measuringList`,
      []
    )

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <FormItem label={i18n().form.label.device}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.measure`, {
                rules: [
                  {
                    required: true,
                    message: translate('ticket.required.incident.measure'),
                  },
                ],
              })(
                <SelectMeasureParameter
                  disabled={isEdit}
                  measuringList={measuringList}
                  mode="single"
                  getPopupContainer={getPopupContainer}
                />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label={i18n().form.label.compare}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.operator`, {
                initialValue: 'eq',
              })(<SelectOperator disabled getPopupContainer={getPopupContainer} />)}
            </FormItem>
          </Col>

          <Col span={10}>
            <FormItem label={i18n().form.label.status}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.value`, {
                rules: [
                  {
                    required: true,
                    message: translate('aqiConfigCalculation.required'),
                  },
                ],
              })(
                <Select disabled={isEdit} style={{ width: '100%' }} getPopupContainer={getPopupContainer}>
                  {Object.values(deviceStatus).map(deviceStatusItem => (
                    <Select.Option
                      value={deviceStatusItem.value}
                      key={deviceStatusItem.value}
                    >
                      {deviceStatusItem.label()}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col span={8}>
            <FormItem label={i18n().form.label.repeatConfig}>
              {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
                valuePropName: 'checked',
              })(<Switch disabled={isEdit} />)}
            </FormItem>
          </Col>
          {repeatConfig && (
            <Col span={8}>
              <FormItem label={i18n().form.label.frequency}>
                {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.frequency`, {
                  initialValue: frequency['15p'].value,
                })(
                  <Select disabled={isEdit} style={{ width: '100%' }} getPopupContainer={getPopupContainer}>
                    {Object.values(frequency).map(frequencyItem => (
                      <Select.Option
                        value={frequencyItem.value}
                        key={frequencyItem.value}
                      >
                        {frequencyItem.label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          )}
        </Row>
      </React.Fragment>
    )
  }
}
