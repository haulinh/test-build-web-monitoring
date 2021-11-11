import { Select } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

const { Option } = Select

const options = [
  {
    key: 'custom',
    name: () => t('report.type2_flow.option.reportDay'),
  },
  { key: 'month', name: () => t('report.type2_flow.option.reportMonth') },
  {
    key: 'year',
    name: () => t('report.type2_flow.option.reportYear'),
  },
  {
    key: 'anyYear',
    name: () => t('report.type2_flow.option.reportRangeYear'),
  },
]

const SelectReportType = props => {
  return (
    <Select defaultValue="month" style={{ width: '100%' }} {...props}>
      {options.map(option => (
        <Option key={option.key} value={option.key}>
          {option.name()}
        </Option>
      ))}
    </Select>
  )
}

export default SelectReportType
