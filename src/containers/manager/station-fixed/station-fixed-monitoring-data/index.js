import Breadcrumb from '../breadcrumb'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Search from './search'
import TableMonitoringData from './TableMonitoringData'
import DropdownButton from './components/DropdownButton'
import DrawerMonitoring from './drawer'

export default class StationFixedMonitoringData extends React.Component {
  state = {
    visibleDrawer: false,
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

  render() {
    const { visibleDrawer } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Search />
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
