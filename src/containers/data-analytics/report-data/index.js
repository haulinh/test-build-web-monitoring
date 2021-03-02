import React, { Component, Fragment } from 'react'
import { Row, Col, Tabs, Spin, Button } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

import ROLE from 'constants/role'
import dataInsightApi from 'api/DataInsight'
import { translate as t } from 'hoc/create-lang'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import { connect } from 'react-redux'
import { get } from 'lodash'

import Chart from './chart'
import DataTable from './table'
import ChartType, { CHART_TYPE } from './chart-type'
import AnalyzeDataContext from '../context'
import { downFileExcel } from 'utils/downFile'
import { Clearfix } from 'components/elements'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { PermissionPopover } from 'hoc/protect-role'

const i18n = {
  standard: t('dataAnalytics.standard'),
  export: t('dataAnalytics.exportExcel'),
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
@connect(state => ({
  language: get(state, 'language.locale'),
}))
class ReportData extends Component {
  static contextType = AnalyzeDataContext

  state = {
    isLoadingExport: false,
  }

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
    const { onFetchReceiveTime } = this.props
    onFetchReceiveTime(measure)
  }

  async onClickExport() {
    this.setState({ isLoadingExport: true })
    const { qcvns, paramFilter } = this.props
    const paramExport = {
      ...paramFilter,
      qcvnKeys: qcvns.map(qcvn => qcvn._id).join(','),
      name: `${moment(paramFilter.from).format(DD_MM_YYYY_HH_MM)} - ${moment(
        paramFilter.to
      ).format(DD_MM_YYYY_HH_MM)}`,
    }

    try {
      const result = await dataInsightApi.exportDataInsight(
        paramExport,
        this.props.language
      )
      downFileExcel(result.data, 'data-insight')
      this.setState({ isLoadingExport: false })
    } catch (error) {
      this.setState({ isLoadingExport: false })
    }
  }

  render() {
    const {
      data,
      qcvns,
      dataType,
      chartType,
      isLoadingData,
      paramFilter,
      measuringList,
      measure,
    } = this.props

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
          <PermissionPopover roles={ROLE.CHART.EXPORT} popoverPlacement="right">
            {hasPermission => (
              <Fragment>
                <Col span={!hasPermission ? 16 : 13}>
                  <Row type="flex" align="middle">
                    <Col
                      span={3}
                      style={{
                        textAlign: 'right',
                        paddingRight: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {i18n.standard}
                    </Col>
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
                {hasPermission && (
                  <Col span={3}>
                    <Button
                      type="primary"
                      loading={this.state.isLoadingExport}
                      onClick={this.onClickExport.bind(this)}
                      disabled={!paramFilter}
                    >
                      {i18n.export}
                    </Button>
                  </Col>
                )}
              </Fragment>
            )}
          </PermissionPopover>
        </Row>
        <Row>
          <Col>
            <ChartWrapper hidden={chartType !== CHART_TYPE.TABLE}>
              <Loading />
              <Clearfix height={16} />
              <DataTable
                data={data}
                qcvns={qcvns}
                dataType={dataType}
                measuringList={measuringList}
              />
            </ChartWrapper>
            <ChartWrapper
              hidden={![CHART_TYPE.COLUMN, CHART_TYPE.LINE].includes(chartType)}
            >
              <Loading />
              <Chart />
              <Tabs onChange={this.onChangeMeasure} activeKey={measure}>
                {this.getMeasures().map(measure => (
                  <TabPane
                    tab={`${measuringList[measure].name} ${
                      measuringList[measure].unit
                        ? `(${measuringList[measure].unit})`
                        : ''
                    }`}
                    key={measure}
                  />
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
