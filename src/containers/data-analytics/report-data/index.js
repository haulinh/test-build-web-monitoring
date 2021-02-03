import React, { Component } from 'react'
import { Row, Col, Tabs, Spin, Button } from 'antd'
import styled from 'styled-components'

import SelectQCVN from 'components/elements/select-qcvn-v2'
import dataInsightApi from 'api/DataInsight'

import Chart from './chart'
import DataTable from './table'
import ChartType, { CHART_TYPE } from './chart-type'
import AnalyzeDataContext from '../context'
import { downFileExcel } from 'utils/downFile'

const i18n = {
  standard: 'Qui chuẩn',
  export: 'Xuất dữ liệu excel',
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

  async onClickExport() {
    const { qcvns, paramFilter } = this.props
    const paramExport = {
      ...paramFilter,
      qcvnKeys: qcvns.map(qcvn => qcvn._id).join(','),
    }

    const result = await dataInsightApi.exportDataInsight(paramExport, 'vi')
    console.log(
      '🚀 ~ file: index.js ~ line 70 ~ ReportData ~ onClickExport ~ result',
      result.data
    )
    downFileExcel(result, 'data-insight')
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
          <Col span={13}>
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
          <Col span={3}>
            <Button type="primary" onClick={this.onClickExport.bind(this)}>
              {i18n.export}
            </Button>
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
