import React from 'react'
import { FormItemStyled, FIELDS } from './index'
import SelectProvince from 'components/elements/select-province'

const SelectProvinceForm = ({ label, form, fetchPoints }) => {
  return (
    <FormItemStyled label={label}>
      {form.getFieldDecorator(FIELDS.PROVINCES)(
        <SelectProvince
          isShowAll
          onSelect={() => {
            form.setFieldsValue({
              [FIELDS.PHASE]: undefined,
              [FIELDS.POINT]: undefined,
            })
            fetchPoints()
          }}
          isUsedId
          size="large"
        />
      )}
    </FormItemStyled>
  )
}

export default SelectProvinceForm
