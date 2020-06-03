import React from 'react'
import { autobind } from 'core-decorators'
import { Tabs, Button } from 'antd'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import BoxShadow from 'components/elements/box-shadow/index'
import TabTableDataList from './tab-table-data-list/index'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import moment from 'moment-timezone'

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
    isLoading: PropTypes.bool,
    dataAQI: PropTypes.array,
    onExportExcel: PropTypes.func,
    nameChart: PropTypes.string,
    isExporting: PropTypes.bool,
    onManually: PropTypes.func,
    isManually: PropTypes.bool,
  }

  state = {
    dataSource: [],
  }
  componentDidUpdate = prevProps => {
    if (prevProps.dataAQI !== this.props.dataAQI) {
      this.setState({
        dataSource: this.props.dataAQI,
      })
      // this.tranferDataWQI(this.props.dataAQI);
    }
  }

  tranferDataWQI(data) {
    let dataSet = {}
    _.forEach(data, item => {
      const strHour = moment(_.get(item, 'Time')).format('HH')
      const strNgay = moment(_.get(item, 'Time')).format('MM/DD/YYYY')
      const aqiDay = _.get(item, 'AQI')
      const dataItem = {
        ..._.omit(item, 'Time'),
      }

      const aqiOld = _.get(dataSet, `${strNgay}.wqiDay`, -1)
      console.log(aqiDay, aqiOld, '---aqiOld---')
      if (aqiOld < aqiDay) {
        _.set(dataSet, `${strNgay}.aqiDay`, aqiDay)
      }
      _.set(dataSet, `${strNgay}.time`, strNgay)
      _.set(dataSet, `${strNgay}.${strHour}`, dataItem)
    })
    // console.log(dataSet, "--tranferDataWQI--");
    // console.log(_.values(dataSet), "---dataSet---")
    this.setState({
      dataSource: _.values(dataSet),
    })
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
              dataAQI={this.state.dataSource}
              onChange={this.props.onChangePage}
              nameChart={this.props.nameChart}
            />
          </Tabs.TabPane>
        </Tabs>
      </TabeListWrapper>
    )
  }
}
