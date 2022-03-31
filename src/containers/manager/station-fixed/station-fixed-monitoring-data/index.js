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
import slug from 'constants/slug'
import TableMonitoringData from './TableMonitoringData'
import ModalConfirmCancel from './components/ModalConfirmCancel'
import { withRouter } from 'react-router'
import { i18n } from './constants'

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
@withRouter
export default class StationFixedMonitoringData extends React.Component {
  state = {
    visibleDrawer: false,
    dataSource: [],
    loading: false,
    points: [],
    type: '',
    visibleModalConfirmCancel: false,
    createSuccess: false,
  }

  formRef = createRef()

  componentDidMount = async () => {
    try {
      const stationFixed = await StationFixedPeriodic.getStationFixedPeriodics(
        {},
        {}
      )

      const stationFixedActive = stationFixed.data.filter(point => point.active)

      this.setState({
        points: stationFixedActive,
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
      visibleModalConfirmCancel: true,
    })
  }

  setMonitoringData = (dataSource, loading) => {
    this.setState({ dataSource, loading, createSuccess: false })
  }

  setVisibleDrawer = visible => {
    this.setState({
      visibleDrawer: visible,
      createSuccess: true,
    })

    this.formRef.current.props.form.resetFields()
  }

  onConfirmCancel = () => {
    this.setState({
      visibleDrawer: false,
      visibleModalConfirmCancel: false,
    })

    this.formRef.current.props.form.resetFields()
  }

  onCancelOut = () => {
    this.setState({
      visibleModalConfirmCancel: false,
    })
  }

  onClickImportFile = () => {
    const { history } = this.props

    history.push(slug.stationFixed.monitoringDataImport)
  }

  render() {
    const {
      dataSource,
      loading,
      visibleDrawer,
      points,
      type,
      visibleModalConfirmCancel,
      createSuccess,
    } = this.state

    return (
      <div>
        <PageContainer>
          <Breadcrumb items={['monitoringData']} />
          <Search
            setMonitoringData={this.setMonitoringData}
            createSuccess={createSuccess}
          />
          <Clearfix height={15} />
          <TableMonitoringData dataSource={dataSource} loading={loading} />

          <Drawer
            key={visibleDrawer}
            title={i18n().drawer.title}
            visible={visibleDrawer}
            closable
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
              formType="create"
            />
            <ModalConfirmCancel
              visible={visibleModalConfirmCancel}
              onConfirmCancel={this.onConfirmCancel}
              onCancelOut={this.onCancelOut}
              closable={false}
            />
          </Drawer>

          <DropdownButton
            className="dropdown-button"
            onClickImportManual={this.onClickImportManual}
            onClickImportFile={this.onClickImportFile}
          />
        </PageContainer>
      </div>
    )
  }
}
