import SelectProvince from 'components/elements/select-province'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from './index'

export default class SelectProvinceForm extends React.Component {
  render() {
    const { form, label, handleOnSelectProvince } = this.props
    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.PROVINCES, {
          initialValue: '',
          onChange: () => handleOnSelectProvince(),
        })(<SelectProvince isShowAll fieldValue="_id" isUsedId size="large" />)}
      </FormItem>
    )
  }
}
