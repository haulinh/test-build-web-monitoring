import { Col, Row, Switch, Icon, Button } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import React, { Component } from 'react'
import ModalFilterTime from './ModalFilterTime'
import TableFilterTime from './TableFilterTime'
import ModalConFirmDelete from '../components/ModalConFirmDelete'

export const FIELDS = {
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_AUTO: 'stationKeys',
}

export default class FilterTimeContainer extends Component {
  state = {
    stationKey: '',
    isShowModal: false,
    isShowConfirmDelete: false,
    conFirmDelete: false,
    recordKey: '',
    dataSource: [
      {
        key: '1',
        stationName: 'VINATEX TOMS',
        measure: 'pH, COD, NO2, NO3, TSS',
        status: 'outdate',
      },
      {
        key: '2',
        stationName: 'Hoàn kiếm',
        measure: 'pH, COD, NO2, NO3, TSS',
        status: 'apply',
      },
      {
        key: '3',
        stationName: 'TEST_QUI',
        measure: 'pH, COD, NO2, NO3, TSS',
        status: 'outdate',
      },
    ],
  }

  showModal = () => {
    this.setState({
      isShowModal: true,
    })
  }

  showConfirmDelete = () => {
    this.setState({
      isShowConfirmDelete: true,
    })
  }

  handleCancelDelete = () => {
    this.setState({
      isShowConfirmDelete: false,
    })
  }

  handleCancelModal = () => {
    this.setState({
      isShowModal: false,
    })
  }

  handleChangeStationAuto = stationKey => {
    this.setState({
      stationKey,
    })
  }
  getRecordKey = recordKey => {
    this.setState({
      isShowConfirmDelete: true,
      recordKey,
    })
  }

  handleDeleteRecord = () => {
    const { recordKey } = this.state
    const dataSource = [...this.state.dataSource]
    this.setState({
      dataSource: dataSource.filter(record => record.key !== recordKey),
      isShowConfirmDelete: false,
    })
  }

  render() {
    const {
      stationKey,
      isShowModal,
      isShowConfirmDelete,
      dataSource,
    } = this.state
    return (
      <div>
        <Row type="flex" span={24} justify="space-between" align="middle">
          <Col span={5}>
            <SelectStationAuto
              onChange={this.handleChangeStationAuto}
              placeholder="Chọn trạm quan trắc"
              value={stationKey}
            />
          </Col>
          <Col style={{ display: 'flex', gap: 10 }}>
            <Switch defaultChecked />
            <p>Bộ lọc khoảng thời gian</p>
          </Col>
        </Row>
        <Clearfix height={20} />
        <TableFilterTime
          editRecord={this.showModal}
          dataSource={dataSource}
          recordKey={this.getRecordKey}
          footer={() => (
            <Row style={{ color: '#1890FF' }} align="middle">
              <Button type="link" onClick={this.showModal}>
                <Icon type="plus" style={{ marginRight: 5 }} />
                Thêm điều kiện lọc
              </Button>
            </Row>
          )}
        />
        <ModalConFirmDelete
          visible={isShowConfirmDelete}
          closable={false}
          footer={false}
          onConfirmDelete={this.handleDeleteRecord}
          onCancelDelete={this.handleCancelDelete}
        />
        <ModalFilterTime
          visible={isShowModal}
          onCancel={this.handleCancelModal}
          showConfirmDelete={this.showConfirmDelete}
        />
      </div>
    )
  }
}
