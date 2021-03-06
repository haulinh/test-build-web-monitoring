import React from 'react'
import { DatePicker } from 'antd'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import moment from 'moment'

import { translate } from 'hoc/create-lang'

function i18n() {
  return {
    startDate: translate('element.rangePicker.startDate'),
    endDate: translate('element.rangePicker.endDate'),
  }
}

const RangePicker = DatePicker.RangePicker

export default class RangePickerCustom extends React.PureComponent {
  static propTypes = {
    formatDate: PropTypes.string,
    size: PropTypes.string,
  }

  pickMonth = (date, dateString) => {
    const fromDate = _.get(date, '[0]', '')
    const toDate = _.get(date, '[1]', '')
    if (this.props.onChangeDate) this.props.onChangeDate(fromDate, toDate)

    this.props.onChange(date, dateString)
  }

  render() {
    return (
      <div>
        <RangePicker
          size={this.props.size || 'large'}
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [
              moment('00:00:00', 'HH:mm:ss'),
              moment('23:59:59', 'HH:mm:ss'),
            ],
          }}
          format={
            this.props.formatDate
              ? this.props.formatDate
              : 'DD/MM/YYYY HH:mm:ss'
          }
          onChange={(date, dateString) => this.pickMonth(date, dateString)}
          style={{ width: '100%' }}
          placeholder={[`${i18n().startDate}`, `${i18n().endDate}`]}
        />
      </div>
    )
  }
}
