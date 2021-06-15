import React from 'react'
import { autobind } from 'core-decorators'
import { Tabs, Button, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow/index'
import TabTableDataList from './tab-table-data-list/index'
import TabChart from './tab-chart/index'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import * as _ from 'lodash'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import { Clearfix } from 'components/elements'

const TabeListWrapper = styled(BoxShadow)`
  padding: 0px 16px 16px 16px;
  position: relative;
`

const ButtonAbsolute = styled.div`
  position: absolute;
  top: 48px;
  right: 16px;
  z-index: 3;
`

@autobind
export default class TabeList extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    measuringList: PropTypes.array,
    measuringData: PropTypes.array,
    dataStationAuto: PropTypes.array,
    pagination: PropTypes.object,
    onChangePage: PropTypes.func,
    onExportExcel: PropTypes.func,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
    onChangeQcvn: PropTypes.func,
  }

  state = {
    qcvns: [],
  }

  onChangeQcvn = (qcvnIds, list) => {
    const qcvnSelected = list.filter(item => qcvnIds.includes(item._id))
    this.setState({ qcvns: qcvnSelected })
    this.props.onChangeQcvn(qcvnSelected.map(qc => qc.key))
  }

  render() {
    return (
      <TabeListWrapper>
        <Row type="flex" align="middle">
          <Col
            span={4}
            style={{
              // textAlign: 'right',
              // paddingRight: '8px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {translate('dataAnalytics.standardViews')}
          </Col>
          <Col span={8}>
            <SelectQCVN
              mode="multiple"
              maxTagCount={3}
              maxTagTextLength={18}
              onChange={this.onChangeQcvn}
            />
          </Col>
        </Row>
        <Clearfix height={16} />
        <ButtonAbsolute>
          {protectRole(ROLE.DATA_SEARCH.EXPORT)(
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
              qcvns={this.state.qcvns}
              loading={this.props.isLoading}
              measuringList={this.props.measuringList}
              dataAnalyzeStationAuto={this.props.dataAnalyzeStationAuto}
              measuringData={this.props.measuringData}
              dataSource={this.props.dataStationAuto}
              pagination={this.props.pagination}
              onChange={this.props.onChangePage}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={translate('dataSearchFrom.tab.chart')} key="2">
            <TabChart
              dataStationAuto={this.props.dataStationAuto || []}
              measuringData={_.filter(this.props.measuringData, ({ key }) =>
                _.includes(this.props.measuringList || [], key)
              )}
              nameChart={this.props.nameChart}
            />
          </Tabs.TabPane>
        </Tabs>
      </TabeListWrapper>
    )
  }
}
