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

  getRealy() {
    if (!this.props.value) return moment(new Date(), this.getDateFormat())
    if (typeof this.props.value === 'string') {
      return moment(this.props.value, this.getDateFormat())
    } else return this.props.value
  }

  render() {
    // console.log( this.props.value," this.props.value")
    //khi xử dung Form của Ant getFieldDecorator thì giá trị mặc định luôn là
    return (
      <Container>
        <DatePicker
          {...this.props}
          size={this.props.size}
          value={this.getRealy()}
          onChange={date => this.props.onChange(date)}
          format={this.getDateFormat()}
        />
      </Container>
    )
  }
}
