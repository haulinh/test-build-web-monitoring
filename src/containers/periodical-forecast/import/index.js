import { Tabs } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import HistoryTab from './HistoryTab'
import ImportTab from './ImportTab'

import Breadcrumb from '../breadcrumb'

const { TabPane } = Tabs

export default class Import extends React.Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['import']} />
        <Tabs defaultActiveKey="1">
          <TabPane tab="Nhập dữ liệu" key="1">
            <ImportTab />
          </TabPane>
          <TabPane tab="Lịch sử tải lên" key="2">
            <HistoryTab />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
