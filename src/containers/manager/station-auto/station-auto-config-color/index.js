import React from 'react'
import { Tabs, Radio } from 'antd'
import TabItemColorData from './tabs/colorData'
import TabItemColorSensor from './tabs/colorSensor'

import { Form } from 'antd'

import { translate } from 'hoc/create-lang'

import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'

const { TabPane } = Tabs

const i18n = {
  tabColorData: translate('page.config.color.button.selectTabData'),
  tabColorSensor: translate('page.config.color.button.selectTabSensor')
}

@Form.create({})
export default class StationAutoConfigColor extends React.Component {
  static defaultProps = {}
  static propTypes = {}

  state = {
    keyData: 'data',
    keySensor: 'sensor',
    defaultTabKey: 'data',
    activeTabKey: 'data'
  }

  render() {
    const { keyData, keySensor, defaultTabKey, activeTabKey } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['configColor']} />

        <Radio.Group
          defaultValue={defaultTabKey}
          onChange={this._changeTabKey}
          style={{ marginBottom: 16, width: '100%' }}
          buttonStyle="solid"
        >
          <Radio.Button
            value={keyData}
            style={{ width: '50%', textAlign: 'center' }}
          >
            {i18n.tabColorData}
          </Radio.Button>
          <Radio.Button
            value={keySensor}
            style={{ width: '50%', textAlign: 'center' }}
          >
            {i18n.tabColorSensor}
          </Radio.Button>
        </Radio.Group>

        <Tabs
          defaultActiveKey={defaultTabKey}
          activeKey={activeTabKey}
          renderTabBar={() => <div />}
        >
          <TabPane key={keyData}>
            <TabItemColorData />
          </TabPane>
          <TabPane key={keySensor}>
            <TabItemColorSensor />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }

  _changeTabKey = e => {
    this.setState({ activeTabKey: e.target.value })
  }
}
