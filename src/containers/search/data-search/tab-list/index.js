import { Button, Tabs } from 'antd'
import { Clearfix } from 'components/elements'
import BoxShadow from 'components/elements/box-shadow/index'
import ROLE from 'constants/role'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import React from 'react'
import styled from 'styled-components'
import TabChart from './tab-chart/index'
import TabTableDataList from './tab-table-data-list/index'

const TabeListWrapper = styled(BoxShadow)`
  padding: 0px 16px 16px 16px;
  position: relative;
`

const ButtonAbsolute = styled.div`
  position: absolute;
  right: 16px;
  z-index: 3;
`

@autobind
export default class TabeList extends React.PureComponent {
  render() {
    const {
      loading,
      measuringList,
      dataStationAuto,
      setPage,
      page,
      totalItem,
      exportExcel,
      loadingExport,
      standards,
      standardObjectList,
    } = this.props
    return (
      <TabeListWrapper>
        <Clearfix height={16} />
        <ButtonAbsolute>
          {protectRole(ROLE.DATA_SEARCH.EXPORT)(
            <Button
              type="primary"
              icon="file-excel"
              style={{ float: 'right', margin: '5px' }}
              onClick={exportExcel}
              loading={loadingExport}
            >
              {translate('dataSearchFrom.tab.exportExcel')}
            </Button>
          )}
        </ButtonAbsolute>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={translate('dataSearchFrom.tab.data')} key="1">
            <TabTableDataList
              totalItem={totalItem}
              page={page}
              setPage={setPage}
              loading={loading}
              dataSource={dataStationAuto}
              measuringList={measuringList}
              standards={standards}
              standardObjectList={standardObjectList}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={translate('dataSearchFrom.tab.chart')} key="2">
            <TabChart
              measuringList={measuringList}
              dataStationAuto={dataStationAuto}
              nameChart={'ga'}
            />
          </Tabs.TabPane>
        </Tabs>
      </TabeListWrapper>
    )
  }
}
