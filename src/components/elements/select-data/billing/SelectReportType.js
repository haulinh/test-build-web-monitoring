import React from 'react'
import { Select } from 'antd'
import { translate as t } from 'hoc/create-lang'

const options = [
  {
    key: 'month',
    name: () => t('billing.option.reportMonth'),
  },
  {
    key: 'quarter',
    name: () => t('billing.option.reportQuarter'),
  },
  {
    key: 'custom',
    name: () => t('billing.option.reportCustom'),
  },
]

const SelectReportType = ({ value, onChange, form } = {}) => {
  const handleOnChange = reportType => {
    if (reportType !== 'custom') {
      form.setFieldsValue({ time: { type: reportType } })
    }
    onChange(reportType)
  }
  return (
    <Select style={{ width: '100%' }} value={value} onChange={handleOnChange}>
      {options.map(option => (
        <Select.Option key={option.key} value={option.key}>
          {option.name()}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectReportType
