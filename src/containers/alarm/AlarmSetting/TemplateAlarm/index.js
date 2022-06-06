import { Row, Skeleton, Tabs as TabsAnt } from 'antd'
import { getAlarmConfig } from 'api/CategoryApi'
import { CloudCross, CpuSetting, Danger } from 'assets/icons'
import { get } from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { FIELDS } from '../index'
import ChannelTemplateList from './ChannelTemplateList'

const { TabPane } = TabsAnt

const Tabs = styled(TabsAnt)`
  height: 100%;
  .ant-tabs-bar {
    min-width: 250px;
    border-right: unset;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    min-height: 100%;
  }
  .ant-tabs-ink-bar {
    display: none !important;
  }
  .ant-tabs-content {
    border-left: unset;
  }
`

export default class TemplateAlarm extends Component {
  state = {
    configTemplate: {},
    loading: false,
  }
  async componentDidMount() {
    this.setState({ loading: true })
    try {
      const res = await getAlarmConfig()
      this.setState({ configTemplate: res.data.value })
      this.setState({ loading: false })
    } catch (error) {
      console.error({ error })
    }
  }

  render() {
    const { loading, configTemplate } = this.state

    return (
      <div style={{ background: '#FFFFFF', padding: 16, height: '100%' }}>
        <Skeleton loading={loading} active>
          <Tabs defaultActiveKey="threshold" tabPosition="left">
            <TabPane
              tab={
                <Row style={{ gap: 5 }} type="flex" align="middle">
                  <Danger />
                  Vượt ngưỡng
                </Row>
              }
              key="threshold"
            >
              <ChannelTemplateList
                config={get(configTemplate, `${FIELDS.DATA_LEVEL}.channels`)}
              />
            </TabPane>

            <TabPane
              tab={
                <Row style={{ gap: 5 }} type="flex" align="middle">
                  <CloudCross />
                  Tín hiệu
                </Row>
              }
              key="disconnect"
            >
              <ChannelTemplateList
                config={get(configTemplate, `${FIELDS.DISCONNECT}.channels`)}
              />
            </TabPane>

            <TabPane
              tab={
                <Row style={{ gap: 5 }} type="flex" align="middle">
                  <CpuSetting />
                  Thiết bị
                </Row>
              }
              key="device"
            >
              <ChannelTemplateList
                config={get(configTemplate, `${FIELDS.DEVICE}.channels`)}
              />
            </TabPane>
          </Tabs>
        </Skeleton>
      </div>
    )
  }
}
