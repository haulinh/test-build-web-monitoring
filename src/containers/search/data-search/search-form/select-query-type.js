import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'


import createValidateComponent from 'components/elements/redux-form-validate'

const options = [
  { key: 'RAW', label: translate('qaqc.originalData') },
  { key: 'QCVN', label: translate('qaqc.validData') },
  { key: 'ANTI_QCVN', label: translate('qaqc.inValidData') },

]
@autobind
class SelectQueryType extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
  }

  state = {
    value: 'RAW',
  }

  onChange = value => {
    // console.log("ONchange select query form")
    this.setState({
      value,
    })
    // console.log(this.props.onChange, '=this.props.onChange')
    if (this.props.onHandleChange) this.props.onHandleChange(value)
  }

  render() {

    return <Select value={this.state.value} onChange={this.onChange}>
      {
        options.map(item => (
          <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
        ))
      }

    </Select>

  }
}

export default SelectQueryType

const FSelectQueryType = createValidateComponent(SelectQueryType)

export { FSelectQueryType }
