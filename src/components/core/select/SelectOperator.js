import { Select } from 'antd'
import React from 'react'

const operator = {
  eq: {
    label: '=',
    value: 'eq',
  },
  gt: {
    label: '>',
    value: 'gt',
  },
  lt: {
    label: '<',
    value: 'lt',
  },
  gte: {
    label: '>=',
    value: 'gte',
  },
  lte: {
    label: '<=',
    value: 'lte',
  },
}

const SelectOperator = props => {
  return (
    <Select {...props} style={{ width: '100%' }}>
      {Object.values(operator).map(operatorItem => (
        <Select.Option value={operatorItem.value} key={operatorItem.value}>
          {operatorItem.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectOperator
