import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

export const OPERATOR = {
  AVG: 'avg',
  MIN: 'min',
  MAX: 'max',
}

const OPERATOR_OPTIONS = [
  {
    text: 'Trung bình',
    value: OPERATOR.AVG,
  },
  {
    text: 'Giá trị nhỏ nhất',
    value: OPERATOR.MIN,
  },
  {
    text: 'Giá trị lớn nhất',
    value: OPERATOR.MAX,
  },
]

export default class SelectOperator extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    const { value, onChange } = this.props
    return (
      <Select value={value} onChange={onChange} style={{ width: '100%' }}>
        {OPERATOR_OPTIONS.map(item => (
          <Select.Option key={item.value} value={item.value}>
            {item.text}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
