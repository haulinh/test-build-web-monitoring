import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import createValidateComponent from 'components/elements/redux-form-validate'

const options = [
  { key: 'value', label: 'qaqc.originalData' },
  { key: 'approvedValue', label: 'qaqc.approved' },
  { key: 'notValid', label: 'qaqc.notValid' },
]

@autobind
class SelectApprove extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  state = {
    value: 'value'
  }

  onChange = value => {
    this.setState({
      value
    })
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    return (
      <Select
        showSearch
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      >
        {options.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {translate(item.label)}
          </Select.Option>
        ))}
      </Select>
    )
  }
}

export default SelectApprove

const FSelectApprove = createValidateComponent(SelectApprove)

export { FSelectApprove }
