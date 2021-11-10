import React from 'react'
import { Select } from 'antd'
import { translate as t } from 'hoc/create-lang'

const options = [
  {
    key: 'date',
    name: t('report.type1_exceed.option.reportDay'),
  },
  {
    key: 'year',
    name: t('report.type1_exceed.option.reportYear'),
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
