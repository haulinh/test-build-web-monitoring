import SelectQCVN from 'components/elements/select-qcvn'
import React from 'react'
import { FormItemStyled } from './index'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'

const SelectQCVNForm = ({ form, setStandardVNObject }) => {
  const changeQCVN = value => {
    setStandardVNObject(value)
  }

  return (
    <FormItemStyled label="Quy chuẩn">
      {form.getFieldDecorator('standardsVN', {
        rules: [
          {
            required: false,
            message: t('stationAutoManager.form.qcvn.error'),
          },
        ],
      })(
        <SelectQCVN
          onHandleChange={changeQCVN}
          placeholder={t('stationAutoManager.form.qcvn.placeholder')}
        />
      )}
    </FormItemStyled>
  )
}

export default SelectQCVNForm
