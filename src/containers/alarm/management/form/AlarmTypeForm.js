import { Col, InputNumber, Row, Select, Switch } from 'antd'
import SelectMeasure from 'components/elements/select-data/SelectMeasure'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { alarmType, FIELDS } from '../index'
import { i18n } from './AlarmForm'

export const AlarmTypeForm = ({ form }) => {
  const type = form.getFieldValue(FIELDS.TYPE)

  if (type === alarmType.disconnect.value) {
    return <DisconnectForm form={form} />
  }

  // if (type === alarmType.exceed.value) {
  //   return <ExceedForm form={form} />
  // }

  return <React.Fragment />
}

const DisconnectForm = ({ form }) => {
  return (
    <Row type="flex" justify="space-between">
      <Col span={16}>
        <FormItem label={i18n().form.label.disconnectionTime}>
          {form.getFieldDecorator(FIELDS.MAX_DISCONNECTION_TIME)(
            <InputNumber style={{ width: '100%' }} />
          )}
        </FormItem>
      </Col>
      <Col span={5}>
        <FormItem label={i18n().form.label.repeatConfig}>
          {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
            valuePropName: 'checked',
            initialValue: true,
          })(<Switch />)}
        </FormItem>
      </Col>
    </Row>
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
  '30p': {
    label: '30p',
    value: 30 * 60,
  },
  '1h': {
    label: '1h',
    value: 60 * 60,
  },
  '2h': {
    label: '2h',
    value: 2 * 60 * 60,
  },
}

const ExceedForm = ({ form }) => {
  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col span={6}>
          <FormItem label={i18n().form.label.measure}>
            {form.getFieldDecorator(`${FIELDS.CONDITIONS}.measure`)(
              <SelectMeasure style={{ width: '100%' }} />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label={i18n().form.label.compare}>
            {form.getFieldDecorator(`${FIELDS.CONDITIONS}.operator`)(
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
            {form.getFieldDecorator(`${FIELDS.CONDITIONS}.value`)(
              <InputNumber style={{ width: '100%' }} />
            )}
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <FormItem label={i18n().form.label.repeatConfig}>
            {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`)(
              <Switch />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={i18n().form.label.frequency}>
            {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.frequency`)(
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
      </Row>
    </React.Fragment>
  )
}
