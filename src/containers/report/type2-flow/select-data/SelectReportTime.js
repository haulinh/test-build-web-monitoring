import { Col, DatePicker, Row, Select } from 'antd'
import {
  DatePickerRangeYear,
  DatePickerYear,
} from 'components/core/date-picker'
import React from 'react'
const { Option } = Select

const { MonthPicker, RangePicker } = DatePicker

const options = [
  {
    key: 'custom',
    name: 'Ngày',
  },
  {
    key: 'month',
    name: 'Tháng',
  },
  {
    key: 'year',
    name: 'Năm',
  },
  {
    key: 'anyYear',
    name: 'Các năm',
  },
]

function PickTimes({ type, onChange, value }) {
  if (type === 'custom') {
    return (
      <RangePicker
        onChange={onChange}
        style={{ width: '100%' }}
        value={value.value}
      />
    )
  }
  if (type === 'month') {
    return (
      <MonthPicker
        placeholder="Chọn tháng"
        style={{ width: '100%' }}
        onChange={onChange}
        value={value.value}
      />
    )
  }
  if (type === 'year') {
    return (
      <DatePickerYear
        style={{ with: '100%' }}
        value={value.value}
        onChange={onChange}
      />
    )
  }
  if (type === 'anyYear') {
    return (
      <DatePickerRangeYear
        style={{ with: '100%' }}
        onChange={onChange}
        value={value}
      />
    )
  }
}

export default class SelectReportTime extends React.Component {
  handleOnTimeChange = value => {
    const { onChange, value: valueField } = this.props
    onChange({
      ...valueField,
      value,
    })
  }

  render() {
    const { value } = this.props
    return (
      <Row gutter={16}>
        <Col span={6}>
          <Select value={value.type} disabled style={{ width: '100%' }}>
            {options.map(option => (
              <Option key={option.key} value={option.key}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={18}>
          <PickTimes
            type={value.type}
            onChange={this.handleOnTimeChange}
            value={value}
          />
        </Col>
      </Row>
    )
  }
}
