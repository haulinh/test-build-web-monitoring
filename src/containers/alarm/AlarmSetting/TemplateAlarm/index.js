import { Row, Skeleton, Tabs as TabsAnt } from 'antd'
import { getAlarmConfig } from 'api/CategoryApi'
import { CloudCross, CpuSetting, Danger } from 'assets/icons'
import { get } from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { i18n } from '../constants'
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
    config: {},
    loading: false,
  }

  async componentDidMount() {
    this.setState({ loading: true })

    const res = await getAlarmConfig()
    if (res.success) {
      this.setState({ config: get(res, 'data.value') })
    }
    this.setState({ loading: false })
  }

  setConfig = newConfig => {
    this.setState({ config: newConfig })
  }

  render() {
    const { loading, config } = this.state

    return (
      <div style={{ background: '#FFFFFF', padding: 16, height: '100%' }}>
        <Skeleton loading={loading} active>
          <Tabs defaultActiveKey="threshold" tabPosition="left">
            <TabPane
              tab={
                <Row style={{ gap: 5 }} type="flex" align="middle">
                  <Danger />
                  {i18n().tabs.exceed}
                </Row>
              }
              key="threshold"
            >
              <ChannelTemplateList
                setConfig={this.setConfig}
                config={config}
                configType={get(config, `${FIELDS.DATA_LEVEL}.channels`)}
                configTypeKey={FIELDS.DATA_LEVEL}
              />
            </TabPane>

            <TabPane
              tab={
                <Row style={{ gap: 5 }} type="flex" align="middle">
                  <CloudCross />
                  {i18n().tabs.connection}
                </Row>
              }
              key="disconnect"
            >
              <ChannelTemplateList
                setConfig={this.setConfig}
                config={config}
                configType={get(config, `${FIELDS.DISCONNECT}.channels`)}
                configTypeKey={FIELDS.DISCONNECT}
              />
            </TabPane>

            <TabPane
              tab={
                <Row style={{ gap: 5 }} type="flex" align="middle">
                  <CpuSetting />
                  {i18n().tabs.device}
                </Row>
              }
              key="device"
            >
              <ChannelTemplateList
                setConfig={this.setConfig}
                config={config}
                configType={get(config, `${FIELDS.DEVICE}.channels`)}
                configTypeKey={FIELDS.DEVICE}
              />
            </TabPane>
          </Tabs>
        </Skeleton>
      </div>
    )
  }
}
