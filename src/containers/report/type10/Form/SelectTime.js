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
          initialValue: 'month',
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

const SelectDatePickerType = ({ timeType, ...props }) => {
  if (timeType === 'month') {
    return <DatePickerRangeMonth {...props} />
  }

  return <RangePicker {...props} />
}

class DatePickerRangeMonth extends React.Component {
  state = {
    mode: ['month', 'month'],
    value: [],
    dates: [],
  }

  handlePanelChange = (value, mode) => {
    this.setState(
      {
        value,
        dates: value,
      },
      () => {
        this.props.onChange(value)
      }
    )
  }

  handleChange = value => {
    this.setState({ value })
  }

  render() {
    const { value, mode } = this.state

    return (
      <DatePicker.RangePicker
        placeholder={['Start month', 'End month']}
        format="YYYY-MM"
        value={value}
        mode={mode}
        onChange={this.handleChange}
        onPanelChange={this.handlePanelChange}
      />
    )
  }
}

const SelectTimeType = props => {
  return (
    <Select disabled style={{ width: '100%' }} {...props}>
      <Select.Option value="month">
        {translate('avgSearchFrom.selectTimeRange.month')}
      </Select.Option>
      <Select.Option value="date">
        {translate('avgSearchFrom.selectTimeRange.day')}
      </Select.Option>
    </Select>
  )
}
