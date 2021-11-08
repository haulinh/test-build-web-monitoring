import { Col, DatePicker, Row, Select } from 'antd'
import {
  DatePickerRangeYear,
  DatePickerYear,
} from 'components/core/date-picker'
import React from 'react'
const { Option } = Select

const { MonthPicker } = DatePicker

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

function Picker({ value, onChange }) {
  if (value.type === 'custom')
    return (
      <DatePicker.RangePicker
        placeholder="Chọn ngày"
        onChange={onChange}
        style={{ width: '100%' }}
      />
    )

  if (value.type === 'month')
    return (
      <MonthPicker
        placeholder="Chọn tháng"
        style={{ width: '100%' }}
        onChange={onChange}
      />
    )

  if (value.type === 'year')
    return (
      <DatePickerYear
        value={value.value}
        style={{ with: '100%' }}
        onChange={onChange}
      />
    )

  if (value.type === 'anyYear')
    return (
      <DatePickerRangeYear
        value={value}
        style={{ with: '100%' }}
        onChange={onChange}
      />
    )

  return <React.Fragment />
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
          <Picker onChange={this.handleOnTimeChange} value={value} />
        </Col>
      </Row>
    )
  }
}
