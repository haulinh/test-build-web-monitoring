import React from 'react'
import { Collapse, Tabs } from 'antd'
import FilterConditionContainer from './FilterCondition'

import FilterTimeContainer from './FilterTime'
const { TabPane } = Tabs
const { Panel } = Collapse

class ConfigQaqcAdvancedTab extends React.Component {
  render() {
    const { setActiveKeyPanel, activeKeyPanel } = this.props
    return (
      <Collapse
        defaultActiveKey={activeKeyPanel}
        activeKey={activeKeyPanel}
        onChange={() => setActiveKeyPanel('advanced')}
      >
        <Panel
          header={
            <div
              style={{
                marginLeft: 2,
                fontWeight: 500,
                fontSize: 16,
                color: '#111827',
              }}
            >
              Bộ lọc nâng cao
            </div>
          }
          key="advanced"
        >
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

export default React.memo(ConfigQaqcAdvancedTab)
