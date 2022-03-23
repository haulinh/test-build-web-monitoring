import Breadcrumb from '../breadcrumb'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Search from './search'
import TableMonitoringData from './TableMonitoringData'
import DropdownButton from './components/DropdownButton'
import DrawerMonitoring from './drawer'
import { Clearfix } from 'components/elements'

export default class StationFixedMonitoringData extends React.Component {
  state = {
    visibleDrawer: false,
    dataSource: [],
  }

  onClickImportManual = () => {
    this.setState({
      visibleDrawer: true,
    })
  }

  onCloseDrawer = () => {
    this.setState({
      visibleDrawer: false,
    })
  }
  getMonitoringData = data => {
    this.setState({ dataSource: data })
  }

  render() {
    const { visibleDrawer } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Search getMonitoringData={this.getMonitoringData} />
        <Clearfix height={15} />
        <TableMonitoringData />

        <DrawerMonitoring
          visible={visibleDrawer}
          onClose={this.onCloseDrawer}
        />
        <DropdownButton
          className="dropdown-button"
          onClickImportManual={this.onClickImportManual}
        />
      </PageContainer>
    )
  }
}
