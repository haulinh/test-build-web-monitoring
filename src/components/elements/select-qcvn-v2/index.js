import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import QCVNApi from 'api/QCVNApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

@autobind
export default class SelectQCVN extends PureComponent {
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
    lstQCVN: [],
    value: undefined,
    searchString: '',
  }

  async componentDidMount() {
    let query = {}
    const result = await QCVNApi.getQCVN({}, query)
    if (get(result, 'success', false)) {
      const data = get(result, 'data', [])
      this.setState({
        lstQCVN: data,
        value: this.getValue(data),
      })
    }
  }

  handleOnChange = value => {
    this.setState({ searchString: '' })
    this.setState({ value })
    let res = this.state.lstQCVN.find(item => item._id === value)
    if (value === '' || !res) {
      res = { key: '' }
    }
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (value === undefined) value = null
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  getListQCVN = () => {
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return this.state.lstQCVN.filter(
        standardVN =>
          replaceVietnameseStr(standardVN.name).indexOf(searchString) > -1
      )
    }
    return this.state.lstQCVN
  }

  getValue = dataSource => {
    if (
      typeof this.props.value === 'string' ||
      Array.isArray(this.props.value)
    ) {
      return this.props.value
    }
    if (this.props.value !== null && typeof this.props.value === 'object') {
      return this.props.value.key
    }
    if (this.props.isShowAll) return ''
    return undefined
  }

  render() {
    const listQCVN = this.getListQCVN()
    // console.log(listQCVN, this.state.searchString, '--listQCVN--')
    return (
      <Select
        {...this.props}
        showSearch
        allowClear
        onChange={this.handleOnChange}
        value={this.state.value}
        filterOption={false}
        style={{ width: '100%' }}
        onSearch={this.handleSearch}
      >
        {this.props.isShowAll && (
          <Select.Option value="ALL">
            {translate('dataSearchFrom.form.all')}
          </Select.Option>
        )}
        {listQCVN.map(standardVN => (
          <Select.Option key={standardVN._id} value={standardVN._id}>
            {standardVN.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
