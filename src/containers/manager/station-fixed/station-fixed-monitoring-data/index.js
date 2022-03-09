import Breadcrumb from '../breadcrumb'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Search from './search'
import TableMonitoringData from './TableMonitoringData'

export default class StationFixedMonitoringData extends React.Component {
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Search />
        <TableMonitoringData />
      </PageContainer>
    )
  }
}
