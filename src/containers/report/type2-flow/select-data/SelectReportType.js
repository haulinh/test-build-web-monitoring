import { Select } from 'antd'
import React from 'react'

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

const SelectReportType = props => {
  return (
    <Select defaultValue="month" style={{ width: '100%' }} {...props}>
      {options.map(option => (
        <Option key={option.key} value={option.key}>
          {option.name}
        </Option>
      ))}
    </Select>
  )
}

export default SelectReportType
