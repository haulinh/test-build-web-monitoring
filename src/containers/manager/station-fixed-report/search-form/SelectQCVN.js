import SelectQCVN from 'components/elements/select-qcvn'
import { translate as t } from 'hoc/create-lang'
import React from 'react'
import { FormItemStyled, FIELDS } from './index'

const SelectQCVNForm = ({
  form,
  setStandardVNObject,
  handleOnSubmit = () => {},
}) => {
  const changeQCVN = value => {
    setStandardVNObject(value)
    handleOnSubmit()
  }

  const handleOnChange = () => {
    handleOnSubmit()
  }

  return (
    <FormItemStyled label="Quy chuẩn">
      {form.getFieldDecorator(FIELDS.STANDARDS_VN, {
        onChange: handleOnChange,
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
