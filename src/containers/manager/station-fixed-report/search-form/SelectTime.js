import { Select } from 'antd'
import { translate as t } from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'

import { FormItemStyled, i18n, FIELDS } from './index.js'

const OptionSelectTimeRange = ({ onSelect, foreceRerender, ...otherProps }) => {
  const optionsTimeRange = [
    {
      key: 1,
      text: 'dataSearchFrom.options.byHoursDetail',
      value: 24,
      detailHours: `${moment()
        .subtract(1, 'days')
        .format('DD/MM/YYYY HH:mm')} - ${moment().format('DD/MM/YYYY HH:mm')}`,
    },
    {
      key: 7,
      text: 'dataSearchFrom.options.byDayDetail',
      value: 7,
      detailDay: `${moment()
        .subtract(7, 'days')
        .startOf('day')
        .format('DD/MM/YYYY HH:mm')} - ${moment()
        .subtract(1, 'days')
        .endOf('day')
        .format('DD/MM/YYYY HH:mm')}`,
    },
    {
      key: 15,
      text: 'dataSearchFrom.options.byDayDetail',
      value: 15,
      detailDay: `${moment()
        .subtract(15, 'days')
        .startOf('day')
        .format('DD/MM/YYYY HH:mm')} - ${moment()
        .subtract(1, 'days')
        .endOf('day')
        .format('DD/MM/YYYY HH:mm')}`,
    },
    {
      key: 30,
      text: 'dataSearchFrom.options.byDayDetail',
      value: 30,
      detailDay: `${moment()
        .subtract(30, 'days')
        .startOf('day')
        .format('DD/MM/YYYY HH:mm')} - ${moment()
        .subtract(1, 'days')
        .endOf('day')
        .format('DD/MM/YYYY HH:mm')}`,
    },
  ]
  return (
    <Select onSelect={onSelect} size="large" {...otherProps}>
      {optionsTimeRange.map(option => (
        <Select.Option key={option.key} value={option.key}>
          {option.key === 1 &&
            t(option.text, {
              value: option.value,
              detailHours: option.detailHours,
            })}
          {option.key !== 1 &&
            t(option.text, {
              value: option.value,
              detailDay: option.detailDay,
            })}
        </Select.Option>
      ))}
      <Select.Option key="range" value={FIELDS.RANGE_PICKER}>
        {i18n.inRangeField}
      </Select.Option>
    </Select>
  )
}

const SelectTime = ({
  label,
  form,
  getConfig,
  foreceRerender,
  handleOnSelectTime,
}) => {
  return (
    <FormItemStyled label={label}>
      {form.getFieldDecorator('time', {
        ...getConfig(),
        initialValue: 1,
      })(
        <OptionSelectTimeRange
          foreceRerender={foreceRerender}
          onSelect={handleOnSelectTime}
        />
      )}
    </FormItemStyled>
  )
}

export default SelectTime
