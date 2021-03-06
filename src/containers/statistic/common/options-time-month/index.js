import React from 'react'
import { translate } from 'hoc/create-lang'
import { DatePicker } from 'antd'

const { MonthPicker } = DatePicker

export default class OptionsMonth extends React.Component {
  pickMonth = date => {
    this.props.onChangeMonth(date)
  }

  render() {
    return (
      <div>
        <MonthPicker
          size="large"
          onChange={(date, dateString) => this.pickMonth(date, dateString)}
          placeholder={translate('statistic.aqi.selectMonths')}
          format="MM-YYYY"
          style={{ width: '100%' }}
        />
      </div>
    )
  }
}
