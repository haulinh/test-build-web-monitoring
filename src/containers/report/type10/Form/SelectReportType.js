import React from 'react'
import { Select } from 'antd'
import { REPORT_TYPE } from '../constants'
// import { translate } from 'hoc/create-lang'

const SelectReportType = props => {
  return (
    <Select style={{ width: '100%' }} {...props}>
      <Select.Option value={REPORT_TYPE.BASIC}>
        Báo cáo tỷ lệ dữ liệu thu được
      </Select.Option>
      <Select.Option value={REPORT_TYPE.ADVANCED}>
        Báo cáo tỷ lệ số liệu quan trắc
      </Select.Option>
    </Select>
  )
}

export default SelectReportType
