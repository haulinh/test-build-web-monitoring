import React from 'react'
import { translate } from 'hoc/create-lang'
import { Select, DatePicker } from 'antd'
import moment from 'moment-timezone'
import { autobind } from 'core-decorators'
import * as _ from 'lodash'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'

const options = [
  { key: 1, text: 'dataSearchFrom.options.byHours', value: 24 },
  { key: 7, text: 'dataSearchFrom.options.byDay', value: 7 },
  { key: 15, text: 'dataSearchFrom.options.byDay', value: 15 },
  { key: 30, text: 'dataSearchFrom.options.byDay', value: 30 }
]

@autobind
export default class OptionsTimeRange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      rangesView: props.rangesView,
      defaultValue: props.rangesView
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.state.open, nextState.open) ||
      !_.isEqual(this.state.defaultValue, nextState.defaultValue) ||
      !_.isEqual(this.state.rangesView, nextState.rangesView) ||
      !_.isEqual(this.state.props, nextProps)
    )
  }

  handleSelect = value => {
    if (!_.isNumber(value)) {
      this.setState({
        defaultValue: undefined,
        open: true
      })
    } else {
      this.props.onChangeObject(value)
      this.setState({
        open: false,
        rangesView: '',
        defaultValue: undefined
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
      rangesView
    })
  }

  render() {
    // console.log(this.state.defaultValue,"this.state.defaultValue")
    // console.log(this.props.value,"this.props.value")
    return (
      <div>
        <Select
          {...this.props}
          value={this.state.defaultValue || this.props.value}
          onSelect={this.handleSelect}
        >
          {options.map(({ key, text, value }) => (
            <Select.Option key={key} value={key}>
              {translate(text, { value })}
            </Select.Option>
          ))}
          <Select.Option key={'ranges'}>
            {this.state.rangesView || translate('dataSearchFrom.options.range')}
          </Select.Option>
        </Select>
        {this.state.open && (
          <DatePicker.RangePicker
            open={true}
            ranges={{
              Today: [moment().startOf('day'), moment().endOf('day')],
              'This Month': [moment().startOf('month'), moment().endOf('month')]
            }}
            showTime={{
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('23:59:59', 'HH:mm:ss')
              ]
            }}
            format={DD_MM_YYYY_HH_MM}
            onOk={this.onOkDatePicker}
          />
        )}
      </div>
    )
  }
}
