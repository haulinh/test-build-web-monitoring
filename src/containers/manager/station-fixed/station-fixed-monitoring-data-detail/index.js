import { Form } from 'antd'
import { Clearfix } from 'components/elements'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ReportDetail from './ReportDetail'

@protectRole(ROLE.STATION_FIXED_INPUT.VIEW)
class StationFixedMonitoringDataDetail extends React.Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb
          items={[
            'monitoringDataDetail',
            {
              id: 'edit',
              name: 'Trạm A',
            },
          ]}
        />
        <Clearfix height={26} />
        <ReportDetail />
      </PageContainer>
    )
  }
}

export default Form.create()(StationFixedMonitoringDataDetail)
