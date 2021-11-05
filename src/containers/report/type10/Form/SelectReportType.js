import React from 'react'
import { Select } from 'antd'
import { translate } from 'hoc/create-lang'

const SelectReportType = props => {
  return (
    <Select style={{ width: '100%' }} {...props}>
      <Select.Option value="rangeTime">
        {translate('report.label.dataRatio.type.rangeTime')}
      </Select.Option>
      <Select.Option value="date">
        {translate('report.label.dataRatio.type.date')}
      </Select.Option>
    </Select>
  )
}

export default SelectReportType
