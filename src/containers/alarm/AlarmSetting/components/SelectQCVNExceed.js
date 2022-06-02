import { Select, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { replaceVietnameseStr } from 'utils/string'

export class SelectQCVNExceed extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    qcvnList: PropTypes.array,
    selectedQCVNList: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array,
    ]),
  }

  state = {
    value: undefined,
    searchString: '',
  }

  handleOnChange = value => {
    const { qcvnList, onHandleChange, onChange } = this.props
    this.setState({ searchString: '' })
    let res = qcvnList.find(item => item.key === value)

    if (this.props.mode === 'multiple') {
      res = qcvnList.filter(item => value.includes(item.key))
    }
    this.setState({ value })
    if (onHandleChange) onHandleChange(res, this)
    if (onChange) onChange(value)
  }

  handleSearch = value => {
    this.setState({ searchString: value })
  }

  getListQCVN = () => {
    const { searchString } = this.state
    const { qcvnList } = this.props
    if (searchString) {
      const searchStringFormat = replaceVietnameseStr(searchString)
      return qcvnList.filter(
        standardVN =>
          replaceVietnameseStr(standardVN.name).indexOf(searchStringFormat) > -1
      )
    }
    return qcvnList
  }

  isDisabledQCVN = (selectedQCVNList, key) => {
    if (selectedQCVNList) {
      const isDisabled = selectedQCVNList.some(qcvn => qcvn._id === key)
      return isDisabled
    }
  }

  render() {
    const listQCVN = this.getListQCVN()
    const { selectedQCVNList, value } = this.props
    return (
      <Select
        {...this.props}
        showSearch
        allowClear
        onChange={this.handleOnChange}
        value={value || this.state.value}
        filterOption={false}
        style={{ width: '100%' }}
        onSearch={this.handleSearch}
      >
        {listQCVN.map(standardVN => (
          <Select.Option
            key={standardVN._id}
            value={standardVN._id}
            disabled={this.isDisabledQCVN(selectedQCVNList, standardVN._id)}
          >
            <Tooltip placement="top" title={standardVN.name}>
              <div
                style={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  width: '220px',
                }}
              >
                {standardVN.name}
              </div>
            </Tooltip>
          </Select.Option>
        ))}
      </Select>
    )
  }
}
