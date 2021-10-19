import { Col, InputNumber, Row, Select, Switch } from 'antd'
import { FormItem } from 'components/layouts/styles'
import _ from 'lodash'
import React from 'react'
import { alarmType, FIELDS } from '../index'
import { i18n } from './AlarmForm'
import { connect } from 'react-redux'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { translate } from 'hoc/create-lang'

export const AlarmTypeForm = ({ form }) => {
  const type = form.getFieldValue(FIELDS.TYPE)

  if (type === alarmType.disconnect.value) {
    return <DisconnectForm form={form} />
  }

  if (type === alarmType.exceed.value) {
    return <ExceedForm form={form} />
  }

  return <React.Fragment />
}

const DisconnectForm = ({ form }) => {
  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col span={16}>
          <FormItem
            marginBottom="0px"
            label={i18n().form.label.disconnectionTime}
          >
            {form.getFieldDecorator(FIELDS.MAX_DISCONNECTION_TIME, {
              rules: [
                {
                  required: true,
                  message: translate('alarm.required.disconnectionTime'),
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
          <span>{translate('alarm.suggest.disconnectionTime')}</span>
        </Col>
        <Col span={5}>
          <FormItem marginBottom="0px" label={i18n().form.label.repeatConfig}>
            {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
              valuePropName: 'checked',
              initialValue: true,
            })(<Switch />)}
          </FormItem>
        </Col>
      </Row>
    </React.Fragment>
  )
}

const operator = {
  eq: {
    label: '=',
    value: 'eq',
  },
  gt: {
    label: '>',
    value: 'gt',
  },
  lt: {
    label: '<',
    value: 'lt',
  },
  gte: {
    label: '>=',
    value: 'gte',
  },
  lte: {
    label: '<=',
    value: 'lte',
  },
}

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

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return { stationAutoById }
}

const ExceedForm = connect(mapStateToProp)(({ form, ...props }) => {
  const stationIdSelected = form.getFieldValue(FIELDS.STATION_ID)
  const measuringList = _.get(
    props.stationAutoById,
    `${stationIdSelected}.measuringList`,
    []
  )

  const repeatConfig = form.getFieldValue(`${FIELDS.REPEAT_CONFIG}.active`)

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col span={6}>
          <FormItem label={i18n().form.label.measure}>
            {form.getFieldDecorator(`${FIELDS.CONDITIONS}.measure`, {
              rules: [
                {
                  required: true,
                  message: translate('ticket.required.incident.measure'),
                },
              ],
            })(
              <SelectMeasureParameter
                measuringList={measuringList}
                mode="single"
              />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label={i18n().form.label.compare}>
            {form.getFieldDecorator(`${FIELDS.CONDITIONS}.operator`, {
              initialValue: operator.eq.value,
            })(
              <Select style={{ width: '100%' }}>
                {Object.values(operator).map(operatorItem => (
                  <Select.Option
                    value={operatorItem.value}
                    key={operatorItem.value}
                  >
                    {operatorItem.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem label={i18n().form.label.value}>
            {form.getFieldDecorator(`${FIELDS.CONDITIONS}.value`, {
              rules: [
                {
                  required: true,
                  message: translate('aqiConfigCalculation.required'),
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={6}>
        <Col span={6}>
          <FormItem label={i18n().form.label.repeatConfig}>
            {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
        </Col>
        {repeatConfig && (
          <Col span={8}>
            <FormItem label={i18n().form.label.frequency}>
              {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.frequency`, {
                initialValue: frequency['15p'].value,
              })(
                <Select style={{ width: '100%' }}>
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
})
