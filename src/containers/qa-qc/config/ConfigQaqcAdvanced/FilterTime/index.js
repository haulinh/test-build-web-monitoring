import { Button, Col, Form, Row, Switch } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import SelectStationAuto from 'containers/search/common/select-station-auto'
import React, { Component } from 'react'
import { ModalConFirmDelete } from '../components'
import ModalFilterTime from './ModalFilterTime'
import TableFilterTime from './TableFilterTime'
import _ from 'lodash'

export const FIELDS = {
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_AUTO: 'stationKeys',
  STATION_AUTO_ID: 'stationId',
}

@Form.create()
export default class FilterTimeContainer extends Component {
  state = {
    isShowModalFilterTime: false,
    isShowModalConfirmDelete: false,
    timeFilterItemKey: '',
    modalFilterTimeType: '',
    dataFilterTime: [],
    isLoading: false,
  }

  showModalFilterTime = () => {
    this.setState({
      isShowModalFilterTime: true,
    })
  }

  showModalCreateFilterTime = () => {
    this.setState({
      modalFilterTimeType: 'create',
      isShowModalFilterTime: true,
    })
  }

  showModalEditFilterTime = () => {
    this.setState({
      modalFilterTimeType: 'edit',
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

  setTimeFilterItem = timeFilterItemKey => {
    this.setState({
      isShowModalConfirmDelete: true,
      timeFilterItemKey,
    })
  }

  getData = async () => {
    this.setState({
      isLoading: true,
    })
    const params = {
      ...this.hasPagination,
    }
    const results = await CalculateApi.getQaqcConfigs(params)
    this.setState({
      dataFilterTime: results.results,
      isLoading: false,
    })
  }

  deleteTimeFilterItem = async () => {
    const { timeFilterItemKey } = this.state
    await CalculateApi.deleteQaqcConfig(timeFilterItemKey)
    this.setState({
      isShowModalConfirmDelete: false,
    })
    this.getData()
  }

  hasPagination = {
    limit: 999999,
    offset: 0,
  }

  handleSearchFilterTime = async () => {
    this.setState({
      isLoading: true,
    })
    const { form } = this.props
    const stationKeyList = form.getFieldValue(FIELDS.STATION_AUTO)
    const stationKeys = _.join(stationKeyList, ',')
    let params = {
      ...this.hasPagination,
    }
    if (stationKeys) {
      params = {
        stationKeys,
        ...params,
      }
    }
    const results = await CalculateApi.getQaqcConfigs(params)
    this.setState({
      dataFilterTime: results.results,
      isLoading: false,
    })
  }

  onFinishCreate = setIsShowModal => {
    this.setState({
      isShowModalFilterTime: setIsShowModal,
    })
    this.getData()
  }

  componentDidMount = async () => {
    this.getData()
  }

  render() {
    const { form } = this.props
    const {
      isShowModalFilterTime,
      isShowModalConfirmDelete,
      modalFilterTimeType,
      dataFilterTime,
      isLoading,
    } = this.state

    const DynamicModalFilterTime = {
      create: (
        <ModalFilterTime
          modalTitle="Thêm bộ lọc điều kiện mới"
          visible={isShowModalFilterTime}
          setIsModalFilter={this.onFinishCreate}
          onCancel={this.closeModalFilterTime}
          modalType={modalFilterTimeType}
        />
      ),
      edit: (
        <ModalFilterTime
          modalTitle="Chỉnh sửa bộ lọc"
          visible={isShowModalFilterTime}
          onCancel={this.closeModalFilterTime}
          modalType={modalFilterTimeType}
          showModalConfirmDelete={this.showModalConfirmDelete}
        />
      ),
    }

    return (
      <div>
        <Row type="flex" span={24} justify="space-between" align="middle">
          <Col
            span={18}
            type="flex"
            style={{ display: 'flex', gap: 15, alignItems: 'center' }}
          >
            {form.getFieldDecorator(FIELDS.STATION_AUTO)(
              <SelectStationAuto
                fieldValue
                placeholder="Chọn trạm quan trắc"
                mode="multiple"
                style={{ width: '100%' }}
                maxTagCount={3}
              />
            )}
            <Button
              shape="circle"
              icon="search"
              size="small"
              loading={isLoading}
              onClick={this.handleSearchFilterTime}
            />
          </Col>

          <Col style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Switch defaultChecked />
            <div>Bộ lọc khoảng thời gian</div>
          </Col>
        </Row>

        <Clearfix height={20} />

        <TableFilterTime
          loading={isLoading}
          onEditFilterTime={this.showModalEditFilterTime}
          dataSource={dataFilterTime}
          setTimeFilterItemKey={this.setTimeFilterItem}
          onCreateFilterTime={this.showModalCreateFilterTime}
        />

        {DynamicModalFilterTime[modalFilterTimeType]}

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
