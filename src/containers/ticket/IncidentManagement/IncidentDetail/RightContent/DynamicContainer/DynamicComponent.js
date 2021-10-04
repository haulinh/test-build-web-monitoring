import { DatePicker, Input, InputNumber, Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { EditWrapper } from 'containers/ticket/Component'
import React from 'react'

export const DynamicComponent = ({
  form,
  type,
  name,
  categories,
  updateDynamicField,
  prevValue,
}) => {
  const revertValue = fieldValue => form.setFieldsValue(fieldValue)

  const values = form.getFieldsValue()

  if (type === 'text')
    return (
      <EditWrapper
        update={() => updateDynamicField(name)}
        style={{ color: '#262626', fontWeight: 600, fontSize: 20 }}
        prevValue={prevValue}
        revertValue={revertValue}
        name={name}
        value={values[name]}
      >
        <FormItem>{form.getFieldDecorator(name)(<Input />)}</FormItem>
      </EditWrapper>
    )

  if (type === 'datetime')
    return (
      <React.Fragment>
        {form.getFieldDecorator(name)(
          <DatePicker
            style={{ width: '100%' }}
            onChange={date => updateDynamicField(name, date)}
          />
        )}
      </React.Fragment>
    )

  if (type === 'number')
    return (
      <EditWrapper
        update={() => updateDynamicField(name)}
        type="number"
        prevValue={prevValue}
        revertValue={revertValue}
        name={name}
        value={values[name]}
      >
        <FormItem>
          {form.getFieldDecorator(name)(
            <InputNumber style={{ width: '100%' }} />
          )}
        </FormItem>
      </EditWrapper>
    )

  if (type === 'category')
    return (
      <React.Fragment>
        {form.getFieldDecorator(name)(
          <Select
            style={{ width: '100%' }}
            onChange={value => updateDynamicField(name, value)}
          >
            {categories.map(option => (
              <Select.Option key={option.key} value={option.key}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </React.Fragment>
    )
}
