import React from 'react'
import { Col, Select, Row, DatePicker } from 'antd'
const { Option } = Select

const options = [
  {
    key: 'day',
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
    key: 'custom',
    name: 'Các năm',
  },
]

const SelectReportFlowTime = props => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Select
          disabled
          defaultValue="month"
          {...props}
          style={{ width: '100%' }}
        >
          {options.map(option => (
            <Option key={option.key} value={option.key}>
              {option.name}
            </Option>
          ))}
        </Select>
      </Col>
      <Col span={18}>
        <DatePicker style={{ width: '100%' }} />
      </Col>
    </Row>
  )
}

export default SelectReportFlowTime
