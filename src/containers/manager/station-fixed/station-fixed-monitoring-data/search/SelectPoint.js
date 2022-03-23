import { Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from './index'

export default class SelectPoint extends React.Component {
  render() {
    const { label, form, points } = this.props
    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.POINT)(
          <Select
            autoClearSearchValue
            allowClear
            mode="multiple"
            size="large"
            optionFilterProp="children"
            // this props allow search name and _id
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0 ||
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
      </FormItem>
    )
  }
}
