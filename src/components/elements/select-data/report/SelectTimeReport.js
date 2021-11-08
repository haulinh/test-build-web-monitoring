import { Col, DatePicker, Row, Select } from 'antd'
import React from 'react'
import DatePickerYear from 'components/core/date-picker/DatePickerYear'
const timeOption = [
  {
    key: 'date',
    name: 'Ngày',
  },
  {
    key: 'year',
    name: 'Năm',
  },
]

const TimeReport = ({ value: valueField = {}, reportType, onChange }) => {
  const handleOnChangeOption = type => {
    onChange({ ...valueField, type })
  }

  const handleOnPicker = value => {
    onChange({ ...valueField, value })
  }

  return (
    <Row gutter={16}>
      <Col span={7}>
        <Select
          style={{ width: '100%' }}
          disabled={true}
          value={valueField.type}
          onChange={handleOnChangeOption}
        >
          {timeOption.map(option => (
            <Select.Option key={option.key} value={option.key}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={17}>
        {reportType === 'year' ? (
          <DatePickerYear
            placeholder="Chọn thời gian"
            style={{ width: '100%' }}
            onChange={handleOnPicker}
            value={valueField.value}
          />
        ) : (
          <DatePicker
            onChange={handleOnPicker}
            style={{ width: '100%' }}
            placeholder="Chọn thời gian"
          />
        )}
      </Col>
    </Row>
  )
}

export default TimeReport
