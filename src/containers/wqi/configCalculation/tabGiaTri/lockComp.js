import React from 'react'
import { Icon } from 'antd'

export default ({ isLocked, onClick, left, right }) => (
  <Icon
    onClick={onClick}
    style={{
      fontSize: 24,
      color: isLocked ? '#1890ff' : 'red',
      cursor: 'pointer',
      marginLeft: left,
      marginRight: right,
    }}
    type={isLocked ? 'unlock' : 'lock'}
  />
)
