import React from 'react'
import { Select } from 'antd'
import {translate as t } from 'hoc/create-lang'

const options = [
  {
    key: 'year',
    name: t('menuApp.report.type1_exceed.option.reportYear'),
  },
  {
    key: 'date',
    name: t('menuApp.report.type1_exceed.option.reportDay'),
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
