import { Col, DatePicker, Row, Select } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

const options = [
  {
    key: 'month',
    name: t('billing.option.month'),
  },
  {
    key: 'quarter',
    name: t('billing.option.quarter'),
  },
]

const TimePicker = ({ reportType, type, onChange, valuePicker }) => {
  const style = { width: '100%' }

  const handleOnChange = value => {
    onChange({ ...valuePicker, value: value })
  }

  if (reportType === 'month') {
    return <DatePicker.MonthPicker style={style} onChange={handleOnChange} />
  }

  return <DatePicker.RangePicker style={style} onChange={handleOnChange} />
}

const SelectTimeReport = ({ value = {}, onChange, reportType }) => {
  const handleOnChangeOption = key => {
    onChange({ ...value, type: key })
  }

  const getValueOption = () => {
    if (reportType && reportType !== 'custom') return reportType

    if (value.type) return value.type

    return options[0].key
  }

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Select
          style={{ width: '100%' }}
          value={getValueOption()}
          disabled={reportType !== 'custom'}
          onChange={handleOnChangeOption}
        >
          {options.map(option => (
            <Select.Option key={option.key} value={option.key}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={16}>
        <TimePicker
          reportType={reportType}
          type={value.type}
          onChange={onChange}
          valuePicker={value}
        />
      </Col>
    </Row>
  )
}

export default SelectTimeReport
