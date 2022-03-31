import { Spin } from 'antd'
import StationFixedReportApi from 'api/station-fixed/StationFixedReportApi'
import { Clearfix } from 'components/elements'
import ROLE from 'constants/role'
import createManagerEdit from 'hoc/manager-edit'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import PropTypes from 'prop-types'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ReportDetail from './ReportDetail'

@protectRole(ROLE.STATION_FIXED_INPUT.VIEW)
@createManagerEdit({
  apiGetByKey: StationFixedReportApi.getStationFixedReport,
})
class StationFixedMonitoringDataDetail extends React.Component {
  static propTypes = {
    onDeleteItem: PropTypes.func,
    onUpdateItem: PropTypes.func,
    getItem: PropTypes.func,
    isLoaded: PropTypes.bool,
  }

  async componentDidMount() {
    this.props.getItem()
  }
  render() {
    return (
      <PageContainer>
        <Spin spinning={!this.props.isLoaded}>
          <Breadcrumb
            items={[
              'monitoringData',
              {
                id: 'edit',
                name: this.props.isLoaded ? this.props.data.report.name : null,
              },
            ]}
          />
          <Clearfix height={26} />
          {this.props.isLoaded && (
            <ReportDetail initialValues={this.props.data} />
          )}
        </Spin>
      </PageContainer>
    )
  }
}

export default StationFixedMonitoringDataDetail
