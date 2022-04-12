import { Col, DatePicker, Row, Select } from 'antd'
import {
  DatePickerRangeYear,
  DatePickerYear,
} from 'components/core/date-picker'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'

const { MonthPicker, RangePicker } = DatePicker

const dateTimeOption = [
  {
    key: 'date',
    name: t('report.type1_exceed.option.day'),
  },
]

const yearTimeOption = [
  {
    key: 'month',
    name: t('report.type1_exceed.option.month'),
  },
  {
    key: 'year',
    name: t('report.type1_exceed.option.year'),
  },
]

function PickTimes({ type, onChange, value }) {
  if (type === 'date') {
    return (
      <DatePicker
        format={['DD/MM/YYYY']}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
        placeholder={t('report.placeholder.time')}
        allowClear={false}
      />
    )
  }
  if (type === 'month') {
    return (
      <MonthPicker
        placeholder={t('report.type2_flow.option.chooseMonth')}
        style={{ width: '100%' }}
        onChange={onChange}
        allowClear={false}
        value={value[0]}
        format="MM/YYYY"
      />
    )
  }

  if (type === 'year') {
    return (
      <DatePickerRangeYear
        style={{ with: '100%' }}
        onChange={onChange}
        value={value}
      />
    )
  }
}

const TimeReport = ({ value: valueField = {}, reportType, onChange }) => {
  const handleOnChangeOption = type => {
    onChange({ ...valueField, type })
  }

  const handleOnPicker = value => {
    onChange({ ...valueField, value })
  }

  const isDisable =
    reportType === 'year' || reportType === 'month' ? false : true

  const getTimeOption = reportType => {
    const time = reportType === 'year' ? yearTimeOption : dateTimeOption
    return time
  }

  console.log(valueField)
  console.log(reportType)
  return (
    <Row gutter={16}>
      <Col span={7}>
        <Select
          style={{ width: '100%' }}
          disabled={isDisable}
          value={valueField.type}
          onChange={handleOnChangeOption}
        >
          {getTimeOption(reportType).map(option => (
            <Select.Option key={option.key} value={option.key}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={17}>
        <PickTimes
          type={valueField.type}
          onChange={handleOnPicker}
          value={valueField.value}
        />
      </Col>
    </Row>
  )
}

export default TimeReport
