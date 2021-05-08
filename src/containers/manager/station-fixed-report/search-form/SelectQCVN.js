import SelectQCVN from 'components/elements/select-qcvn'
import React from 'react'
import { FormItemStyled } from './index'
import { translate as t } from 'hoc/create-lang'

const SelectQCVNForm = ({ form }) => {
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
          placeholder={t('stationAutoManager.form.qcvn.placeholder')}
          onHandleChange={this.changeQCVN}
        />
      )}
    </FormItemStyled>
  )
}

export default SelectQCVNForm
