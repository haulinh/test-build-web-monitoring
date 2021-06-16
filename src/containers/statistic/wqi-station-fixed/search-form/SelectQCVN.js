import SelectQCVN from 'components/elements/select-qcvn'
import { translate as t } from 'hoc/create-lang'
import React from 'react'
import { FormItemStyled, FIELDS } from './index'

const SelectQCVNForm = ({ form, setStandardVNObject }) => {
  const changeQCVN = value => {
    setStandardVNObject(value)
  }

  return (
    <FormItemStyled label="Quy chuẩn">
      {form.getFieldDecorator(FIELDS.STANDARDS_VN, {
        rules: [
          {
            required: false,
            message: t('stationAutoManager.form.qcvn.error'),
          },
        ],
      })(
        <SelectQCVN
          mode="multiple"
          onHandleChange={changeQCVN}
          placeholder={t('stationAutoManager.form.qcvn.placeholder')}
        />
      )}
    </FormItemStyled>
  )
}

export default SelectQCVNForm
