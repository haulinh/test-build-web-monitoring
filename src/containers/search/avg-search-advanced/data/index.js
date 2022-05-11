import { Button, Col, Row, Tabs, Tooltip } from 'antd'
import SelectQCVN from 'components/elements/select-qcvn'
import React, { Component } from 'react'
import styled from 'styled-components'
import { ToolTip } from '../component/ToolTip'
import OverviewData from './OverviewData'

const { TabPane } = Tabs
const TabWrapper = styled.div`
  position: relative;
  .ant-tabs-ink-bar {
    background-color: transparent;
  }
  .ant-tabs-nav .ant-tabs-tab {
    margin: 6px;
    padding: 12px 0px 12px 0px;
  }
  .ant-tabs-extra-content {
    width: 420px;
    height: 67px;
  }
`

const ButtonAbsolute = styled.div`
  width: 300px;
  position: absolute;
  right: 16px;
  z-index: 3;
`
export default class Data extends Component {
  state = {
    tab1Style: {
      type: 'primary',
      ghost: true,
    },
    tab2Style: {
      type: 'default',
      ghost: false,
    },
  }
  componentDidMount = () => {}
  handleChangeTab = key => {
    if (key === '2') {
      const tab1Style = {
        type: 'default',
        ghost: false,
      }
      const tab2Style = {
        type: 'primary',
        ghost: true,
      }
      this.setState({
        tab1Style,
        tab2Style,
      })
      return
    }
    const tab1Style = {
      type: 'primary',
      ghost: true,
    }
    const tab2Style = {
      type: 'default',
      ghost: false,
    }
    this.setState({
      tab1Style,
      tab2Style,
    })
  }
  render() {
    const { tab1Style, tab2Style } = this.state

    return (
      <TabWrapper>
        {/* <ButtonAbsolute>
          <Row type="flex">
            <Col>
              <p>Quy chuẩn: </p>
            </Col>
            <Col span={18}>
              <SelectQCVN
                mode="multiple"
                maxTagCount={3}
                maxTagTextLength={18}
              />
            </Col>
          </Row>
        </ButtonAbsolute> */}
        <Tabs
          defaultActiveKey="1"
          animated={{ inkBar: false }}
          onChange={this.handleChangeTab}
          tabBarExtraContent={
            <Row
              type="flex"
              align="middle"
              justify="end"
              style={{ height: '68px' }}
            >
              <Col>
                <div style={{ marginRight: '4px' }}>Quy chuẩn</div>
              </Col>
              <Col>
                <ToolTip />
              </Col>
              <Col>
                <div style={{ marginRight: '8px' }}>:</div>
              </Col>
              <Col span={18}>
                <SelectQCVN
                  mode="multiple"
                  maxTagCount={1}
                  maxTagTextLength={18}
                  placeholder="Lựa chọn quy chuẩn so sánh"
                />
              </Col>
            </Row>
          }
        >
          <TabPane
            key="1"
            tab={
              <Button type={tab1Style.type} ghost={tab1Style.ghost}>
                Xem dữ liệu theo trạm
              </Button>
            }
          ></TabPane>
          <TabPane
            key="2"
            tab={
              <Button type={tab2Style.type} ghost={tab2Style.ghost}>
                Xem dữ liệu tổng hợp
              </Button>
            }
          >
            <OverviewData />
          </TabPane>
        </Tabs>
      </TabWrapper>
    )
  }
}
