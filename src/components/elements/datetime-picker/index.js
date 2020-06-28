import React, { PureComponent } from 'react'
import { DatePicker } from 'antd'
import styled from 'styled-components'
import moment from 'moment-timezone'

const Container = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker-wrapper .react-datepicker__input-container {
    width: 100%;
  }
  .ant-calendar-picker {
    display: block;
  }
`
const dateFormat = 'DD/MM/YYYY'

export default class CalendarCustom extends PureComponent {
  getDateFormat() {
    return this.props.dateFormat ? this.props.dateFormat : dateFormat
  }

  getReady() {
    if (!this.props.value) return moment(new Date(), this.getDateFormat())
    if (typeof this.props.value === 'string') {
      if (moment(this.props.value, this.getDateFormat()).isValid()) {
        return moment(this.props.value, this.getDateFormat())
      } else return moment(new Date(this.props.value), this.getDateFormat())
    } else return this.props.value
  }

  handleChangeDate = date => {
    this.props.onChange(date)
  }

  render() {
    //khi xử dung Form của Ant getFieldDecorator thì giá trị mặc định luôn là
    const value = this.getReady()
    const format = this.getDateFormat()
    return (
      <Container>
        <DatePicker
          {...this.props}
          value={value}
          onChange={this.handleChangeDate}
          onBlur={this.handleBlur}
          format={format}
        />
      </Container>
    )
  }
}
