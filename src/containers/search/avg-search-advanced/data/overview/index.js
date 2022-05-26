import { Row, Tabs } from 'antd'
import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { i18n } from '../../constants'
import ChartOverview from './chart'

const { TabPane } = Tabs

const TabWrapper = styled.div`
  position: relative;
  .ant-tabs-ink-bar {
    background-color: #1890ff !important;
  }
  .ant-tabs-nav .ant-tabs-tab {
    margin: 6px;
    padding: 12px 16px 12px 16px !important;
  }
`

export default class OverviewData extends Component {
  render() {
    const { data, qcvnSelected, searchFormData } = this.props
    return (
      <TabWrapper>
        <Tabs
          defaultActiveKey="chart"
          tabBarExtraContent={
            <Row type="flex" justify="end">
              {/* <Button
                style={{ marginRight: '12px' }}
                type="primary"
                icon="file-excel"
              >
                {i18n().tabs.exportExcel}
              </Button> */}
            </Row>
          }
        >
          {/* <TabPane key="data" tab={i18n().tabs.overview.data}>
            <TableStation />
          </TabPane> */}
          <TabPane key="chart" tab={i18n().tabs.overview.chart}>
            {!isEmpty(data) && (
              <ChartOverview
                dataChart={data}
                qcvnSelected={qcvnSelected}
                searchFormData={searchFormData}
              />
            )}
          </TabPane>
        </Tabs>
      </TabWrapper>
    )
  }
}
