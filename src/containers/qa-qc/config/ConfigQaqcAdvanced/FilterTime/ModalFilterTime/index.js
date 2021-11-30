import { Button, Col, Form, Modal, Row, message } from 'antd'
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
  constructor(props) {
    super(props)
    this.state = {
      stationAutoList: [],
      isVisible: false,
      selected: [],
    }
  }

  onStationAutosFetchSuccess = stationAutoList => {
    this.setState({
      stationAutoList,
    })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const { stationAutoList } = this.state
    const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO_ID)

    if (!stationAutoValue) return []

    const stationAuto = stationAutoList.find(
      stationAuto => stationAuto._id === stationAutoValue
    )

    const measureList = getMeasuringListFromStationAutos([stationAuto])
    return measureList
  }

  getConditionParam = () => {
    const { form } = this.props
    const { conditions } = form.getFieldsValue()
    const measureList = this.getMeasuringList()

    //convert condition array to condition object
    const conditionsObj = Object.entries(conditions)

    const conditionList = conditionsObj.map(condition => {
      const measure = measureList.find(measure => measure.key === condition[0])
      return {
        measure: _.get(condition, '[0]'),
        measureName: measure.name,
        startAt: getTimeUTC(moment(_.get(condition, '[1][0]')).startOf('day')),
        endAt: getTimeUTC(moment(_.get(condition, '[1][1]')).endOf('day')),
      }
    })
    return conditionList
  }

  getParams = () => {
    const { form } = this.props
    const { stationAutoList } = this.state
    const values = form.getFieldsValue()
    const { stationId } = values
    const conditionList = this.getConditionParam()

    const stationAutoId = form.getFieldValue(FIELDS.STATION_AUTO_ID)
    const stationAuto = stationAutoList.find(
      stationAuto => stationAuto._id === stationAutoId
    )

    const stationAutoName = _.get(stationAuto, 'name')

    const params = {
      name: stationAutoName,
      type: 'time',
      stationId,
      conditions: conditionList,
    }

    return params
  }

  handleSubmitCreate = async () => {
    const { form, showModal } = this.props
    await form.validateFields()
    const params = this.getParams()

    try {
      await CalculateApi.createQaqcConfig(params)
      message.success(t('addon.onSave.add.success'))
    } catch (error) {
      message.success(t('addon.onSave.add.error'))
    }

    form.resetFields()
    showModal(false)
  }

  handleResetModal = () => {
    const { form } = this.props
    form.resetFields()
  }

  handleChangeStationType = () => {
    const { form } = this.props
    form.resetFields([FIELDS.STATION_AUTO_ID])
  }

  render() {
    const {
      form,
      onShowModalConfirmDelete,
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
                <Button type="danger" onClick={onShowModalConfirmDelete}>
                  Xoá bộ lọc
                </Button>
              </Col>
            ) : (
              <Col></Col>
            )}
            <Col>
              <Button onClick={this.handleResetModal}>Nhập lại</Button>
              {DynamicButtonSubmit[modalType]}
            </Col>
          </Row>,
        ]}
      >
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.handleChangeStationType,
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
                  disabled={!stationType}
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
