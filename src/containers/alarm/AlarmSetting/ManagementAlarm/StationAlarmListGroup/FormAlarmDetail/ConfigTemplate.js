import { Col, Collapse, Icon, Input, Row, Switch, Tooltip } from 'antd'
import { Clearfix } from 'components/elements'
import Text from 'components/elements/text'
import { Flex } from 'components/layouts/styles'
import {
  channelOptions,
  getVisibleSubject,
  subjectContent,
  i18n,
  alarmTypeObject,
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

const templateDefault = 'Station: {{station}} disconnected at {{time}}'

export default class ConfigTemplate extends Component {
  getTitleTooltipTemplate = () => {
    const { dataAlarmStation } = this.props
    const templateFn = get(
      alarmTypeObject,
      [dataAlarmStation.type, 'template'],
      () => ''
    )
    return templateFn()
      .split(',')
      .map(text => <div>{text}</div>)
  }

  render() {
    const { form, alarmId, dataAlarmStation } = this.props

    form.getFieldDecorator(`${alarmId}.channels.webhook.config.method`, {
      initialValue: 'POST',
    })

    return (
      <div>
        <Text>{i18n().drawer.title}</Text>
        <Clearfix height={4} />
        <CardTemplate>
          <Collapse>
            {channelOptions.map(channel => {
              const isCustomTemplate = form.getFieldValue(
                `${alarmId}.channels.${channel.value}.customTemplate`
              )

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
                          `${alarmId}.channels.${channel.value}.useCustom`,
                          {
                            valuePropName: 'checked',
                          }
                        )(
                          <Switch
                            size="small"
                            style={{ marginBottom: '2px' }}
                          />
                        )}
                      </Col>
                    </Row>
                  }
                >
                  {channel.value === 'webhook' && (
                    <Row gutter={5} style={{ marginBottom: 10 }}>
                      <Col>{subjectContent(alarmId)[channel.value].label}:</Col>
                      <Clearfix height={4} />
                      <Col>
                        {form.getFieldDecorator(
                          subjectContent(alarmId)[channel.value].fieldName,
                          { initialValue: '' }
                        )(
                          <Input
                            style={{ width: '100%' }}
                            placeholder={
                              subjectContent(alarmId)[channel.value].placeholder
                            }
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
                          title={this.getTitleTooltipTemplate()}
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
