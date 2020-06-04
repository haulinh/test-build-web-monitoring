import React from 'react'
import { autobind } from 'core-decorators'
import { Tabs, Button } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow'
import TabTableDataList from './tab-table-data-list/index'
// import TabChart from "./tab-chart";

import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

const TabeListWrapper = BoxShadow.extend`
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
    isLoading: PropTypes.bool,
    dataWQI: PropTypes.array,
    onExportExcel: PropTypes.func,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
    onManually: PropTypes.func,
    isManually: PropTypes.bool,
  }

  render() {
    return (
      <TabeListWrapper>
        <ButtonAbsolute>
        {protectRole(ROLE.WQI_NGAY.WQI_NGAY_EXPORT)(
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
          <Button
            type="primary"
            icon="deployment-unit"
            style={{ float: 'right', margin: '5px' }}
            onClick={this.props.onManually}
            loading={this.props.isManually}
          >
            {translate('dataSearchFrom.tab.dataProcess')}
          </Button>
        </ButtonAbsolute>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={translate('dataSearchFrom.tab.data')} key="1">
            <TabTableDataList
              loading={this.props.isLoading}
              dataSource={this.props.dataWQI}
              onChange={this.props.onChangePage}
            />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab={translate('dataSearchFrom.tab.chart')} key="2">
            <TabChart dataWQI={this.props.dataWQI || []} nameChart={this.props.nameChart} />
          </Tabs.TabPane> */}
        </Tabs>
      </TabeListWrapper>
    )
  }
}
