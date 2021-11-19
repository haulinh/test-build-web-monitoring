import { Col, Row, Switch, Icon, Button } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import React, { Component } from 'react'
import ModalFilterTime from './ModalFilterTime'
import TableFilterTime from './TableFilterTime'
import ModalComfirm from './ModalComfirm'

export const FIELDS = {
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_AUTO: 'stationKeys',
}

export default class FilterTimeContainer extends Component {
  state = {
    stationKey: '',
    isShowModal: false,
    showConfirmDelete: false,
  }

  showModal = () => {
    this.setState({
      isShowModal: true,
    })
  }

  showConfirmDelete = () => {
    this.setState({
      showConfirmDelete: true,
    })
  }

  onCancelDelete = () => {
    this.setState({
      showConfirmDelete: false,
    })
  }

  onCancelModal = () => {
    this.setState({
      isShowModal: false,
    })
  }

  onChangeStationAuto = stationKey => {
    this.setState({
      stationKey,
    })
  }

  handleDataChange = hasData => {
    this.setState({
      hasData,
    })
  }

  render() {
    const { stationKey, isShowModal, showConfirmDelete } = this.state
    return (
      <div>
        <Row type="flex" span={24} justify="space-between" align="middle">
          <Col span={5}>
            <SelectStationAuto
              onChange={this.onChangeStationAuto}
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
          deleteRecord={this.showConfirmDelete}
          footer={() => (
            <Row style={{ color: '#1890FF' }} align="middle">
              <Button type="link" onClick={this.showModal}>
                <Icon type="plus" style={{ marginRight: 5 }} />
                Thêm điều kiện lọc
              </Button>
            </Row>
          )}
        />
        <ModalFilterTime
          visible={isShowModal}
          onCancel={this.onCancelModal}
          showConfirmDelete={this.showConfirmDelete}
        />
        <ModalComfirm
          visible={showConfirmDelete}
          closable={false}
          footer={false}
          onCancelDelete={this.onCancelDelete}
        />
      </div>
    )
  }
}
