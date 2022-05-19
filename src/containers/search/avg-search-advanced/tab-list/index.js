import { Button, Empty, Menu, Tabs } from 'antd'
import BoxShadow from 'components/elements/box-shadow'
import ROLE from 'constants/role'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import TabChart from './tab-chart/index'
import TabTableDataList from './tab-table-data-list/index'

const TableListWrapper = styled(BoxShadow)`
  padding: 0px 16px 16px 16px;
  position: relative;
`

const ButtonAbsolute = styled.div`
  position: absolute;
  top: 0px;
  right: 16px;
  z-index: 3;
`

@autobind
export default class TableList extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
    dataStationAuto: PropTypes.array,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    onExportExcel: PropTypes.func,
    onExportExcelAll: PropTypes.func,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
    isExportingAll: PropTypes.bool,
    typeReport: PropTypes.string,
    isActive: PropTypes.bool,
    qcvns: PropTypes.array,
    searchFormData: PropTypes.object,
    params: PropTypes.object,
  }

  state = {
    dataChart: [],
  }

  renderMenuExport = () => (
    <Menu>
      <Menu.Item onClick={this.props.onExportExcel}>
        <div style={{ padding: '8px 0' }}>
          {translate('avgSearchFrom.tab.exportExcel')}
        </div>
      </Menu.Item>
      <Menu.Item onClick={this.props.onExportExcelAll}>
        <div style={{ padding: '8px 0' }}>
          {translate('avgSearchFrom.tab.exportExcelAll')}
        </div>
      </Menu.Item>
    </Menu>
  )

  renderDataTab = () => {
    if (this.props.measuringData.length === 0) {
      return (
        <Tabs.TabPane tab={translate('avgSearchFrom.tab.data')} key="data">
          <Empty />
        </Tabs.TabPane>
      )
    }

    return (
      <Tabs.TabPane tab={translate('avgSearchFrom.tab.data')} key="data">
        <TabTableDataList
          loading={this.props.isLoading}
          measuringList={this.props.measuringList || []}
          measuringData={this.props.measuringData || []}
          dataSource={this.props.dataStationAuto}
          pagination={this.props.pagination}
          onChange={this.props.onChangePage}
          typeReport={this.props.typeReport}
          nameChart={this.props.nameChart}
          qcvns={this.props.qcvns}
        />
      </Tabs.TabPane>
    )
  }

  renderChartTab = () => {
    const {
      qcvns,
      dataStationAuto,
      measuringData,
      nameChart,
      typeReport,
    } = this.props
    if (this.props.measuringData.length === 0) {
      return (
        <Tabs.TabPane tab={translate('avgSearchFrom.tab.chart')} key="chart">
          <Empty />
        </Tabs.TabPane>
      )
    }
    return (
      <Tabs.TabPane tab={translate('avgSearchFrom.tab.chart')} key="chart">
        <TabChart
          dataStationAuto={dataStationAuto}
          measuringData={measuringData || []}
          nameChart={nameChart}
          typeReport={typeReport}
          qcvnSelected={qcvns}
        />
      </Tabs.TabPane>
    )
  }

  handleChangeTab = key => {
    const { handleChangeChartTab } = this.props
    if (key === '2') {
      handleChangeChartTab(true)
    }
  }

  render() {
    if (!this.props.isActive) return null

    return (
      <TableListWrapper>
        <ButtonAbsolute>
          {protectRole(ROLE.AVG_SEARCH.EXPORT)(
            <Button
              onClick={this.props.onExportExcel}
              type="primary"
              icon="file-excel"
              loading={this.props.isExporting || this.props.isExportingAll}
            >
              {translate('avgSearchFrom.tab.exportExcel')}
            </Button>
          )}
        </ButtonAbsolute>

        <Tabs defaultActiveKey="data" onChange={this.handleChangeTab}>
          {this.renderDataTab()}
          {this.renderChartTab()}
        </Tabs>
      </TableListWrapper>
    )
  }
}
