import React, { Component } from 'react'
import { Row, Col, Tabs, Spin } from 'antd'
import styled from 'styled-components'

import SelectQCVN from 'components/elements/select-qcvn-v2'

import Chart from './chart'
import DataTable from './table'
import ChartType, { CHART_TYPE } from './chart-type'
import AnalyzeDataContext from '../context'

const i18n = {
  standard: 'Qui chuẩn',
}

const TabPane = Tabs.TabPane

const Container = styled.div``
const ChartWrapper = styled.div`
  display: ${props => (props.hidden ? 'none' : 'block')};
  position: relative;
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`

class ReportData extends Component {
  static contextType = AnalyzeDataContext

  onChangeQcvn = (qcvnIds, list) => {
    const { onChangeQcvn } = this.props
    const qcvnSelected = list.filter(item => qcvnIds.includes(item._id))
    onChangeQcvn(qcvnSelected)
  }

  getMeasures = () => {
    const { data } = this.props
    return Object.keys(data)
  }

  onChangeChartType = chartType => {
    const { onReDrawChart } = this.props
    onReDrawChart({ chartType })
  }

  onChangeMeasure = measure => {
    const { onReDrawChart } = this.props
    onReDrawChart({ measure })
  }

  render() {
    const { data, qcvns, dataType, chartType, isLoadingData } = this.props
    const Loading = () =>
      isLoadingData && (
        <div className="loading">
          <Spin />
        </div>
      )
    return (
      <Container>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <ChartType
              onChange={this.onChangeChartType}
              chartType={chartType}
            />
          </Col>
          <Col span={16}>
            <Row type="flex" align="middle">
              <Col span={3}>{i18n.standard}</Col>
              <Col span={21}>
                <SelectQCVN
                  mode="multiple"
                  maxTagCount={3}
                  maxTagTextLength={18}
                  onChange={this.onChangeQcvn}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <ChartWrapper hidden={chartType !== CHART_TYPE.TABLE}>
              <Loading />
              <DataTable data={data} qcvns={qcvns} dataType={dataType} />
            </ChartWrapper>
            <ChartWrapper
              hidden={![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)}
            >
              <Loading />
              <Chart />
              <Tabs onChange={this.onChangeMeasure}>
                {this.getMeasures().map(measure => (
                  <TabPane tab={measure} key={measure}></TabPane>
                ))}
              </Tabs>
            </ChartWrapper>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default ReportData
