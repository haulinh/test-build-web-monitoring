import { Icon, Tooltip } from 'antd'
import React from 'react'

const ToolTipHint = ({ text }) => {
  return (
    <Tooltip title={text}>
      <Icon type="question-circle" />
    </Tooltip>
  )
}

export default ToolTipHint
