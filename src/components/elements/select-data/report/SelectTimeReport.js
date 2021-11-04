import { Col, DatePicker, Row, Select } from 'antd'
import React from 'react'
import DatePickerYear from 'components/core/date-picker/DatePickerYear'
const timeOption = [
  {
    key: 'date',
    name: 'Ngày',
  },
  {
    key: 'year',
    name: 'Năm',
  },
]

const TimeReport = ({value = {}, reportType, onChange, setResultReport }) => {

  const handleOnChangeOption = key => {
    setResultReport({})
    onChange({ ...value, type: key })
  }

  const getValueOption = () => {
    if (reportType) return reportType

    if (value.type) return value.type

    return timeOption[0].key
  }

  return (
    <Row gutter={16}>
      <Col span={7}>
        <Select style={{ width: '100%' }} disabled={true} value={getValueOption()} onChange={handleOnChangeOption}>
          {timeOption.map(option => (
            <Select.Option key={option.key} value={option.key}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={17}>
        {reportType === 'year' ? (
          <DatePickerYear
          placeholder="Chọn thời gian"
          style={{ width: '100%' }}
          onChange={onChange}
          value={value}
          />
        ) : (
          <DatePicker onChange={onChange} style={{ width: '100%' }} placeholder="Chọn thời gian" />
        )}
      </Col>
    </Row>
  )
}

export default TimeReport
