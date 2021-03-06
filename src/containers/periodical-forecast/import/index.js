import { Tabs } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'

import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'
import HistoryTab from './HistoryTab'
import ImportTab from './ImportTab'
import { translate as t } from 'hoc/create-lang'

import Breadcrumb from '../breadcrumb'

const { TabPane } = Tabs
@protectRole(ROLE.PERIODICAL_IMPORT_DATA.VIEW)
export default class Import extends React.Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['import']} />
        <Tabs defaultActiveKey="1">
          <TabPane tab={t('periodicalForecast.title.importData')} key="1">
            <ImportTab />
          </TabPane>
          <TabPane tab={t('periodicalForecast.title.historyData')} key="2">
            <HistoryTab />
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}
