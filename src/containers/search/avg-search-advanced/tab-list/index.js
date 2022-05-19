import React from 'react'
import { autobind } from 'core-decorators'
import { Tabs, Menu, Button, Empty } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow'
import TabTableDataList from './tab-table-data-list/index'
import TabChart from './tab-chart/index'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { translate } from 'hoc/create-lang'
import DataInsight from 'api/DataInsight'

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
        <Tabs.TabPane tab={translate('avgSearchFrom.tab.data')} key="1">
          <Empty />
        </Tabs.TabPane>
      )
    }

    return (
      <Tabs.TabPane tab={translate('avgSearchFrom.tab.data')} key="1">
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
    const { qcvns } = this.props
    if (this.props.measuringData.length === 0) {
      return (
        <Tabs.TabPane tab={translate('avgSearchFrom.tab.chart')} key="2">
          <Empty />
        </Tabs.TabPane>
      )
    }
    return (
      <Tabs.TabPane tab={translate('avgSearchFrom.tab.chart')} key="2">
        <TabChart
          dataStationAuto={this.state.dataChart}
          measuringData={this.props.measuringData || []}
          nameChart={this.props.nameChart}
          typeReport={this.props.typeReport}
          qcvnSelected={qcvns}
        />
      </Tabs.TabPane>
    )
  }

  handleChangeTab = key => {
    if (key === '2') {
      console.log('HEeeeeeeeee')
      this.getDataChart()
    }
  }

  getDataChart = async () => {
    console.log(this.props.searchFormData)
    console.log(this.props.params)
    // try {
    //   const dataStationAuto = await DataInsight.getDataAverage(
    //     searchFormData.key,
    //     params
    //   )
    //   this.setState({ dataChart: dataStationAuto && dataStationAuto.data })
    // } catch (error) {
    //   console.log(error)
    // }
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

        <Tabs defaultActiveKey="1" onChange={this.handleChangeTab}>
          {this.renderDataTab()}
          {this.renderChartTab()}
        </Tabs>
      </TableListWrapper>
    )
  }
}
