import Breadcrumb from '../breadcrumb'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Search from './search'
import TableMonitoringData from './TableMonitoringData'
import { Clearfix } from 'components/elements'
import DropdownButton from './components/DropdownButton'

export default class StationFixedMonitoringData extends React.Component {
  state = {
    dataSource: [],
  }
  getMonitoringData = data => {
    this.setState({ dataSource: data })
  }
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Clearfix height={15} />
        <Search getMonitoringData={this.getMonitoringData} />
        <Clearfix height={15} />
        <TableMonitoringData />
        <DropdownButton className="dropdown-button" />
      </PageContainer>
    )
  }
}
