import React from 'react'
import { translate } from 'hoc/create-lang'
import { Select, DatePicker } from 'antd'
import moment from 'moment-timezone'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'


@connect(state => ({
  locale: state.language.locale,
  fromDate: _.get(state, 'form.dataSearchFilterForm.values.fromDate', {}),
}))
@autobind
export default class OptionsTimeRange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      rangesView: props.rangesView,
      defaultValue: props.rangesView,
    }
    this.locale = require('antd/es/date-picker/locale/en_US')
  }

  componentDidMount() {
    if (this.props.locale === 'vi') {
      this.locale = require('antd/es/date-picker/locale/vi_VN')
      require('moment/locale/vi')
    } else {
      require('moment/locale/en-sg')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("shouldComponentUpdate")
    return (
      !_.isEqual(this.state.open, nextState.open) ||
      !_.isEqual(this.state.defaultValue, nextState.defaultValue) ||
      !_.isEqual(this.state.rangesView, nextState.rangesView) ||
      !_.isEqual(this.props.value, nextProps.value) ||
      !_.isEqual(this.props.rangesView, nextProps.rangesView) ||
      !_.isEqual(this.props.triggerRerender, nextProps.triggerRerender) ||
      !_.isEqual(this.props.fromDate, nextProps.fromDate)
    )
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("componentDidUpdate")
    if (!_.isEqual(prevProps.rangesView, this.props.rangesView)) {
      this.setState({
        rangesView: this.props.rangesView,
        defaultValue: this.props.defaultValue,
      })
    }
  }

  handleSelect = value => {
    // console.log("select range " + value)
    if (!_.isNumber(value)) {
      this.setState({
        defaultValue: undefined,
        open: true,
      })
    } else {
      this.props.onChangeObject(value)
      this.setState({
        open: false,
        rangesView: '',
        defaultValue: undefined,
      })
    }
  }

  onOkDatePicker = ranges => {
    let rangesView = ''
    _.forEach(ranges, range => {
      rangesView += range.format(DD_MM_YYYY_HH_MM)
      if (!_.includes(rangesView, '-')) {
        rangesView += ' - '
      }
    })

    this.props.onChangeObject(ranges)
    this.setState({
      open: false,
      rangesView,
    })
  }

  render() {
    // console.log("Time range rerender")
    const options = [
      {
        key: 1,
        text: 'dataSearchFrom.options.byHoursDetail',
        value: 24,
        detailHours: `${moment()
          .subtract(1, 'days')
          .format('DD/MM/YYYY HH:mm')} - ${moment().format('DD/MM/YYYY HH:mm')}`,
      },
      {
        key: 7,
        text: 'dataSearchFrom.options.byDayDetail',
        value: 7,
        detailDay: `${moment()
          .subtract(8, 'days')
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
          .subtract(16, 'days')
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
          .subtract(31, 'days')
          .startOf('day')
          .format('DD/MM/YYYY HH:mm')} - ${moment()
            .subtract(1, 'days')
            .endOf('day')
            .format('DD/MM/YYYY HH:mm')}`,
      },
    ]
    // console.log("Time range com " + this.state.defaultValue || this.props.value)
    const locale = this.locale.default
    return (
      <div>
        <Select
          {...this.props}
          value={this.state.defaultValue || this.props.value}
          onSelect={this.handleSelect}
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
            {this.state.rangesView ||
              this.props.rangesView ||
              translate('dataSearchFrom.options.range')}
          </Select.Option>
        </Select>
        {this.state.open && (
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
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss'),
              ],
            }}
            format={DD_MM_YYYY_HH_MM}
            onOk={this.onOkDatePicker}
          />
        )}
      </div>
    )
  }
}
