import { Col, DatePicker, Row, Select } from 'antd'
import { translate } from 'hoc/create-lang'
import React from 'react'
import { FIELDS } from '../index'

const { RangePicker } = DatePicker

const SelectTime = ({ form }) => {
  const timeType = form.getFieldValue(FIELDS.TIME_TYPE)
  return (
    <Row type="flex" justify="space-between">
      <Col span={6}>
        {form.getFieldDecorator(FIELDS.TIME_TYPE, {
          initialValue: 'rangeTime',
        })(<SelectTimeType />)}
      </Col>
      <Col span={17}>
        {form.getFieldDecorator(FIELDS.TIME_VALUE)(
          <SelectDatePickerType timeType={timeType} />
        )}
      </Col>
    </Row>
  )
}
export default SelectTime

const SelectDatePickerType = props => {
  if (props.timeType === 'rangeTime') {
    return null
  }

  return <RangePicker />
}

const SelectTimeType = props => {
  return (
    <Select style={{ width: '100%' }} {...props}>
      <Select.Option value="rangeTime">
        {translate('avgSearchFrom.selectTimeRange.month')}
      </Select.Option>
      <Select.Option value="date">
        {translate('avgSearchFrom.selectTimeRange.day')}
      </Select.Option>
    </Select>
  )
}
