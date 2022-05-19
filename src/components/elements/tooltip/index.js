import { Icon, Tooltip } from 'antd'
import React from 'react'

const ToolTip = ({ text }) => {
  return (
    <Tooltip title={text}>
      <Icon type="question-circle" />
    </Tooltip>
  )
}

ToolTip.defaultProps = {
  width: '1em',
  height: '1em',
}

export default ToolTip
