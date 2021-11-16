import React from 'react'

import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import ConfigQaqcBasic from './ConfigQaqcBasic'
import { Collapse, Tabs } from 'antd'
import { Clearfix } from 'components/layouts/styles'

const { Panel } = Collapse
const { TabPane } = Tabs

export default class QAQC_Config extends React.Component {
  render() {
    if (this.props.isDrawer) {
      return this.renderContent()
    }
    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['configNew']} />
        <Clearfix height={24} />
        <Collapse defaultActiveKey={['basic']}>
          <Panel header="Bộ lọc cơ bản" key="basic">
            <ConfigQaqcBasic />
          </Panel>
          <Panel header="Bộ lọc nâng cao">
            <Tabs defaultActiveKey="filterRangeTime">
              <TabPane tab="Lọc theo khoảng thời gian" key="filterRangeTime">
                Lọc theo khoảng thời gian
              </TabPane>
              <TabPane tab="Lọc theo điều giá trị" key="filterMeasureValue">
                Lọc theo điều giá trị
              </TabPane>
            </Tabs>
          </Panel>
        </Collapse>
        <Clearfix height={24} />
      </PageContainer>
    )
  }
}
