import React from 'react'
import { Select } from 'antd'

const { Option } = Select

const options = [
  {
    key: 'custom',
    name: 'Báo cáo ngày',
  },
  { key: 'month', name: 'Báo cáo tháng' },
  {
    key: 'year',
    name: 'Báo cáo hàng năm',
  },
  {
    key: 'anyYear',
    name: 'Báo cáo các năm',
  },
]

const SelectReportType = ({ onChange }) => {
  const handleOnChange = reportType => {
    onChange(reportType)
  }
  return (
    <Select
      defaultValue="month"
      style={{ width: '100%' }}
      onChange={handleOnChange}
    >
      {options.map(option => (
        <Option key={option.key} value={option.key}>
          {option.name}
        </Option>
      ))}
    </Select>
  )
}

export default SelectReportType
