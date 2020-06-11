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
  }

  async componentDidMount() {
    let query = {}
    const result = await QCVNApi.getQCVN({}, query)
    if (get(result, 'success', false)) {
      this.setState({
        lstQCVN: get(result, 'data', []),
        value: get(this.props, 'value', undefined),
      })
    }
  }

  handleOnChange = value => {
    console.log(value)
    let res = this.state.lstQCVN.find(item => item.key === value)
    this.setState({ value })
    if (this.props.onHandleChange) this.props.onHandleChange(res, this)
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    return (
      <Select
        showSearch
        {...this.props}
        onChange={this.handleOnChange}
        value={this.state.value}
        defaultValue={this.props.value}
      >
        {this.props.isShowAll && (
          <Select.Option value="ALL">
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
