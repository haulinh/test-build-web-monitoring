import { Col, Row, Switch } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Clearfix } from 'components/layouts/styles'
import React, { Component } from 'react'
import ModalFilterTime from './ModalFilterTime'
import TableFilterTime from './TableFilterTime'
import { ModalConFirmDelete } from '../components'

export const FIELDS = {
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_AUTO: 'stationKeys',
}

export default class FilterTimeContainer extends Component {
  state = {
    stationKey: '',
    isShowModalFilterTime: false,
    isShowModalConfirmDelete: false,
    timeFilterItem: '',

    timeFilterList: [
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

  showModalFilterTime = () => {
    this.setState({
      isShowModalFilterTime: true,
    })
  }

  showModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: true,
    })
  }

  closeModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: false,
    })
  }

  closeModalFilterTime = () => {
    this.setState({
      isShowModalFilterTime: false,
    })
  }

  onChangeStationAuto = stationKey => {
    this.setState({
      stationKey,
    })
  }

  setTimeFilterItem = timeFilterItem => {
    this.setState({
      isShowModalConfirmDelete: true,
      timeFilterItem,
    })
  }

  deleteTimeFilterItem = () => {
    let { timeFilterList } = this.state
    const { timeFilterItem } = this.state
    timeFilterList = [...timeFilterList]
    const newTimeFilterList = timeFilterList.filter(
      item => item.key !== timeFilterItem
    )
    this.setState({
      timeFilterList: newTimeFilterList,
      isShowModalConfirmDelete: false,
    })
  }

  render() {
    const {
      stationKey,
      isShowModalFilterTime,
      isShowModalConfirmDelete,
      timeFilterList,
    } = this.state

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
          onEditRecord={this.showModalFilterTime}
          dataSource={timeFilterList}
          setTimeFilterItem={this.setTimeFilterItem}
          showModalFilterTime={this.showModalFilterTime}
        />

        <ModalFilterTime
          visible={isShowModalFilterTime}
          onCancel={this.closeModalFilterTime}
          showModalConfirmDelete={this.showModalConfirmDelete}
        />

        <ModalConFirmDelete
          visible={isShowModalConfirmDelete}
          closable={false}
          footer={false}
          onConfirmDelete={this.deleteTimeFilterItem}
          onCancelDelete={this.closeModalConfirmDelete}
        />
      </div>
    )
  }
}
