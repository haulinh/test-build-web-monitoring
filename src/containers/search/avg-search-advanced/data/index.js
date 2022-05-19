import { Button, Col, Row, Spin, Tabs } from 'antd'
import DataInsight from 'api/DataInsight'
import ToolTipIcon from 'assets/svg-icons/TooltipSmall.svg'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import ToolTip from 'components/elements/tooltip'
import React, { Component } from 'react'
import styled from 'styled-components'
import { ACTIVE_TAB, DEFAULT_TAB, i18n } from '../constants'
import OverviewData from './overview'
import StationData from './station'

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
    stationTabStyle: ACTIVE_TAB,
    overviewTabStyle: DEFAULT_TAB,
    standardsVN: [],
    qcvns: [],
    dataOverview: {},
    activeKey: 'station',
    loading: false,
  }

  handleChangeTab = key => {
    if (key === 'overview') {
      this.setState({
        stationTabStyle: DEFAULT_TAB,
        overviewTabStyle: ACTIVE_TAB,
        activeKey: 'overview',
      })
      this.getDataOverview()
      return
    }

    this.setState({
      stationTabStyle: ACTIVE_TAB,
      overviewTabStyle: DEFAULT_TAB,
      activeKey: 'station',
    })
  }

  getDataOverview = async standards => {
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
      standards,
    }

    try {
      this.setState({ loading: true })
      const result = await DataInsight.getDataAverageOverview(params)
      this.setState({ dataOverview: result, loading: false })
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
    const { activeKey } = this.state
    if (
      prevProps.isSearchingData !== isSearchingData &&
      activeKey === 'overview'
    ) {
      this.getDataOverview()
    }
  }

  setLoading = loading => {
    const { setLoadingButton } = this.props

    setLoadingButton(loading)
  }

  render() {
    const {
      stationTabStyle,
      overviewTabStyle,
      standardsVN,
      qcvns,
      dataOverview,
      activeKey,
      loading,
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
                <div style={{ marginRight: '4px' }}>
                  {i18n().standard.label}
                </div>
              </Col>
              <Col>
                <ToolTip width={'16px'} text={i18n().tooltip.standard} />
              </Col>
              <Col>
                <div style={{ marginRight: '2px' }}>:</div>
              </Col>
              <Col span={16}>
                <SelectQCVN
                  mode="multiple"
                  maxTagCount={1}
                  maxTagTextLength={16}
                  onChange={this.onChangeQcvn}
                  placeholder={i18n().standard.placeholder}
                />
              </Col>
            </Row>
          }
        >
          <TabPane
            key="station"
            tab={
              <Button type={stationTabStyle.type} ghost={stationTabStyle.ghost}>
                {i18n().tabs.station.label}
              </Button>
            }
          >
            {isSearchingData && stationsData.length && (
              <StationData
                setLoading={this.setLoading}
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
              <Button
                type={overviewTabStyle.type}
                ghost={overviewTabStyle.ghost}
              >
                {i18n().tabs.overview.label}
              </Button>
            }
          >
            {isSearchingData && (
              <Spin spinning={loading}>
                <OverviewData
                  data={dataOverview}
                  qcvnSelected={qcvns}
                  searchFormData={searchFormData}
                />
              </Spin>
            )}
          </TabPane>
        </Tabs>
      </TabWrapper>
    )
  }
}
