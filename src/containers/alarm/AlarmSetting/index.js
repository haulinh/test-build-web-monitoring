import { Tabs } from 'antd'
import { Clearfix } from 'components/elements'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import createBreadCrumbHoc from 'shared/breadcrumb/hoc'
import ManageAlarm from './ManageAlarm'
import TemplateAlarm from './TemplateAlarm'

const Breadcrumb = createBreadCrumbHoc()
const { TabPane } = Tabs

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
            <ManageAlarm />
          </TabPane>
          <TabPane tab="Mẫu gửi cảnh báo" key="template">
            <TemplateAlarm />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
