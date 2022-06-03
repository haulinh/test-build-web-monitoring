import { Col, Collapse, Icon, Input, Row, Switch, Tooltip } from 'antd'
import { Clearfix } from 'components/elements'
import Text from 'components/elements/text'
import { Flex } from 'components/layouts/styles'
import {
  getVisibleEmailSubject,
  i18n,
} from 'containers/alarm/AlarmSetting/constants'
import { get } from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'

const { Panel } = Collapse

const CardTemplate = styled.div`
  padding: 12px 8px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const channels = [
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Web/Mobile',
    value: 'mobile',
  },
  {
    label: 'Webhook',
    value: 'webhook',
  },
]

const templateDefault = 'Station: {{station}} disconnected at {{time}}'

export default class ConfigTemplateStation extends Component {
  render() {
    const { form, alarmId, dataAlarmStation } = this.props
    return (
      <div>
        <Text>{i18n().drawer.title}</Text>
        <Clearfix height={4} />
        <CardTemplate>
          <Collapse>
            {channels.map(channel => {
              const isCustomTemplate = form.getFieldValue(
                `${alarmId}.channels.${channel.value}.customTemplate`
              )

              const visibleEmailSubject = getVisibleEmailSubject(channel.value)

              return (
                <Panel
                  key={channel.value}
                  header={channel.label}
                  extra={
                    <Row type="flex" align="middle" gutter={8}>
                      <Col>
                        <Flex alignItems="center" gap={5}>
                          Custom template
                          <Tooltip
                            placement="top"
                            title={i18n().drawer.tooltip.customTemplate}
                          >
                            <Icon
                              type="info-circle"
                              style={{ color: '#A2A7B3' }}
                            />
                          </Tooltip>
                          <Text fontWeight={500} style={{ color: '#A2A7B3' }}>
                            :
                          </Text>
                        </Flex>
                      </Col>

                      <Col onClick={e => e.stopPropagation()}>
                        {form.getFieldDecorator(
                          `${alarmId}.channels.${channel.value}.customTemplate`,
                          {
                            valuePropName: 'checked',
                          }
                        )(<Switch style={{ marginBottom: '2px' }} />)}
                      </Col>
                    </Row>
                  }
                >
                  {visibleEmailSubject && (
                    <Row gutter={5} style={{ marginBottom: 10 }}>
                      <Col>{i18n().drawer.emailSubject}</Col>
                      <Clearfix height={4} />
                      <Col>
                        {form.getFieldDecorator(
                          `${alarmId}.channels.${channel.value}.emailSubject`,
                          { initialValue: '' }
                        )(
                          <Input
                            style={{ width: '100%' }}
                            placeholder={i18n().drawer.placeholder.emailSubject}
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                  <Row gutter={5}>
                    <Col>
                      <Flex alignItems="center" gap={5}>
                        {i18n().drawer.templateSend}
                        <Tooltip
                          placement="top"
                          title={i18n().drawer.tooltip.exceed}
                        >
                          <Icon
                            type="info-circle"
                            style={{ color: '#A2A7B3' }}
                          />
                        </Tooltip>
                        <Text fontWeight={500} style={{ color: '#A2A7B3' }}>
                          :
                        </Text>
                      </Flex>
                    </Col>
                    <Clearfix height={4} />
                    <Col>
                      {form.getFieldDecorator(
                        `${alarmId}.channels.${channel.value}.template`,
                        {
                          initialValue:
                            get(
                              dataAlarmStation,
                              `channels.${channel.value}.template`
                            ) || templateDefault,
                        }
                      )(
                        <Input.TextArea
                          style={{ resize: 'none' }}
                          disabled={!isCustomTemplate}
                        />
                      )}
                    </Col>
                  </Row>
                </Panel>
              )
            })}
          </Collapse>
        </CardTemplate>
      </div>
    )
  }
}
