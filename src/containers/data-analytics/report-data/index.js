import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'
import styled from 'styled-components'

import SelectQCVN from 'components/elements/select-qcvn-v2'

import Chart from './chart'
import ChartType, { CHART_TYPE } from './chart-type'
import AnalyzeDataContext from '../context'

const i18n = {
  standard: 'Qui chuẩn',
}

const TabPane = Tabs.TabPane

const Container = styled.div``

class ReportData extends Component {
  static contextType = AnalyzeDataContext

  onChangeQcvn = (qcvnIds, list) => {
    const { onDrawLine } = this.props
    const qcvnSelected = list.filter(item => qcvnIds.includes(item._id))
    onDrawLine(qcvnSelected)
  }

  getMeasures = () => {
    const { data } = this.props
    return Object.keys(data)
  }

  onChangeChartType = chartType => {
    if (![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)) return
    const { onReDrawChart } = this.props
    onReDrawChart({ chartType })
  }

  onChangeMeasure = measure => {
    const { onReDrawChart } = this.props
    onReDrawChart({ measure })
  }

  render() {
    return (
      <Container>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <ChartType onChange={this.onChangeChartType} />
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
            <Chart />
            <Tabs onChange={this.onChangeMeasure}>
              {this.getMeasures().map(measure => (
                <TabPane tab={measure} key={measure}></TabPane>
              ))}
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default ReportData
