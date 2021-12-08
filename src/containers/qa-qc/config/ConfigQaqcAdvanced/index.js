import React from 'react'
import { Collapse, Tabs } from 'antd'
import FilterConditionContainer from './FilterCondition'
import { translate as t } from 'hoc/create-lang'
import FilterTimeContainer from './FilterTime'

const { TabPane } = Tabs
const { Panel } = Collapse

class ConfigQaqcAdvancedTab extends React.Component {
  render() {
    const {
      setActiveKeyPanel,
      activeKeyPanel,
      toggleExcludeParametersByTime,
      toggleExcludeParametersByValue,
      excludeParametersByTime,
      excludeParametersByValue,
    } = this.props
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
              {t('qaqcConfig.advanced.title')}
            </div>
          }
          key="advanced"
        >
          <Tabs defaultActiveKey="filterRangeTime">
            <TabPane
              tab={t('qaqcConfig.advanced.tab.time')}
              key="filterRangeTime"
            >
              <FilterTimeContainer
                toggleExcludeParametersByTime={toggleExcludeParametersByTime}
                excludeParametersByTime={excludeParametersByTime}
              />
            </TabPane>
            <TabPane
              tab={t('qaqcConfig.advanced.tab.time')}
              key="filterMeasureValue"
            >
              <FilterConditionContainer
                toggleExcludeParametersByValue={toggleExcludeParametersByValue}
                excludeParametersByValue={excludeParametersByValue}
              />
            </TabPane>
          </Tabs>
        </Panel>
      </Collapse>
    )
  }
}

export default React.memo(ConfigQaqcAdvancedTab)
