import React from 'react'
import { Select } from 'antd'

const options = [
  {
    key: 'year',
    name: 'Báo cáo năm',
  },
  {
    key: 'date',
    name: 'Báo cáo ngày',
  },
]

const ReportType = (props) => {

  return (
    <Select style={{ width: '100%' }} {...props}>
      {options.map(option => (
        <Select.Option key={option.key} value={option.key}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default ReportType
