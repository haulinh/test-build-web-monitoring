import { Tabs } from 'antd'
import { Clearfix } from 'components/elements'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import createBreadCrumbHoc from 'shared/breadcrumb/hoc'
import ManagementAlarm from './ManagementAlarm'
import TemplateAlarm from './TemplateAlarm'
import { i18n } from './constants'

const Breadcrumb = createBreadCrumbHoc()
const { TabPane } = Tabs

export const FIELDS = {
  DISCONNECT: 'disconnect',
  BY_STANDARD: 'by_standard',
  DATA_LEVEL: 'data_level',
  DEVICE: 'device',

  EXCEED_PREPARING: 'exceed_preparing',
  EXCEED: 'exceed',

  STATUS: 'status',
  TIME_DISCONNECT: 'maxDisconnectionTime',
  RECIPIENTS: 'recipients',
  STANDARD_ID: 'standardId',
  IS_CREATE_LOCAL: 'isCreateLocal',
  ID: '_id',

  //#region config
  TYPE: 'type',
  CONFIG: 'config',
  NAME: 'name',
  MEASURING_LIST: 'measuringList',
  //#endregion config

  //#region channels
  CHANNELS: 'channels',
  SMS: 'sms',
  EMAIL: 'email',
  ACTIVE: 'active',
  MOBILE: 'mobile',
  WEBHOOK: 'webhook',
  //#endregion channels
  //#endregion config,

  ORDER: 'order',
  STATION_ID: 'stationId',
  REPEAT_CONFIG: 'repeatConfig',
  CONDITIONS: 'conditions',
}

export default class AlarmSetting extends Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: translate('alarm.menu.setting'),
            },
          ]}
        />
        <Clearfix height={16} />

        <Tabs defaultActiveKey="manage">
          <TabPane tab={i18n().tabs.managementAlarm} key="manage">
            <ManagementAlarm />
          </TabPane>
          <TabPane tab={i18n().tabs.templateAlarm} key="template">
            <TemplateAlarm />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
