import { Button, Tabs, Row } from 'antd'
import React, { Component } from 'react'
import TableStation from './TableStation'
import styled from 'styled-components'
import ChartOverview from './chart'
import { isEmpty } from 'lodash'

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
          defaultActiveKey="data"
          tabBarExtraContent={
            <Row type="flex" justify="end">
              <Button
                style={{ marginRight: '12px' }}
                type="primary"
                icon="file-excel"
              >
                Xuất dữ liệu excel
              </Button>
            </Row>
          }
        >
          <TabPane key="data" tab="Dữ liệu">
            <TableStation />
          </TabPane>
          <TabPane key="chart" tab="Biểu đồ">
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
