import React from 'react'
import { DatePicker } from 'antd'
import * as _ from 'lodash'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker

export default class OptionsMonth extends React.Component {
  pickMonth = date => {
    const fromDate = _.get(date, '[0]', '')
    const toDate = _.get(date, '[1]', '')
    this.props.onChangeDate(fromDate, toDate)
  }

  render() {
    return (
      <div>
        <RangePicker
          size="large"
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')]
          }}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [
              moment('00:00:00', 'HH:mm:ss'),
              moment('23:59:59', 'HH:mm:ss')
            ]
          }}
          format="DD/MM/YYYY HH:mm:ss"
          onChange={(date, dateString) => this.pickMonth(date, dateString)}
          style={{ width: '100%' }}
        />
      </div>
    )
  }
}
