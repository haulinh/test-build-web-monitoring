import { Button, Col, Form, Row, Switch, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import SelectStationAuto from 'containers/search/common/select-station-auto'
import React, { Component } from 'react'
import { ModalConfirmDelete, ModalConfirmCancel } from '../components/index'
import ModalFilterTime from './ModalFilterTime'
import TableFilterTime from './TableFilterTime'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'
import { toggleQaqcConfig } from 'api/CategoryApi'

export const FIELDS = {
  STATION_TYPE: 'stationType',
  MEASURING_LIST: 'measure',
  STATION_AUTO: 'stationKeys',
  STATION_AUTO_ID: 'stationId',
}

@Form.create()
export default class FilterTimeContainer extends Component {
  state = {
    isModalFilterTime: false,
    isModalConfirmDelete: false,
    isModalConfirmCancel: false,
    isLoading: false,
    hasApplyFilterTime: true,
    filterItemId: '',
    modalType: '',
    dataFilterTime: [],
  }

  showModalCreate = () => {
    this.setState({
      modalType: 'create',
      isModalFilterTime: true,
    })
  }

  showModalEdit = () => {
    this.setState({
      modalType: 'edit',
      isModalFilterTime: true,
    })
  }

  showModalConfirmDelete = () => {
    this.setState({
      isModalConfirmDelete: true,
    })
  }

  closeModalConfirmDelete = () => {
    this.setState({
      isModalConfirmDelete: false,
    })
  }

  closeModalFilterTime = () => {
    const { form } = this.props
    const values = form.getFieldsValue([
      FIELDS.STATION_TYPE,
      FIELDS.STATION_AUTO_ID,
    ])

    //check has value
    const isValue = Object.values(values).some(value => value)
    if (isValue) {
      this.setState({
        isModalConfirmCancel: true,
      })
      return
    }

    this.setState({
      isModalFilterTime: false,
    })
  }

  closeModalConfirmCancel = () => {
    this.setState({
      isModalConfirmCancel: false,
    })
  }

  handleConfirmCancel = () => {
    const { form } = this.props
    form.resetFields([FIELDS.STATION_TYPE, FIELDS.STATION_AUTO_ID])

    this.setState({
      isModalFilterTime: false,
      isModalConfirmCancel: false,
    })
  }

  setItemDelete = filterItemId => {
    this.setState({
      isModalConfirmDelete: true,
      filterItemId,
    })
  }

  getData = async () => {
    this.setState({
      isLoading: true,
    })

    const params = {
      ...this.pagination,
    }

    try {
      const response = await CalculateApi.getQaqcConfigs(params)
      this.setState({
        dataFilterTime: response.results,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  handleDeleteFilterItem = async () => {
    const { filterItemId } = this.state

    try {
      await CalculateApi.deleteQaqcConfig(filterItemId)
      this.setState({
        isModalConfirmDelete: false,
      })
      message.success(t('addon.onDelete.success'))
    } catch (error) {
      this.setState({
        isModalConfirmDelete: false,
      })
      message.error(t('addon.onDelete.error'))
    }

    this.getData()
  }

  pagination = {
    limit: 999999,
    offset: 0,
  }

  handleSearchFilterTime = async () => {
    this.setState({
      isLoading: true,
    })

    const { form } = this.props
    const stationKeyList = form.getFieldValue(FIELDS.STATION_AUTO)
    let params = {
      ...this.pagination,
    }

    if (!_.isEmpty(stationKeyList)) {
      const stationKeysStr = _.join(stationKeyList, ',')
      params = {
        stationKeys: stationKeysStr,
        ...params,
      }
    }

    try {
      const response = await CalculateApi.getQaqcConfigs(params)
      this.setState({
        dataFilterTime: response.results,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  handleFinishCreate = isModalFilterTime => {
    this.setState({
      isModalFilterTime,
    })
    this.getData()
  }

  handleToggleFilter = async value => {
    const param = {
      excludeParametersByTime: value,
    }

    await toggleQaqcConfig(param)
    this.setState({
      hasApplyFilterTime: value,
    })
  }

  componentDidMount = async () => {
    this.getData()
  }

  render() {
    const { form } = this.props
    const {
      isModalFilterTime,
      isModalConfirmDelete,
      isModalConfirmCancel,
      modalType,
      dataFilterTime,
      isLoading,
      hasApplyFilterTime,
    } = this.state

    const DynamicModalFilterTime = {
      create: (
        <ModalFilterTime
          modalTitle="Thêm bộ lọc điều kiện mới"
          visible={isModalFilterTime}
          showModal={this.handleFinishCreate}
          form={form}
          onCancel={this.closeModalFilterTime}
          modalType={modalType}
        />
      ),
      edit: (
        <ModalFilterTime
          modalTitle="Chỉnh sửa bộ lọc"
          visible={isModalFilterTime}
          onCancel={this.closeModalFilterTime}
          modalType={modalType}
          onShowModalConfirmDelete={this.showModalConfirmDelete}
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
            <Switch defaultChecked onClick={this.handleToggleFilter} />
            <div style={{ fontWeight: 500 }}>Bộ lọc khoảng thời gian</div>
          </Col>
        </Row>

        <Clearfix height={20} />

        <TableFilterTime
          status={this.handleStatus}
          loading={isLoading}
          isDisable={hasApplyFilterTime}
          onEditFilterTime={this.showModalEdit}
          dataSource={dataFilterTime}
          onDeleteFilterTime={this.setItemDelete}
          onCreateFilterTime={this.showModalCreate}
        />

        {DynamicModalFilterTime[modalType]}

        <ModalConfirmDelete
          visible={isModalConfirmDelete}
          closable={false}
          footer={false}
          onConfirmDelete={this.handleDeleteFilterItem}
          onCancelDelete={this.closeModalConfirmDelete}
        />

        <ModalConfirmCancel
          onCancel={() =>
            this.setState({
              isModalConfirmCancel: false,
            })
          }
          onConfirmCancel={this.handleConfirmCancel}
          visible={isModalConfirmCancel}
          onCancelOut={this.closeModalConfirmCancel}
        />
      </div>
    )
  }
}
