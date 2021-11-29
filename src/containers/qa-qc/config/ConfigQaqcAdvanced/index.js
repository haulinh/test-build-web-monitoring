import React from 'react'
import { Collapse, Tabs } from 'antd'
import FilterConditionContainer from './FilterCondition'

import FilterTimeContainer from './FilterTime'
const { TabPane } = Tabs
const { Panel } = Collapse

class ConfigQaqcAdvancedTab extends React.Component {
  render() {
    return (
      <Collapse defaultActiveKey="advanced">
        <Panel header="Bộ lọc nâng cao" key="advanced">
          <Tabs defaultActiveKey="filterRangeTime">
            <TabPane tab="Lọc theo khoảng thời gian" key="filterRangeTime">
              <FilterTimeContainer />
            </TabPane>
            <TabPane tab="Lọc theo điều kiện giá trị" key="filterMeasureValue">
              <FilterConditionContainer />
            </TabPane>
          </Tabs>
        </Panel>
      </Collapse>
    )
  }
}

export default ConfigQaqcAdvancedTab
