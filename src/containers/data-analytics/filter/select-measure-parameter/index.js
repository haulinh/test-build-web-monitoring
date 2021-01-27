import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

export default class SelectMeasureParameter extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.array,
  }

  handleChange = keys => {
    const { onChange } = this.props
    onChange(keys)
  }

  render() {
    const { value, options } = this.props
    return (
      <Select
        mode="multiple"
        value={value}
        maxTagCount={20}
        maxTagTextLength={15}
        style={{ width: '100%' }}
        onChange={this.handleChange}
      >
        {options.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
