import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import QCVNApi from 'api/QCVNApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { get } from 'lodash'

@autobind
export default class SelectQCVN extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    isShowAll: PropTypes.bool
  }

  state = {
    lstQCVN: [],
    value: ''
  }

  async componentDidMount() {
    let query = {}
    const result = await QCVNApi.getQCVN({}, query)
    if (get(result, 'success', false)) {
      this.setState({
        lstQCVN: get(result, 'data', []),
        value: get(this.props.value, 'key', '')
      })
    }
  }

  onChange = value => {
    let res = this.state.lstQCVN.find(item => item.key === value)
    this.setState({
      value: value
    })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    return (
      <Select
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
        {this.state.lstQCVN.map(standardsVN => (
          <Select.Option key={standardsVN.key} value={standardsVN.key}>
            {standardsVN.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
