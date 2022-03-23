import { DatePicker } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import React from 'react'
import { FIELDS } from './index'
import styled from 'styled-components'
import createLang, { translate as t } from 'hoc/create-lang'

const { RangePicker } = DatePicker

const CustomRangePicker = styled(RangePicker)`
  .ant-input {
    height: 38px;
  }
`

export default class SelectRange extends React.Component {
  render() {
    const { form, label, changeTimeRange } = this.props
    return (
      <FormItem label={label}>
        {form.getFieldDecorator(FIELDS.RANGE_PICKER)(
          <CustomRangePicker
            onChange={changeTimeRange}
            style={{ width: '100%' }}
            format={DD_MM_YYYY}
            placeholder={[
              t('stationFixedManager.placeholder.timeRange.from'),
              t('stationFixedManager.placeholder.timeRange.to'),
            ]}
          />
        )}
      </FormItem>
    )
  }
}
