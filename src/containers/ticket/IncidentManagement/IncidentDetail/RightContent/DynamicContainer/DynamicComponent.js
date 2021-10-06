import { DatePicker, Select } from 'antd'
import { EditWrapper2 } from 'containers/ticket/Component'
import React from 'react'

const styleText = {
  color: '#262626',
  maxWidth: 300,
  fontSize: 14,
  textOverflow: 'ellipsis',
  whiteSpace: 'pre',
  overflow: 'hidden',
  border: '1px solid rgb(217, 217, 217)',
  height: 30,
  borderRadius: 4,
}

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
      <React.Fragment>
        {form.getFieldDecorator(name)(
          <EditWrapper2
            update={() => updateDynamicField(name)}
            style={styleText}
            prevValue={prevValue}
            revertValue={revertValue}
            name={name}
            type="input"
            value={values[name]}
          ></EditWrapper2>
        )}
      </React.Fragment>
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
      <React.Fragment>
        {form.getFieldDecorator(name)(
          <EditWrapper2
            style={styleText}
            update={() => updateDynamicField(name)}
            type="number"
            prevValue={prevValue}
            revertValue={revertValue}
            name={name}
            value={values[name]}
          ></EditWrapper2>
        )}
      </React.Fragment>
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
