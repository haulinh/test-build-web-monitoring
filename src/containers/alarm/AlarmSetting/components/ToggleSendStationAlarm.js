import { Row, Switch, Col, Checkbox, Divider, Form } from 'antd'
import update from 'immutability-helper'
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

@connect(null, {
  toggleSendAlarm,
})
@Form.create({
  onFieldsChange: (props, changedFields, allFields) => {
    // const statusChange = changedFields[FIELDS.STATUS]

    // if (statusChange && !statusChange.value) {
    //   return
    // }

    const { stationAutoId, toggleSendAlarm } = props

    const handleToggleSendAlarm = async () => {
      const params = {
        [FIELDS.STATUS]: getStatusAlarm(
          get(allFields, [FIELDS.STATUS, 'value'])
        ),
        channels: channels.reduce(
          (base, currentChanel) =>
            update(base, {
              [currentChanel]: {
                $set: {
                  active: get(
                    allFields,
                    [FIELDS.CHANNELS, 'value'],
                    []
                  ).includes(currentChanel),
                },
              },
            }),

          {}
        ),
      }
      toggleSendAlarm(stationAutoId, params)
    }

    handleToggleSendAlarm()
  },
})
export default class ToggleSendStationAlarm extends Component {
  handleOnStatusChange = value => {
    const { form } = this.props

    if (!value) {
      form.setFieldsValue({ [FIELDS.CHANNELS]: [] })
    }
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
