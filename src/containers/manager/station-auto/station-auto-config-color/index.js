import React from 'react'
import { Tabs } from 'antd'
import TabItemColorData from './tabs/colorData'
// import TabItemColorSensor from './tabs/colorSensor'

import { Form } from 'antd'

import { translate } from 'hoc/create-lang'
import Clearfix from 'components/elements/clearfix'

import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'

const { TabPane } = Tabs

function i18n() {
  return {
    tabColorData: translate('page.config.color.button.selectTabData'),
    tabColorSensor: translate('page.config.color.button.selectTabSensor'),
  }
}

@Form.create({})
export default class StationAutoConfigColor extends React.Component {
  static defaultProps = {}
  static propTypes = {}

  state = {
    keyData: 'data',
    keySensor: 'sensor',
    defaultTabKey: 'data',
    activeTabKey: 'data',
  }

  render() {
    const {
      keyData,
      defaultTabKey,
      activeTabKey,
      // keySensor
    } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['configColor']} />
        <Clearfix height={16} />

        <Tabs
          defaultActiveKey={defaultTabKey}
          activeKey={activeTabKey}
          // renderTabBar={() => <div />}
        >
          <TabPane tab={i18n().tabColorData} key={keyData}>
            <TabItemColorData />
          </TabPane>
          {/* <TabPane key={keySensor}>
            <TabItemColorSensor />
          </TabPane> */}
        </Tabs>
      </PageContainer>
    )
  }

  _changeTabKey = e => {
    this.setState({ activeTabKey: e.target.value })
  }
}
