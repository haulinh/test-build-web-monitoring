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
    loading: false,
  }

  getMonitoringData = (dataSource, loading) => {
    this.setState({ dataSource, loading })
  }

  render() {
    const { dataSource, loading } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Clearfix height={15} />
        <Search getMonitoringData={this.getMonitoringData} />
        <Clearfix height={15} />
        <TableMonitoringData dataSource={dataSource} loading={loading} />
        <DropdownButton className="dropdown-button" />
      </PageContainer>
    )
  }
}
