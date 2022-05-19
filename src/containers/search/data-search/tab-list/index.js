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
import { connect } from 'react-redux'

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
@connect(state => ({
  stationAutoList: state.stationAuto.list,
}))
export default class TabeList extends React.PureComponent {
  getStationCurrent = () => {
    const { stationKey, stationAutoList } = this.props
    if (!stationKey) return

    const stationAutoCurrent = stationAutoList.find(
      station => station.key === stationKey
    )
    return stationAutoCurrent
  }

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
      stationKey,
      qcvnSelected,
      standardObjectList,
    } = this.props

    const stationAutoCurrent = this.getStationCurrent()

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
              stationKey={stationKey}
              qcvnSelected={qcvnSelected}
              loading={loading}
              measuringList={measuringList}
              dataStationAuto={dataStationAuto}
              stationAutoCurrent={stationAutoCurrent}
            />
          </Tabs.TabPane>
        </Tabs>
      </TabeListWrapper>
    )
  }
}
