import { Col, Collapse, Input, Row, Switch } from 'antd'
import Text from 'components/elements/text'
import ToolTipHint from 'components/elements/tooltip'
import { Flex } from 'components/layouts/styles'
import { getVisibleEmailSubject } from 'containers/alarm/AlarmSetting/constants'
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
        <Text>Cấu hình chi tiết</Text>
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
                          <ToolTipHint text="Tool tip custom" />:
                        </Flex>
                      </Col>

                      <Col onClick={e => e.stopPropagation()}>
                        {form.getFieldDecorator(
                          `${alarmId}.channels.${channel.value}.customTemplate`
                        )(<Switch />)}
                      </Col>
                    </Row>
                  }
                >
                  {visibleEmailSubject && (
                    <Row gutter={5} style={{ marginBottom: 10 }}>
                      <Col>Email Subject:</Col>
                      <Col>
                        {form.getFieldDecorator(
                          `${alarmId}.channels.${channel.value}.emailSubject`,
                          { initialValue: '' }
                        )(
                          <Input
                            style={{ width: '100%' }}
                            placeholder="Nhập tiêu đề Email"
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                  <Row gutter={5}>
                    <Col>
                      <Flex alignItems="center" gap={5}>
                        Mẫu gửi
                        <ToolTipHint text="Tool tip custom" />:
                      </Flex>
                    </Col>
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
