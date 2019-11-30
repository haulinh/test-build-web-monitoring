import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as _ from "lodash";
import { Tabs, Radio } from 'antd'
import { connectAutoDispatch } from 'redux/connect'
import TabItemColorData from './tabs/colorData'
import TabItemColorSensor from './tabs/colorSensor'

import {
  message,
  // Tabs,
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Icon,
  Popconfirm,
  Spin
} from "antd";

import { translate } from "hoc/create-lang";

import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'

const { TabPane } = Tabs

const i18n = {
  tabColorData: translate('page.config.color.button.selectTabData'),
  tabColorSensor: translate('page.config.color.button.selectTabSensor'),
}


@connectAutoDispatch(
  state => ({

  })
)
@Form.create({})
export default class StationAutoConfigColor extends React.Component {
  static defaultProps = {}
  static propTypes = {}

  state = {
    keyData: 'data',
    keySensor: 'sensor',
    defaultTabKey: 'data',
    activeTabKey: 'data'

  };

  render() {
    const { keyData, keySensor, defaultTabKey, activeTabKey } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['configColor']} />

        <Radio.Group defaultValue={defaultTabKey} onChange={this._changeTabKey} style={{ marginBottom: 8 }} buttonStyle="solid" >
          <Radio.Button value={keyData}>{i18n.tabColorData}</Radio.Button>
          <Radio.Button value={keySensor}>{i18n.tabColorSensor}</Radio.Button>
        </Radio.Group>
        
        <Tabs defaultActiveKey={defaultTabKey} activeKey={activeTabKey} renderTabBar={() => <div></div>}>
          <TabPane key={keyData}>
            <TabItemColorData />
          </TabPane>
          <TabPane key={keySensor}>
            <TabItemColorSensor />
          </TabPane>
        </Tabs>
      </PageContainer>
      
    );
  }

  _changeTabKey = (e) =>  {
    this.setState({activeTabKey: e.target.value})
  }
}
