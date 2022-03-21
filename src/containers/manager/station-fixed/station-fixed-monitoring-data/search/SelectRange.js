import { DatePicker } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import React from 'react'
import { FIELDS } from './index'

const { RangePicker } = DatePicker

export default class SelectRange extends React.Component {
  render() {
    const { form, label } = this.props
    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.RANGE_PICKER)(
          <RangePicker style={{ width: '100%' }} format={DD_MM_YYYY} />
        )}
      </FormItem>
    )
  }
}
