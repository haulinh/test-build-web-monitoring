import { Col, Collapse, Icon, Input, Row, Switch, Tooltip } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Clearfix } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import React from 'react'
import { connect } from 'react-redux'
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
  webhook: {
    type: 'webhook',
    active: false,
    template: true,
    label: 'Webhook',
  },
}

@connect(state => ({
  alarmSelected: state.alarm.alarmSelected,
  alarmType: state.alarm.alarmType,
}))
export class ChanelForm extends React.Component {
  componentDidMount() {
    const { alarmSelected, form } = this.props
    if (alarmSelected) {
      form.setFieldsValue({ [FIELDS.CHANNELS]: alarmSelected[FIELDS.CHANNELS] })
    }
  }

  componentDidUpdate(prevProps) {
    const { alarmSelected, form } = this.props
    if (alarmSelected && prevProps.alarmSelected !== alarmSelected) {
      form.setFieldsValue({ [FIELDS.CHANNELS]: alarmSelected[FIELDS.CHANNELS] })
    }
  }

  genExtra = type => {
    const { form } = this.props
    return (
      <React.Fragment>
        {form.getFieldDecorator(`${FIELDS.CHANNELS}.${type}.active`, {
          valuePropName: 'checked',
          initialValue: true,
        })(<Switch />)}
      </React.Fragment>
    )
  }

  titleTooltip = () => {
    const { form } = this.props
    const typeAlarm = form.getFieldValue(FIELDS.TYPE)
    return alarmType[typeAlarm]
      .template()
      .split(',')
      .map(text => <div>{text}</div>)
  }

  render() {
    const { form } = this.props
    const typeAlarm = form.getFieldValue(FIELDS.TYPE)

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
        <Collapse defaultActiveKey={['email', 'sms', 'mobile', 'webhook']}>
          {Object.values(channels).map(channel => (
            <Panel
              key={channel.type}
              header={channel.label}
              extra={this.genExtra(channel.type)}
            >
              <React.Fragment>
                {channel.type === 'webhook' && (
                  <Row>
                    <Row>
                      {form.getFieldDecorator(
                        `${FIELDS.CHANNELS}.${channel.type}.config.method`,
                        { initialValue: 'POST' }
                      )(
                        <span>URL (POST)</span>
                      )}
                    </Row>
                    <Row>
                      {form.getFieldDecorator(
                        `${FIELDS.CHANNELS}.${channel.type}.config.endpoint`,
                      )(
                        <Input placeholder={translate('alarm.placeholder.management.webhook')} disabled={typeAlarm === alarmType.advance.value} />
                      )}
                    </Row>
                  </Row>
                )}
                <Clearfix height={4} />
                <Row type="flex" gutter={6}>
                  <Col>
                    <span>Template</span>
                  </Col>
                  <Col>
                    <Tooltip title={this.titleTooltip()}>
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
                  { initialValue: alarmType[typeAlarm].initialValue }
                )(
                  <TextArea
                    style={{ height: 150 }}
                    disabled={typeAlarm === alarmType.advance.value}
                  />
                )}
              </React.Fragment>
              {form.getFieldDecorator(
                `${FIELDS.CHANNELS}.${channel.type}.type`,
                {
                  initialValue: channel.type,
                }
              )(<div />)}
            </Panel>
          ))}
        </Collapse>
      </React.Fragment>
    )
  }
}
