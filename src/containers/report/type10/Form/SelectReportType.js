import React from 'react'
import { Select } from 'antd'
import { i18n, REPORT_TYPE } from '../constants'
// import { translate } from 'hoc/create-lang'

const SelectReportType = props => {
  return (
    <Select style={{ width: '100%' }} {...props}>
      <Select.Option value={REPORT_TYPE.BASIC}>
        {i18n().select.reportType.obtained}
      </Select.Option>
      <Select.Option value={REPORT_TYPE.ADVANCED}>
        {i18n().select.reportType.monitoring}
      </Select.Option>
    </Select>
  )
}

export default SelectReportType
