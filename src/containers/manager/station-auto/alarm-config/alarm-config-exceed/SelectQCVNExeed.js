import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import QCVNApi from 'api/QCVNApi'
// import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'
import { replaceVietnameseStr } from 'utils/string'

// @autobind
export default class SelectQCVNExceed extends PureComponent {
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
    value: undefined,
    searchString: '',
  }

  handleOnChange = value => {
    this.setState({ searchString: '' })
    let res = this.props.qcvnList.find(item => item.key === value)

    if (this.props.mode === 'multiple') {
      res = this.props.qcvnList.filter(item => value.includes(item.key))
    }
    this.setState({ value })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  getListQCVN = () => {
    if (this.state.searchString) {
      const searchString = replaceVietnameseStr(this.state.searchString)
      return this.props.qcvnList.filter(
        standardVN =>
          replaceVietnameseStr(standardVN.name).indexOf(searchString) > -1
      )
    }
    return this.props.qcvnList
  }

  isDisabledQCVN = (selectedQCVNList, key) => {
    if (selectedQCVNList) {
      const isDisabled = selectedQCVNList.some(qcvn => qcvn.key === key)
      return isDisabled
    }
  }

  render() {
    const listQCVN = this.getListQCVN()
    const { selectedQCVNList } = this.props
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
          <Select.Option
            key={standardVN.key}
            value={standardVN.key}
            disabled={this.isDisabledQCVN(selectedQCVNList, standardVN.key)}
          >
            {standardVN.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
