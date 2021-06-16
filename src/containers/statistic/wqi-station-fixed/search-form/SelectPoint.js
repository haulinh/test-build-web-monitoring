import { Select } from 'antd'
import React from 'react'

import { FIELDS, FormItemStyled } from './index'

const SelectPoint = ({ label, form, getConfig, points }) => {
  return (
    <FormItemStyled label={label}>
      {form.getFieldDecorator(
        FIELDS.POINT,
        getConfig()
      )(
        <Select
          autoClearSearchValue
          allowClear
          mode="multiple"
          size="large"
          optionFilterProp="children"
          // this props allow search name and _id
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
              0 ||
            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: '100%' }}
        >
          {points.map(point => (
            <Select.Option key={point.key} value={point.key}>
              {point.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </FormItemStyled>
  )
}

export default SelectPoint
