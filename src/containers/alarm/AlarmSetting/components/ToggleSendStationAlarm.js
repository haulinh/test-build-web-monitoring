import { Row, Switch, Col, Checkbox, Divider } from 'antd'

import React, { Component } from 'react'

const options = [
  { label: 'SMS', value: 'sms' },
  { label: 'Email', value: 'email' },
  { label: 'Web/ Mobile', value: 'web' },
  { label: 'Webhook', value: 'webhook' },
]

export default class ToggleSendStationAlarm extends Component {
  render() {
    const onChangeChannel = value => {
      console.log({ value })
    }

    return (
      <Row type="flex" align="middle">
        <Row type="flex" gutter={11} align="middle">
          <Col onClick={e => e.stopPropagation()}>
            <Switch />
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
          <Checkbox.Group options={options} onChange={onChangeChannel} />
        </div>
      </Row>
    )
  }
}
