import { Input, DatePicker, InputNumber, Select } from 'antd'
import React from 'react'

export const DynamicComponent = ({ form, type, name, categories }) => {
  const Component = {
    text: <Input style={{ width: '100%' }} />,
    datetime: <DatePicker style={{ width: '100%' }} />,
    number: <InputNumber style={{ width: '100%' }} />,
    category: (
      <Select style={{ width: '100%' }}>
        {categories.map(option => (
          <Select.Option key={option.key} value={option.key}>
            {option.name}
          </Select.Option>
        ))}
      </Select>
    ),
  }

  return (
    <React.Fragment>
      {form.getFieldDecorator(name)(Component[type])}
    </React.Fragment>
  )
}
