import { Drawer as DrawerAnt } from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import { Clearfix } from 'components/elements'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { createRef } from 'react'
import styled from 'styled-components'
import Breadcrumb from '../breadcrumb'
import DropdownButton from './components/DropdownButton'
import FormMonitoring from './form-create/index'
import Search from './search'
import TableMonitoringData from './TableMonitoringData'

const Drawer = styled(DrawerAnt)`
  .ant-drawer-body {
    height: calc(100% - 55px);
    flex-direction: column;
    padding: 0;
  }

  .ant-drawer-title {
    font-size: 16px;
    font-weight: 700;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 0;
    color: #111827;
  }
`

export default class StationFixedMonitoringData extends React.Component {
  state = {
    visibleDrawer: false,
    dataSource: [],
    loading: false,
    points: [],
    type: '',
  }

  formRef = createRef()

  componentDidMount = async () => {
    try {
      const periodic = await StationFixedPeriodic.getStationFixedPeriodics(
        {},
        {}
      )

      this.setState({
        points: periodic.data,
      })
    } catch (error) {
      console.error({ error })
    }
  }

  onClickImportManual = () => {
    this.setState({
      visibleDrawer: true,
      type: 'manual',
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

  setVisibleDrawer = visible => {
    this.setState({
      visibleDrawer: visible,
    })

    this.formRef.current.props.form.resetFields()
  }

  render() {
    const { dataSource, loading, visibleDrawer, points, type } = this.state

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData']} />
        <Search setMonitoringData={this.setMonitoringData} />
        <Clearfix height={15} />
        <TableMonitoringData dataSource={dataSource} loading={loading} />

        <Drawer
          title="Nhập liệu điểm quan trắc"
          visible={visibleDrawer}
          closable={false}
          placement="right"
          onClose={this.onCloseDrawer}
          width={600}
        >
          <FormMonitoring
            setVisibleDrawer={this.setVisibleDrawer}
            type={type}
            points={points}
            visibleDrawer={visibleDrawer}
            wrappedComponentRef={this.formRef}
            onResetForm={this.onResetForm}
          />
        </Drawer>

        <DropdownButton
          className="dropdown-button"
          onClickImportManual={this.onClickImportManual}
        />
      </PageContainer>
    )
  }
}
