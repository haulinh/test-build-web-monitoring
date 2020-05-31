import React, { PureComponent } from 'react'
import { Checkbox } from 'antd'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'

const CheckboxGroup = Checkbox.Group

const stationOptions = [
  { label: translate('qaqc.dataFilter.negative'), value: 'nagative' },
  { label: translate('qaqc.dataFilter.isZero'), value: 'zero' },
  { label: translate('qaqc.dataFilter.outOfRange'), value: 'out' },
]

@autobind
export default class DataFilterByView extends PureComponent {
  state = {
    value: null,
  }

  onChange = value => {
    this.setState({
      value,
    })
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    return <CheckboxGroup options={stationOptions} onChange={this.onChange} />
  }
}
