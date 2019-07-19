import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import ProvinceApi from 'api/ProvinceApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'

@autobind
export default class SelectProvice extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.object,
    isShowAll: PropTypes.bool
  }

  state = {
    lstProvices: [],
    value: ''
  }

  async componentDidMount() {
    let query = {}
    const result = await ProvinceApi.getProvices({}, query)
    if (get(result, 'success', false)) {
      this.setState({
        lstProvices: get(result, 'data', []),
        value: get(this.props.value, 'key', '')
      })
    }
  }

  onChange = value => {
    let res = this.state.lstProvices.find(item => item.key === value)
    this.setState({
      value: value
    })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    return (
      <Select
        style={{ width: '100%' }} 
        showSearch
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      >
        {this.props.isShowAll && (
          <Select.Option value={''}>
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {this.state.lstProvices.map(province => (
          <Select.Option key={province.key} value={province.key}>
            {province.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
