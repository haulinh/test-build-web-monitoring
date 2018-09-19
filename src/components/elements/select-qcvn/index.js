import React, { PureComponent } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import QCVNApi from 'api/QCVNApi'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'

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
    const lstQCVN = await QCVNApi.getQCVN({}, query)
    console.log(lstQCVN)
    if (lstQCVN.success)
      this.setState({
        lstQCVN: lstQCVN.data,
        value: this.props.value
      })
  }

  onChange(value) {
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
        {this.state.lstQCVN.map(qcvn => (
          <Select.Option key={qcvn.key} value={qcvn.key}>
            {qcvn.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
