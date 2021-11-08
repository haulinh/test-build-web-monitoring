import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import ProvinceApi from 'api/ProvinceApi'
// import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

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
    isShowOther: PropTypes.bool
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
        return res ? res.key : null
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
    const { provinces } = this.state
    const { onHandleChange, onChange, isUsedId, fieldValue } = this.props
    let res = provinces.find(item => item[fieldValue || 'key'] === value)
    if (value === '' || !res) {
      res = { key: '' }
    }
    if (typeof onHandleChange === 'function') onHandleChange(res, this)
    if (value === undefined) value = null
    if (onChange) {
      if (isUsedId) {
        onChange(res._id)
      } else {
        onChange(value)
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
    let defaultValue =
      typeof value === 'object' && value != null ? value.key : value
    return (
      <Select
        style={{ width: '100%' }}
        showSearch
        allowClear
        {...this.props}
        onChange={this.handleOnChange}
        onSearch={this.handleSearch}
        value={defaultValue || this.state.value}
        filterOption={false}
      >
        {this.props.isShowAll && (
          <Select.Option value="">
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {this.props.isShowOther && (
          <Select.Option value="other">
            {translate('dataSearchFrom.form.other')}
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
