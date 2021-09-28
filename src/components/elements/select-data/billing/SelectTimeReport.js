import { Col, DatePicker, Icon, Input, Row, Select } from 'antd'
import { translate as t } from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

const QuarterPickerContainer = styled.div`
  position: absolute;
  z-index: 9999;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014,
    0 9px 28px 8px #0000000d;
  width: 280px;

  .quarter {
    text-align: center;
    &:hover {
      background-color: silver;
      cursor: pointer;
    }
  }

  .arrow {
    &:hover {
      color: silver;
      cursor: pointer;
    }
  }
`

const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

class QuarterPicker extends React.Component {
  state = {
    currentYear: moment(),
    quarterChose: 'Q1',
    open: false,
  }

  onClickPreYear = () => {
    this.setState(prevState => ({
      currentYear: prevState.currentYear.subtract(1, 'y'),
    }))
  }

  onClickNextYear = () => {
    this.setState(prevState => ({
      currentYear: prevState.currentYear.add(1, 'y'),
    }))
  }

  onQuarterClick = quarter => {
    const { currentYear } = this.state

    this.setState({ quarterChose: quarter, open: false }, () => {
      const value = `${currentYear.format('YYYY')}-${quarter}`

      this.props.onChange(value)
    })
  }

  getValue = () => {
    const { currentYear, quarterChose } = this.state
    if (!quarterChose) return ''
    const value = `${currentYear.format('YYYY')}-${quarterChose}`
    return value
  }

  render() {
    const { open, currentYear, quarterChose } = this.state
    const { value } = this.props
    return (
      <React.Fragment>
        <Input
          value={value && this.getValue()}
          className="quarter"
          onClick={() => this.setState({ open: true })}
        />
        {open && (
          <QuarterPickerContainer>
            <Row type="flex" justify="space-around">
              <Col>
                <Icon
                  className="arrow"
                  type="double-left"
                  theme="outlined"
                  onClick={this.onClickPreYear}
                />
              </Col>
              <Col>{currentYear.format('YYYY')}</Col>
              <Col>
                <Icon
                  className="arrow"
                  type="double-right"
                  theme="outlined"
                  onClick={this.onClickNextYear}
                />
              </Col>
            </Row>
            <Row gutter={16} type="flex" justify="space-around">
              {quarters.map(quarter => (
                <Col span={6}>
                  <div
                    className="quarter"
                    style={{
                      backgroundColor: quarterChose === quarter ? 'silver' : '',
                    }}
                    onClick={() => this.onQuarterClick(quarter)}
                  >
                    {quarter}
                  </div>
                </Col>
              ))}
            </Row>
          </QuarterPickerContainer>
        )}
      </React.Fragment>
    )
  }
}

class QuarterPickerCustom extends React.Component {
  state = {
    mode: ['month', 'month'],
    value: [],
    dates: [],
  }

  handlePanelChange = (value, mode) => {
    this.setState(
      {
        value,
        dates: value,
      },
      () => {
        this.props.onChange(value)
      }
    )
  }

  handleChange = value => {
    this.setState({ value })
  }

  render() {
    const { value, mode } = this.state

    return (
      <DatePicker.RangePicker
        placeholder={['Start month', 'End month']}
        format="YYYY-MM"
        value={value}
        mode={mode}
        onChange={this.handleChange}
        onPanelChange={this.handlePanelChange}
      />
    )
  }
}

const options = [
  {
    key: 'month',
    name: () => t('billing.option.month'),
  },
  {
    key: 'quarter',
    name: () => t('billing.option.quarter'),
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
    const { reportType, valuePicker, type } = this.props

    if (reportType === 'month') {
      return (
        <DatePicker.MonthPicker
          style={this.style}
          onChange={this.handleOnChange}
          value={valuePicker.value}
        />
      )
    }

    if (reportType === 'quarter') {
      return (
        <QuarterPicker
          onChange={this.handleOnChange}
          value={valuePicker.value}
        />
      )
    }

    if (reportType === 'custom' && type === 'quarter') {
      return (
        <QuarterPickerCustom
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
              {option.name()}
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
