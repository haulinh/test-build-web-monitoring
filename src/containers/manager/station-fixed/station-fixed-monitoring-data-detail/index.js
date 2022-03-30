import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import Breadcrumb from '../breadcrumb'

@protectRole(ROLE.STATION_FIXED_INPUT.VIEW)
export default class StationFixedMonitoringDataDetail extends Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <p>OKE</p>
      </PageContainer>
    )
  }
}
