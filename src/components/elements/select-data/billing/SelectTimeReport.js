import { Col, DatePicker, Row, Select } from 'antd'
import { translate as t } from 'hoc/create-lang'
import React from 'react'

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

class TimePicker extends React.Component {
  style = { width: '100%' }

  state = {
    dates: [],
  }

  handleOnChange = value => {
    const { valuePicker } = this.props
    this.props.onChange({ ...valuePicker, value: value })
  }

  disabledDate = current => {
    const { dates } = this.state
    const { type } = this.props
    if (!dates || dates.length === 0) {
      return false
    }

    if (type === 'month') {
      return !current.isSame(dates[0], 'month')
    }

    return !current.isSame(dates[0], 'quarter')
  }

  onOpenChange = open => {
    if (open) {
      this.setState({ dates: [], hackValue: [] })
    }
  }

  render() {
    const { reportType, valuePicker } = this.props

    if (reportType === 'month') {
      return (
        <DatePicker.MonthPicker
          style={this.style}
          onChange={this.handleOnChange}
          value={valuePicker.value}
        />
      )
    }

    return (
      <DatePicker.RangePicker
        style={this.style}
        onCalendarChange={val => this.setState({ dates: val })}
        onChange={this.handleOnChange}
        disabledDate={this.disabledDate}
        onOpenChange={() => this.setState({ dates: [] })}
      />
    )
  }
}

const SelectTimeReport = ({
  value = {},
  onChange,
  reportType,
  setResultReport,
}) => {
  const handleOnChangeOption = key => {
    setResultReport({})
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
