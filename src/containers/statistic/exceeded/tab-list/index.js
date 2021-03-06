import React from 'react'
import { autobind } from 'core-decorators'
import { Tabs, Button } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow/index'
import TabTableDataList from './tab-table-data-list/index'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

const TabeListWrapper = styled(BoxShadow)`
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
export default class TabeList extends React.PureComponent {
  static propTypes = {
    measuringList: PropTypes.array,
    measuringListOrigin: PropTypes.array,
    isLoading: PropTypes.bool,
    dataSource: PropTypes.array,
    dataFrequency: PropTypes.number,
    onExportExcel: PropTypes.func,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
  }

  render() {
    return (
      <TabeListWrapper>
        <ButtonAbsolute>
          {protectRole(ROLE.STATISTIC.EXPORT_AQI)(
            <Button
              type="primary"
              icon="file-excel"
              style={{ float: 'right', margin: '5px' }}
              onClick={this.props.onExportExcel}
              loading={this.props.isExporting}
            >
              {translate('dataSearchFrom.tab.exportExcel')}
            </Button>
          )}
        </ButtonAbsolute>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={translate('dataSearchFrom.tab.data')} key="1">
            <TabTableDataList
              loading={this.props.isLoading}
              dataAnalyzeStationAuto={this.props.dataAnalyzeStationAuto}
              measuringListOrigin={this.props.measuringListOrigin}
              measuringList={this.props.measuringList}
              dataSource={this.props.dataSource}
              dataFrequency={this.props.dataFrequency}
              onChange={this.props.onChangePage}
            />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab={translate('dataSearchFrom.tab.chart')} key="2">
            <TabChart
             // dataAQI={this.props.dataAQI || []}
              dataAQI={[]}
              nameChart={this.props.nameChart}
            />
          </Tabs.TabPane> */}
        </Tabs>
      </TabeListWrapper>
    )
  }
}
