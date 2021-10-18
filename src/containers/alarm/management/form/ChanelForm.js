import { Col, Collapse, Icon, Row, Switch, Tooltip } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Clearfix } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import React from 'react'
import { alarmType, FIELDS } from '../index'
const { Panel } = Collapse

const channels = {
  email: {
    type: 'email',
    active: false,
    template: true,
    label: 'Email',
  },
  sms: {
    type: 'sms',
    active: false,
    template: true,
    label: 'SMS',
  },
  mobile: {
    type: 'mobile',
    active: false,
    template: true,
    label: 'Mobile',
  },
}

export const ChanelForm = ({ form }) => {
  const genExtra = type => {
    return (
      <React.Fragment>
        {form.getFieldDecorator(`${FIELDS.CHANNELS}.${type}.active`, {
          valuePropName: 'checked',
          initialValue: true,
        })(<Switch />)}
      </React.Fragment>
    )
  }

  const typeAlarm = form.getFieldValue(FIELDS.TYPE)
  const titleTooltip = alarmType[typeAlarm]
    .template()
    .split(',')
    .map(text => <div>{text}</div>)

  return (
    <React.Fragment>
      <div
        style={{
          fontSize: 14,
          color: 'black',
          fontWeight: 600,
          paddingBottom: 8,
        }}
      >
        {translate('alarm.title.chanel')}
      </div>
      <Collapse defaultActiveKey={['email', 'sms']}>
        {Object.values(channels).map(channel => (
          <Panel
            key={channel.type}
            header={channel.label}
            extra={genExtra(channel.type)}
          >
            <React.Fragment>
              <Row type="flex" gutter={6}>
                <Col>
                  <span>Template</span>
                </Col>
                <Col>
                  <Tooltip title={titleTooltip}>
                    <Icon
                      type="question-circle"
                      theme="outlined"
                      style={{ color: '#2F6BFF' }}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Clearfix height={4} />
              {form.getFieldDecorator(
                `${FIELDS.CHANNELS}.${channel.type}.template`,
                { initialValue: '' }
              )(<TextArea />)}
            </React.Fragment>
            {form.getFieldDecorator(`${FIELDS.CHANNELS}.${channel.type}.type`, {
              initialValue: channel.type,
            })(<div />)}
          </Panel>
        ))}
      </Collapse>
    </React.Fragment>
  )
}
