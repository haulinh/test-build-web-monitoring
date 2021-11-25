import { Button, Col, Form, Modal, Row } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { translate as t } from 'hoc/create-lang'
import React, { Component } from 'react'
import FormTableMeasureTime from './FormTableMeasureTime'
import { FIELDS } from '../index'
import _ from 'lodash'
import { getTimeUTC } from 'utils/datetime'
import CalculateApi from 'api/CalculateApi'
import moment from 'moment'

@Form.create()
export default class ModalFilterTime extends Component {
  state = {
    stationAutos: [],
    isVisible: false,
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({
      stationAutos,
    })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const { stationAutos } = this.state
    const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO_ID)

    if (!stationAutoValue) return []

    const stationAuto = stationAutos.filter(stationAuto =>
      stationAutoValue.includes(stationAuto._id)
    )

    const measureList = getMeasuringListFromStationAutos(stationAuto)
    return measureList
  }

  handleConditions = () => {
    const { form } = this.props
    const { conditions } = form.getFieldsValue()
    const newConditions = Object.entries(conditions)
    const condition = newConditions.map(condition => {
      return {
        measure: _.get(condition, '[0]'),
        startAt: getTimeUTC(moment(_.get(condition, '[1][0]')).startOf('day')),
        endAt: getTimeUTC(moment(_.get(condition, '[1][1]')).endOf('day')),
      }
    })
    return condition
  }

  handleSubmitCreate = async () => {
    const { form, setIsModalFilter } = this.props
    await form.validateFields()
    const { stationAutos } = this.state
    const values = form.getFieldsValue()
    const { stationId } = values
    const conditions = this.handleConditions()

    const stationAutoId = form.getFieldValue(FIELDS.STATION_AUTO_ID)
    const stationAuto = stationAutos.find(
      stationAuto => stationAuto._id === stationAutoId
    )
    const stationAutoName = _.get(stationAuto, 'name')
    const params = {
      name: stationAutoName,
      type: 'time',
      stationId,
      conditions,
    }
    await CalculateApi.postQaqcConfigs(params)
    form.resetFields()
    setIsModalFilter(false)
  }

  resetModalFilterTime = () => {
    const { form } = this.props
    form.resetFields()
  }

  onChangeStationType = () => {
    const { form } = this.props
    form.resetFields([FIELDS.STATION_AUTO_ID])
  }

  render() {
    const {
      form,
      showModalConfirmDelete,
      modalType,
      modalTitle,
      ...otherProps
    } = this.props
    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const measureList = this.getMeasuringList()

    const DynamicButtonSubmit = {
      edit: (
        <Button type="primary" onClick={this.handleSubmit}>
          Cập nhật
        </Button>
      ),
      create: (
        <Button type="primary" onClick={this.handleSubmitCreate}>
          Tạo mới
        </Button>
      ),
    }
    return (
      <Modal
        width={900}
        title={modalTitle}
        {...otherProps}
        centered
        footer={[
          <Row type="flex" justify="space-between">
            {modalType === 'edit' ? (
              <Col>
                <Button type="danger" onClick={showModalConfirmDelete}>
                  Xoá bộ lọc
                </Button>
              </Col>
            ) : (
              <Col></Col>
            )}
            <Col>
              <Button onClick={this.resetModalFilterTime}>Nhập lại</Button>
              {DynamicButtonSubmit[modalType]}
            </Col>
          </Row>,
        ]}
      >
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: t('report.required.station'),
                  },
                ],
              })(
                <SelectStationType
                  placeholder="Chọn loại trạm"
                  fieldValue="_id"
                />
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="Trạm quan trắc">
              {form.getFieldDecorator(FIELDS.STATION_AUTO_ID, {
                rules: [
                  {
                    required: true,
                    message: t('report.required.station'),
                  },
                ],
              })(
                <SelectStationAuto
                  placeholder="Chọn trạm quan trắc"
                  stationType={stationType}
                  fieldValue="_id"
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <FormTableMeasureTime
            form={form}
            measureList={measureList}
            modalType={modalType}
          />
        </Row>
      </Modal>
    )
  }
}
