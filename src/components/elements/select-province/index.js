import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import ProvinceApi from 'api/ProvinceApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

@autobind
export default class SelectProvince extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array,
    ]),
    isShowAll: PropTypes.bool,
  }

  state = {
    provinces: [],
    value: undefined,
    searchString: '',
  }

  async componentDidMount() {
    let query = {}
    const result = await ProvinceApi.getProvinces({}, query)
    if (get(result, 'success', false)) {
      this.setState({
        provinces: get(result, 'data', []),
        value: get(
          this.props.value,
          'key',
          this.props.isShowAll ? '' : undefined
        ),
      })
    }
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  handleOnChange = value => {
    this.setState({ value })
    let res = this.state.provinces.find(item => item.key === value)
    if (value === '' || !res) {
      res = { key: '' }
    }
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (value === undefined) value = null
    if (this.props.onChange) this.props.onChange(value)
  }

  getProvinces = () => {
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return this.state.provinces.filter(
        stationType =>
          replaceVietnameseStr(stationType.name).indexOf(searchString) > -1
      )
    }
    return this.state.provinces
  }

  render() {
    const provinces = this.getProvinces()
    return (
      <Select
        {...this.props}
        style={{ width: '100%' }}
        showSearch
        onChange={this.handleOnChange}
        onSearch={this.handleSearch}
        value={this.state.value}
        filterOption={false}
      >
        {this.props.isShowAll && (
          <Select.Option value="">
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {provinces.map(province => (
          <Select.Option key={province.key} value={province.key}>
            {province.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
