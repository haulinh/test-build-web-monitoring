import { Collapse, Switch } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Clearfix } from 'components/layouts/styles'
import React from 'react'
import { FIELDS } from '../index'
const { Panel } = Collapse

const channels = {
  email: {
    type: 'email',
    active: false,
    template: 'abc',
    label: 'Email',
  },
  sms: {
    type: 'sms',
    active: false,
    template: 'abc',
    label: 'SMS',
  },
  mobile: {
    type: 'mobile',
    active: false,
    template: 'abc',
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

  return (
    <React.Fragment>
      <Collapse defaultActiveKey={['email', 'sms', 'mobile']}>
        {Object.values(channels).map(channel => (
          <Panel
            key={channel.type}
            header={channel.label}
            extra={genExtra(channel.type)}
          >
            <span>Template</span>
            <Clearfix height={4} />
            {form.getFieldDecorator(
              `${FIELDS.CHANNELS}.${channel.type}.template`,
              { initialValue: '' }
            )(<TextArea />)}
            {form.getFieldDecorator(`${FIELDS.CHANNELS}.${channel.type}.type`, {
              initialValue: channel.type,
            })(<div />)}
          </Panel>
        ))}
      </Collapse>
    </React.Fragment>
  )
}
