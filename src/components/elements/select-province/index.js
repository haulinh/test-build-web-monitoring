import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import ProvinceApi from 'api/ProvinceApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

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
    value: '',
    searchString: ''
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

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  onChange = value => {
    console.log(value)
    let res = this.state.lstProvices.find(item => item.key === value)
    this.setState({
      value: value
    })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  getLstProvices = () => {
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return this.state.lstProvices.filter(
        stationType =>
          replaceVietnameseStr(stationType.name).indexOf(searchString) > -1
      )
    }
    return this.state.lstProvices
  }

  render() {
    const lstProvices = this.getLstProvices()
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        allowClear
        {...this.props}
        onChange={this.onChange}
        onSearch={this.handleSearch}
        value={this.state.value}
        filterOption={false}
      >
        {this.props.isShowAll && (
          <Select.Option value={''}>
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {lstProvices.map(province => (
          <Select.Option key={province.key} value={province.key}>
            {province.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
