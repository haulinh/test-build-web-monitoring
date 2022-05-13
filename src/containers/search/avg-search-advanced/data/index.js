import { Button, Col, Row, Tabs } from 'antd'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import React, { Component } from 'react'
import styled from 'styled-components'
import { ToolTip } from '../component/ToolTip'
import StationData from './station'
import OverviewData from './overview'
import DataInsight from 'api/DataInsight'
import { ACTIVE_TAB, DEFAULT_TAB } from '../constants'

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
    tab1Style: ACTIVE_TAB,
    tab2Style: DEFAULT_TAB,
    standardsVN: [],
    qcvns: [],
    dataOverview: {},
    activeKey: 'station',
  }

  handleChangeTab = key => {
    if (key === 'overview') {
      this.setState({
        tab1Style: DEFAULT_TAB,
        tab2Style: ACTIVE_TAB,
        activeKey: 'overview',
      })
      this.getDataOverview()
      return
    }

    this.setState({
      tab1Style: ACTIVE_TAB,
      tab2Style: DEFAULT_TAB,
      activeKey: 'station',
    })
  }

  getDataOverview = async () => {
    const { searchFormData } = this.props

    const measuringList = searchFormData.measuringList.join(',')
    const groupType = ['month', 'year'].includes(searchFormData.type)
      ? searchFormData.type
      : 'custom'
    const timeInterval = Number(searchFormData.type) ? searchFormData.type : 0
    const status = ['GOOD', 'EXCEEDED', 'EXCEEDED_PREPARING'].join(',')

    const params = {
      stationKeys: searchFormData.stationKeys,
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      measuringList,
      isFilter: searchFormData.isFilter,
      groupType,
      timeInterval,
      status,
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

  componentDidUpdate = prevProps => {
    const { isSearchingData } = this.props

    if (prevProps.isSearchingData !== isSearchingData) {
      this.setState({
        tab1Style: ACTIVE_TAB,
        tab2Style: DEFAULT_TAB,
        activeKey: 'station',
      })
      this.getDataOverview()
    }
  }
  render() {
    const {
      tab1Style,
      tab2Style,
      standardsVN,
      qcvns,
      dataOverview,
      activeKey,
    } = this.state
    const { stationsData, type, isSearchingData, searchFormData } = this.props

    return (
      <TabWrapper>
        <Tabs
          defaultActiveKey="station"
          activeKey={activeKey}
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
                <ToolTip />
              </Col>
              <Col>
                <div style={{ marginLeft: '4px', marginRight: '4px' }}>
                  Quy chuẩn:
                </div>
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
            key="station"
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
            key="overview"
            tab={
              <Button type={tab2Style.type} ghost={tab2Style.ghost}>
                Xem dữ liệu tổng hợp
              </Button>
            }
          >
            {isSearchingData && <OverviewData data={dataOverview} />}
          </TabPane>
        </Tabs>
      </TabWrapper>
    )
  }
}
