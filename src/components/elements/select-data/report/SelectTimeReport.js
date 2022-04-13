import { Col, DatePicker, Row, Select } from 'antd'
import {
  DatePickerRangeYear,
  DatePickerYear,
} from 'components/core/date-picker'
import DatePickerRangeMonth from 'components/core/date-picker/DatePickerRangeMonth'
import { translate as t } from 'hoc/create-lang'
import React from 'react'
import moment from 'moment'
import _ from 'lodash'

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
    return <DatePickerRangeMonth value={value} onChange={onChange} />
  }

  if (type === 'year') {
    return (
      <DatePickerYear
        style={{ with: '100%' }}
        onChange={onChange}
        value={
          _.isNumber(value[0]) ? value[0] : moment(value[0]).format('YYYY')
        }
      />
    )
  }
}

const TimeReport = ({ value: valueField = {}, reportType, onChange }) => {
  const handleOnChangeOption = type => {
    onChange({ ...valueField, type })
  }

  const handleOnPicker = value => {
    console.log(value)
    onChange({ ...valueField, value })
  }

  const isDisable =
    reportType === 'year' || reportType === 'month' ? false : true

  const getTimeOption = reportType => {
    const time =
      reportType === 'year' || reportType === 'month'
        ? yearTimeOption
        : dateTimeOption
    return time
  }

  console.log(valueField)

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
