import { Transfer } from 'antd'
import React, { Component } from 'react'
import { BoxShadow } from '../styles'

class TransferForm extends Component {
  state = {
    targetKeys: [],
  }
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    const { onChange } = this.props
    this.setState({ targetKeys: nextTargetKeys })
    onChange(nextTargetKeys)
  }

  render() {
    const { data } = this.props
    const { targetKeys } = this.state
    return (
      <Transfer
        dataSource={data}
        targetKeys={targetKeys}
        onChange={this.handleChange}
        render={item => item.title}
      />
    )
  }
}

const SettingQuery = ({ form }) => {
  const fieldsValue = form.getFieldsValue()

  const data = Object.keys(fieldsValue.config).map(item => ({
    key: item,
    title: item,
  }))

  return (
    <BoxShadow>
      {form.getFieldDecorator('optionParams')(<TransferForm data={data} />)}
    </BoxShadow>
  )
}

export default SettingQuery
