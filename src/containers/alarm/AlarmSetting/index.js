import { Tabs } from 'antd'
import { Clearfix } from 'components/elements'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import createBreadCrumbHoc from 'shared/breadcrumb/hoc'
import ManagementAlarm from './ManagementAlarm'
import TemplateAlarm from './TemplateAlarm'

const Breadcrumb = createBreadCrumbHoc()
const { TabPane } = Tabs

export const FIELDS = {
  DISCONNECT: 'disconnect',
  BY_STANDARD: 'by_standard',
  DATA_LEVEL: 'data_level',

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
}

export default class AlarmSetting extends Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: 'Cài đặt cảnh báo',
            },
          ]}
        />
        <Clearfix height={16} />

        <Tabs defaultActiveKey="manage">
          <TabPane tab="Quản lý cảnh báo" key="manage">
            <ManagementAlarm />
          </TabPane>
          <TabPane tab="Mẫu gửi cảnh báo" key="template">
            <TemplateAlarm />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
