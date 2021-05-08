import { Select } from 'antd'
import React from 'react'

import { FIELDS, FormItemStyled } from './index'

const SelectPhase = ({ label, form, getConfig, phases }) => {
  return (
    <FormItemStyled label={label}>
      {form.getFieldDecorator(
        FIELDS.PHASE,
        getConfig()
      )(
        <Select
          allowClear
          autoClearSearchValue
          size="large"
          mode="multiple"
          optionFilterProp="children"
          // this props allow search name and _id
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
              0 ||
            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: '100%' }}
        >
          {phases.map(phase => (
            <Select.Option key={phase._id} value={phase._id}>
              {phase.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </FormItemStyled>
  )
}

export default SelectPhase
