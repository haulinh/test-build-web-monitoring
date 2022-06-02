import { Checkbox, Col, Divider, Form, Row, Switch } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleSendAlarm } from 'redux/actions/globalAction'
import { channels } from '../constants'
import { getStatusAlarm } from '../hoc/withAlarmForm'
import { FIELDS } from '../index'

const options = [
  { label: 'SMS', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'Web/ Mobile', value: 'mobile' },
  { label: 'Webhook', value: 'webhook' },
]

@Form.create({})
@connect(null, {
  toggleSendAlarm,
})
export default class ToggleSendStationAlarm extends Component {
  handleOnStatusChange = async value => {
    const { form, stationAutoId, toggleSendAlarm } = this.props

    const values = form.getFieldsValue()

    const params = {
      [FIELDS.STATUS]: getStatusAlarm(value),

      channels: channels.reduce(
        (base, currentChanel) => {
          const valueChannel = get(values, [FIELDS.CHANNELS], [])
          return {
            ...base,
            [currentChanel]: {
              active: valueChannel.includes(currentChanel),
            },
          }
        },

        {} // initial value
      ),
    }
    toggleSendAlarm(stationAutoId, params)
  }

  render() {
    const { form } = this.props
    const status = form.getFieldValue(FIELDS.STATUS)

    return (
      <Row type="flex" align="middle">
        <Row type="flex" gutter={11} align="middle">
          <Col onClick={e => e.stopPropagation()}>
            {form.getFieldDecorator(FIELDS.STATUS, {
              valuePropName: 'checked',
              onChange: this.handleOnStatusChange,
            })(<Switch />)}
          </Col>
          <Col>Gửi cảnh báo</Col>
        </Row>

        <Divider type="vertical" />

        <div
          onClick={e => e.stopPropagation()}
          style={{
            padding: '11px',
            borderRadius: '8px',
            border: '1px solid #D0D8E2',
          }}
        >
          {form.getFieldDecorator(FIELDS.CHANNELS, { initialValue: [] })(
            <Checkbox.Group disabled={!status} options={options} />
          )}
        </div>
      </Row>
    )
  }
}
