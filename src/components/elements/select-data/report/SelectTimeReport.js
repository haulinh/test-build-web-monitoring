import { Col, DatePicker, Row, Select } from 'antd'
import React from 'react'

const timeOption = [
  {
    key: 'day',
    name: 'Ngày',
  },
  {
    key: 'year',
    name: 'Năm',
  },
]

const TimeReport = props => {
  // time: {
  //   type,
  //   value
  // }
  const handleOnChange = (value) => {
    props.onChange({
      type: props.value.type,
      value: value,
    })
  }
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Select style={{ width: '100%' }} disabled={true} {...props}>
          {timeOption.map(option => (
            <Select.Option key={option.key} value={option.key}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={16}>
        {props.value === 'day' ? (
          <DatePicker onChange={handleOnChange} style={{ width: '230px' }} placeholder="Chọn thời gian" />
        ) : (
          <DatePicker.MonthPicker
            placeholder="Chọn thời gian"
            style={{ width: '230px' }}
          />
        )}
      </Col>
    </Row>
  )
}

export default TimeReport
