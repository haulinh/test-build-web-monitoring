import { Button, Col, Row, Tabs } from 'antd'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import React, { Component } from 'react'
import styled from 'styled-components'
import { ToolTip } from '../component/ToolTip'
import StationData from './station'
import OverviewData from './overview'
import DataInsight from 'api/DataInsight'

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

export default class DataSearch extends Component {
  state = {
    tab1Style: {
      type: 'primary',
      ghost: true,
    },
    tab2Style: {
      type: 'default',
      ghost: false,
    },
    standardsVN: [],
    qcvns: [],
    dataOverview: {},
  }

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
      this.getDataOverview()
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

  getDataOverview = async () => {
    const { searchFormData } = this.props
    const params = {
      stationKeys: searchFormData.stationKeys,
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      measuringList: searchFormData.measuringList.join(','),
      isFilter: searchFormData.isFilter,
      groupType: ['month', 'year'].includes(searchFormData.type)
        ? searchFormData.type
        : 'custom',
      timeInterval: Number(searchFormData.type) ? searchFormData.type : 0,
      status: ['GOOD', 'EXCEEDED', 'EXCEEDED_PREPARING'].join(','),
    }
    try {
      const result = await DataInsight.getDataAverageOverview(params)

      this.setState({ dataOverview: result })
    } catch (error) {
      console.log(error)
    }
  }

  onChangeQcvn = (qcvnIds, qcvnList) => {
    const qcvnSelected = qcvnIds.map(id => {
      return {
        ...qcvnList.find(qcvn => qcvn._id === id),
      }
    })

    this.setState({
      standardsVN: qcvnSelected.map(qcvn => qcvn.key),
      qcvns: qcvnSelected,
    })
  }
  render() {
    const {
      tab1Style,
      tab2Style,
      standardsVN,
      qcvns,
      dataOverview,
    } = this.state
    const { stationsData, type, isSearchingData, searchFormData } = this.props

    return (
      <TabWrapper>
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
                  onChange={this.onChangeQcvn}
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
          >
            {isSearchingData && stationsData.length && (
              <StationData
                standardsVN={standardsVN}
                stationsData={stationsData}
                type={type}
                qcvns={qcvns}
                searchFormData={searchFormData}
              />
            )}
          </TabPane>
          <TabPane
            key="2"
            tab={
              <Button type={tab2Style.type} ghost={tab2Style.ghost}>
                Xem dữ liệu tổng hợp
              </Button>
            }
          >
            <OverviewData data={dataOverview} />
          </TabPane>
        </Tabs>
      </TabWrapper>
    )
  }
}
