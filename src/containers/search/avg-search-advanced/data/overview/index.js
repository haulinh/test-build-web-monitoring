import { Button, Tabs } from 'antd'
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

const ButtonAbsolute = styled.div`
  position: absolute;
  right: 16px;
  z-index: 3;
`
export default class OverviewData extends Component {
  render() {
    const { data } = this.props
    return (
      <TabWrapper>
        <ButtonAbsolute>
          <Button
            style={{ marginRight: '12px' }}
            type="primary"
            icon="file-excel"
          >
            Xuất dữ liệu excel
          </Button>
        </ButtonAbsolute>
        <Tabs defaultActiveKey="data">
          <TabPane key="data" tab="Dữ liệu">
            <TableStation />
          </TabPane>
          <TabPane key="chart" tab="Biểu đồ">
            {!isEmpty(data) && <ChartOverview dataChart={data} />}
          </TabPane>
        </Tabs>
      </TabWrapper>
    )
  }
}
