import { Button, Col, Form, Row, Switch, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import SelectStationAuto from 'containers/search/common/select-station-auto'
import React, { Component } from 'react'
import { ModalConfirmDelete } from '../components/index'
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
    isShowModalFilterTime: false,
    isShowModalConfirmDelete: false,
    timeFilterItemKey: '',
    modalFilterTimeType: '',
    dataFilterTime: [],
    isLoading: false,
    isApplyFilterTime: true,
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
    const { form } = this.props
    this.setState({
      isShowModalFilterTime: false,
    })
    form.resetFields([FIELDS.STATION_TYPE, FIELDS.STATION_AUTO_ID])
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

  deleteTimeFilterItem = async () => {
    const { timeFilterItemKey } = this.state
    try {
      await CalculateApi.deleteQaqcConfig(timeFilterItemKey)
      this.setState({
        isShowModalConfirmDelete: false,
      })
      message.success(t('addon.onDelete.success'))
    } catch (error) {
      this.setState({
        isShowModalConfirmDelete: false,
      })
      message.error(t('addon.onDelete.error'))
    }
    this.getData()
  }

  handleStatus = () => {
    return 'Áp dụng'
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

  onFinishCreate = isShowModalFilterTime => {
    this.setState({
      isShowModalFilterTime,
    })
    this.getData()
  }

  onChangeSwitchFilter = async value => {
    const param = {
      excludeParametersByTime: value,
    }
    console.log({ param })
    await toggleQaqcConfig(param)
    this.setState({
      isApplyFilterTime: value,
    })
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
      isApplyFilterTime,
    } = this.state
    const DynamicModalFilterTime = {
      create: (
        <ModalFilterTime
          modalTitle="Thêm bộ lọc điều kiện mới"
          visible={isShowModalFilterTime}
          setIsModalFilter={this.onFinishCreate}
          form={form}
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
            <Switch defaultChecked onClick={this.onChangeSwitchFilter} />
            <div>Bộ lọc khoảng thời gian</div>
          </Col>
        </Row>

        <Clearfix height={20} />

        <TableFilterTime
          status={this.handleStatus}
          loading={isLoading}
          isDisable={isApplyFilterTime}
          onEditFilterTime={this.showModalEditFilterTime}
          dataSource={dataFilterTime}
          setTimeFilterItemKey={this.setTimeFilterItem}
          onCreateFilterTime={this.showModalCreateFilterTime}
        />

        {DynamicModalFilterTime[modalFilterTimeType]}

        <ModalConfirmDelete
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
