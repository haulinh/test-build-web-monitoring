import { Checkbox, Col, Form, Row, Switch } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleSendAlarm } from 'redux/actions/globalAction'
import { channels, i18n } from '../constants'
import { getStatusAlarm, getStatusAlarmBoolean } from '../hoc/withAlarmForm'
import { FIELDS } from '../index'

const options = [
  { label: 'SMS', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'Web/ Mobile', value: 'mobile' },
  { label: 'Webhook', value: 'webhook' },
]

const getParamChannel = valueChannel => {
  const paramChannel = channels.reduce(
    (base, currentChanel) => {
      return {
        ...base,
        [currentChanel]: {
          active: valueChannel.includes(currentChanel),
        },
      }
    },
    {} // initial value
  )

  return paramChannel
}

@Form.create({})
@connect(null, {
  toggleSendAlarm,
})
export default class ToggleSendStationAlarm extends Component {
  componentDidMount() {
    this.setFieldsValue()
  }

  setFieldsValue = () => {
    const { alarmConfig, form } = this.props
    const fieldsValue = {
      [FIELDS.STATUS]: getStatusAlarmBoolean(alarmConfig.status),

      [FIELDS.CHANNELS]: Object.entries(alarmConfig.channels)
        .filter(([, channelValue]) => channelValue.active)
        .map(([channelKey]) => channelKey),
    }

    form.setFieldsValue(fieldsValue)
  }

  handleOnStatusChange = async value => {
    const { form, stationAutoId, toggleSendAlarm } = this.props

    const values = form.getFieldsValue()
    const valueChannel = get(values, [FIELDS.CHANNELS], [])

    const params = {
      [FIELDS.STATUS]: getStatusAlarm(value),
      channels: getParamChannel(valueChannel),
    }

    toggleSendAlarm(stationAutoId, params)
  }

  handleOnChannelChange = value => {
    const { form, stationAutoId, toggleSendAlarm } = this.props
    const values = form.getFieldsValue()

    const params = {
      [FIELDS.STATUS]: getStatusAlarm(values[FIELDS.STATUS]),
      channels: getParamChannel(value),
    }

    toggleSendAlarm(stationAutoId, params)
  }

  render() {
    const { form } = this.props
    const status = form.getFieldValue(FIELDS.STATUS)

    return (
      <Row type="flex" align="middle" gutter={25}>
        <Col>
          <Row type="flex" gutter={11} align="middle">
            <Col onClick={e => e.stopPropagation()}>
              {form.getFieldDecorator(FIELDS.STATUS, {
                valuePropName: 'checked',
                onChange: this.handleOnStatusChange,
              })(<Switch />)}
            </Col>
            <Col style={{ paddingRight: 25, borderRight: '2px solid #E5E7EB' }}>
              {i18n().toggle.sendAlarm}
            </Col>
          </Row>
        </Col>

        <Col>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              padding: '11px',
              borderRadius: '8px',
              border: '1px solid #D0D8E2',
              background: '#FFFFFF',
            }}
          >
            {form.getFieldDecorator(FIELDS.CHANNELS, {
              initialValue: [],
              onChange: this.handleOnChannelChange,
            })(<Checkbox.Group disabled={!status} options={options} />)}
          </div>
        </Col>
      </Row>
    )
  }
}
