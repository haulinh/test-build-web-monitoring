import React from 'react'
import { get } from 'lodash'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Select, DatePicker } from 'antd'

import { translate } from 'hoc/create-lang'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

const LOCALE = {
  vi: { lib: 'vi_VN', moment: 'vi' },
  en: { lib: 'en_US', moment: 'en-sg' },
  tw: { lib: 'en_US', moment: 'en-sg' },
}

const Container = styled.div``
@connect(state => ({
  locale: state.language.locale,
}))
class OptionsTimeRange extends React.Component {
  state = {
    open: false,
  }

  locale = {}

  componentDidMount() {
    const { locale } = this.props

    this.locale = require(`antd/es/date-picker/locale/${LOCALE[locale].lib}`)
    require(`moment/locale/${LOCALE[locale].moment}`)
  }

  onSelect = value => {
    const { onChange } = this.props
    if (typeof value === 'number') {
      onChange(value)
      return
    }
    this.setState({ open: true })
  }

  onSelectRange = ranges => {
    const { onChange } = this.props
    onChange(ranges)
    this.setState({ open: false })
  }

  formatRanges = ranges =>
    Array.isArray(ranges)
      ? ranges.map(item => moment(item).format(DD_MM_YYYY_HH_MM)).join(' - ')
      : null

  render() {
    const options = [
      {
        key: 1,
        text: 'dataSearchFrom.options.byHoursDetail',
        value: 24,
        detailHours: `${moment()
          .subtract(1, 'days')
          .format('DD/MM/YYYY HH:mm')} - ${moment().format(
          'DD/MM/YYYY HH:mm'
        )}`,
      },
      {
        key: 7,
        text: 'dataSearchFrom.options.byDayDetail',
        value: 7,
        detailDay: `${moment()
          .subtract(7, 'days')
          .startOf('day')
          .format('DD/MM/YYYY HH:mm')} - ${moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('DD/MM/YYYY HH:mm')}`,
      },
      {
        key: 15,
        text: 'dataSearchFrom.options.byDayDetail',
        value: 15,
        detailDay: `${moment()
          .subtract(15, 'days')
          .startOf('day')
          .format('DD/MM/YYYY HH:mm')} - ${moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('DD/MM/YYYY HH:mm')}`,
      },
      {
        key: 30,
        text: 'dataSearchFrom.options.byDayDetail',
        value: 30,
        detailDay: `${moment()
          .subtract(30, 'days')
          .startOf('day')
          .format('DD/MM/YYYY HH:mm')} - ${moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('DD/MM/YYYY HH:mm')}`,
      },
    ]
    const { open } = this.state
    const { value, ...otherProps } = this.props
    const locale = get(this.locale, 'default')

    return (
      <Container>
        <Select
          {...otherProps}
          value={!Array.isArray(value) ? value : this.formatRanges(value)}
          style={{ width: '100%' }}
          onSelect={this.onSelect}
        >
          {options.map(option => (
            <Select.Option key={option.key} value={option.key}>
              {option.key === 1 &&
                translate(option.text, {
                  value: option.value,
                  detailHours: option.detailHours,
                })}
              {option.key !== 1 &&
                translate(option.text, {
                  value: option.value,
                  detailDay: option.detailDay,
                })}
            </Select.Option>
          ))}
          <Select.Option key="ranges">
            {this.formatRanges(value) ||
              translate('dataSearchFrom.options.range')}
          </Select.Option>
        </Select>
        {open && (
          <DatePicker.RangePicker
            open={true}
            locale={locale}
            ranges={{
              [locale.lang.today]: [
                moment().startOf('day'),
                moment().endOf('day'),
              ],
              [locale.lang.month]: [
                moment().startOf('month'),
                moment().endOf('month'),
              ],
            }}
            showTime={{
              defaultValue: [
                moment('00:00:00', 'HH:mm'),
                moment('23:59:59', 'HH:mm'),
              ],
            }}
            format={DD_MM_YYYY_HH_MM}
            onOk={this.onSelectRange}
          />
        )}
      </Container>
    )
  }
}

export default OptionsTimeRange
