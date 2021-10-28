import { Select } from 'antd'
import React from 'react'

const clause = {
  and: {
    label: 'AND',
    value: 'and',
  },
  or: {
    label: 'OR',
    value: 'or',
  },
}

const SelectClause = props => {
  return (
    <Select {...props}>
      {Object.values(clause).map(clauseItem => (
        <Select.Option value={clauseItem.value} key={clauseItem.value}>
          {clauseItem.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectClause
