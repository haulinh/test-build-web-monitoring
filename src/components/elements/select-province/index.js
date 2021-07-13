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
    isUsedId: PropTypes.bool,
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
      const data = get(result, 'data', [])
      this.setState({
        provinces: data,
        value: this.getValue(data),
      })
    }
  }

  getValue = dataSource => {
    if (
      typeof this.props.value === 'string' ||
      Array.isArray(this.props.value)
    ) {
      if (this.props.isUsedId && this.props.value) {
        let res = dataSource.find(item => item._id === this.props.value)
        return res.key
      }
      return this.props.value
    }
    if (this.props.value !== null && typeof this.props.value === 'object') {
      return this.props.value.key
    }
    if (this.props.isShowAll) return ''
    return undefined
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
    if (this.props.onChange) {
      if (this.props.isUsedId) {
        this.props.onChange(res._id)
      } else {
        this.props.onChange(value)
      }
    }
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
    const { fieldValue, value } = this.props
    return (
      <Select
        {...this.props}
        style={{ width: '100%' }}
        showSearch
        allowClear
        onChange={this.handleOnChange}
        onSearch={this.handleSearch}
        value={value || this.state.value}
        filterOption={false}
      >
        {this.props.isShowAll && (
          <Select.Option value="">
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {provinces.map(province => (
          <Select.Option
            key={province.key}
            value={province[fieldValue || 'key']}
          >
            {province.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
