import { Col, DatePicker, Row, Select } from 'antd'
import React from 'react'
const { Option } = Select

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

export default class SelectReportFlowTime extends React.Component {
  handleOnDateChange = value => {
    const { onChange, value: valueField } = this.props
    onChange({
      ...valueField,
      value,
    })
  }
  render() {
    const { value } = this.props
    // console.log({ value: value })
    return (
      <Row gutter={16}>
        <Col span={6}>
          <Select
            value={value.type}
            disabled={value.type !== 'anyYear'}
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
          {value.type === 'custom' && (
            <DatePicker
              onChange={this.handleOnDateChange}
              style={{ width: '100%' }}
            />
          )}
        </Col>
      </Row>
    )
  }
}
