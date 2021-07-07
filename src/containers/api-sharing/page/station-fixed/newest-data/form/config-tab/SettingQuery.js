import { Transfer, Form } from 'antd'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import { isView } from 'containers/api-sharing/util'
import React, { Component } from 'react'

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
    const { data, ...otherProps } = this.props
    const { targetKeys } = this.state
    return (
      <Transfer
        {...otherProps}
        titles={[
          i18n.detailPage.label.defaultParameter,
          i18n.detailPage.label.optionParamter,
        ]}
        listStyle={{
          width: 300,
        }}
        dataSource={data}
        targetKeys={targetKeys}
        onChange={this.handleChange}
        render={item => item.title}
      />
    )
  }
}

const SettingQuery = ({ form, rule }) => {
  const fieldsValue = form.getFieldsValue()

  const data = Object.keys(fieldsValue.config).map(item => ({
    key: item,
    title: i18n.fields[item] || item,
    // title: item,
  }))

  return (
    <BoxShadow>
      <Header>{i18n.detailPage.header.querySetting}</Header>
      <Form.Item>
        {form.getFieldDecorator('optionParams')(
          <TransferForm data={data} disabled={isView(rule)} />
        )}
      </Form.Item>
    </BoxShadow>
  )
}

export default SettingQuery
