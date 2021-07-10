import { Transfer, Form } from 'antd'
import { i18n } from 'containers/api-sharing/constants'
import { BoxShadow, Header } from 'containers/api-sharing/layout/styles'
import React, { Component } from 'react'

class TransferForm extends Component {
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    const { onChange } = this.props
    onChange(nextTargetKeys)
  }

  getDataSource = () => {
    const { data, value } = this.props
    const dataSource = data.filter(key => !(value || []).includes(key))
    return dataSource
  }

  render() {
    const { value } = this.props
    const dataSource = this.getDataSource()
    return (
      <Transfer
        titles={[
          i18n.detailPage.label.defaultParameter,
          i18n.detailPage.label.optionParamter,
        ]}
        listStyle={{
          width: 300,
        }}
        dataSource={dataSource}
        targetKeys={value}
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
    title: i18n.fields[item] || item,
  }))

  return (
    <BoxShadow>
      <Header>{i18n.detailPage.header.querySetting}</Header>
      <Form.Item>
        {form.getFieldDecorator('optionParams')(<TransferForm data={data} />)}
      </Form.Item>
    </BoxShadow>
  )
}

export default SettingQuery
