import Breadcrumb from '../breadcrumb'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { createRef } from 'react'
import Search from './search'
import TableMonitoringData from './TableMonitoringData'
import DropdownButton from './components/DropdownButton'
import { Clearfix } from 'components/elements'
import { Drawer as DrawerAnt } from 'antd'
import styled from 'styled-components'
import FormMonitoring from './form-create/index'

const Drawer = styled(DrawerAnt)`
  .ant-drawer-body {
    height: calc(100% - 55px);
    flex-direction: column;
    padding: 0;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 0;
  }
`

export default class StationFixedMonitoringData extends React.Component {
  state = {
    visibleDrawer: false,
    dataSource: [],
    loading: false,
  }

  formRef = createRef()

  onClickImportManual = () => {
    this.setState({
      visibleDrawer: true,
    })
  }

  onCloseDrawer = () => {
    this.setState({
      visibleDrawer: false,
    })
    this.formRef.current.props.form.resetFields()
  }

  setMonitoringData = (dataSource, loading) => {
    this.setState({ dataSource, loading })
  }

  setMonitoringData = (dataSource, loading) => {
    this.setState({ dataSource, loading })
  }

  render() {
    const { dataSource, loading, visibleDrawer } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Search getMonitoringData={this.getMonitoringData} />
        <Clearfix height={15} />
        <TableMonitoringData />

        <Drawer
          title="Nhập liệu điểm quan trắc"
          visible={visibleDrawer}
          closable={false}
          placement="right"
          onClose={this.onCloseDrawer}
          width={600}
        >
          <FormMonitoring
            visibleDrawer={visibleDrawer}
            wrappedComponentRef={this.formRef}
            onResetForm={this.onResetForm}
          />
        </Drawer>

        <DropdownButton
          className="dropdown-button"
          onClickImportManual={this.onClickImportManual}
        />
        <Clearfix height={15} />
        <Search setMonitoringData={this.setMonitoringData} />
        <Clearfix height={15} />
        <TableMonitoringData dataSource={dataSource} loading={loading} />
        <DropdownButton className="dropdown-button" />
      </PageContainer>
    )
  }
}
