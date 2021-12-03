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
      measureKeyListSelected: [],
      isDisable: true,
      stationType: '',
      dataSource: [],
      measuringList: [],
    }
  }

  onStationAutosFetchSuccess = stationAutoList => {
    this.setState({
      stationAutoList,
    })
  }

  getMeasuringList = async () => {
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

  // getDataSource = () => {
  //   const { dataItemFilterTime, modalType } = this.props
  //   const measureList = this.getMeasuringList()
  //   const measureListKey = measureList.map(measure => measure.key)
  //   const conditions = _.get(dataItemFilterTime, 'conditions')
  //   const measuringList = measureListKey.map(measureKey => {
  //     return {
  //       measure: measureKey,
  //     }
  //   })
  //   if (modalType === 'edit') {
  //     this.setState({
  //       dataSource: conditions,
  //     })
  //   } else {
  //     this.setState({
  //       dataSource: measuringList,
  //     })
  //   }
  // }

  getConditionParam = () => {
    const { form } = this.props
    const { conditions } = form.getFieldsValue()

    //convert condition array to condition object
    const conditionList = Object.entries(conditions)
      .filter(([key, value]) => value.length > 0)
      .map(([key, value]) => {
        return {
          measure: key,
          startAt: getTimeUTC(moment(value[0]).startOf('day')),
          endAt: getTimeUTC(moment(value[1]).endOf('day')),
        }
      })

    return conditionList
  }

  setFieldsSationType = () => {
    const { form, dataItemFilterTime } = this.props

    form.setFieldsValue({
      [FIELDS.STATION_TYPE]: _.get(
        dataItemFilterTime,
        'station.stationType._id'
      ),
    })
  }

  setFieldsSationAuto = () => {
    const { form, dataItemFilterTime } = this.props

    form.setFieldsValue({
      [FIELDS.STATION_AUTO_ID]: _.get(dataItemFilterTime, 'station._id'),
    })
  }

  componentDidMount = () => {
    const { modalType } = this.props
    if (modalType === 'edit') {
      this.setFieldsSationType()
      this.setFieldsSationAuto()
    }
  }

  componentDidUpdate = prevProps => {
    const { modalType, dataItemFilterTime } = this.props
    const idPrev = prevProps.dataItemFilterTime._id
    const id = dataItemFilterTime._id

    if (modalType === 'edit' && idPrev !== id) {
      this.setFieldsSationType()
      this.setFieldsSationAuto()
    }
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

  handleChangeStationAuto = async () => {
    this.setState({
      measureKeyListSelected: [],
    })
  }

  setMeasureKeyListSelected = selectedList => {
    this.setState({
      measureKeyListSelected: selectedList,
    })
  }

  render() {
    const {
      form,
      onShowModalConfirmDelete,
      modalType,
      modalTitle,
      dataItemFilterTime,
      ...otherProps
    } = this.props
    const { measureKeyListSelected, dataSource } = this.state

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const stationAuto = form.getFieldValue(FIELDS.STATION_AUTO_ID)

    const DynamicButtonSubmit = {
      edit: (
        <Button type="primary" onClick={this.handleSubmit}>
          Cập nhật
        </Button>
      ),
      create: (
        <Button
          type="primary"
          onClick={this.handleSubmitCreate}
          disabled={measureKeyListSelected.length === 0}
        >
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
              <Button
                onClick={this.handleResetModal}
                style={{ backgroundColor: '#E1EDFB', color: '#1890FF' }}
              >
                Nhập lại
              </Button>
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
                  disabled={modalType === 'edit'}
                  placeholder="Chọn loại trạm"
                  fieldValue="_id"
                />
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="Trạm quan trắc">
              {form.getFieldDecorator(FIELDS.STATION_AUTO_ID, {
                onChange: this.handleChangeStationAuto,
                rules: [
                  {
                    required: true,
                    message: t('report.required.station'),
                  },
                ],
              })(
                modalType === 'edit' ? (
                  <SelectStationAuto
                    fieldValue="_id"
                    disabled
                    onFetchSuccess={this.onStationAutosFetchSuccess}
                  />
                ) : (
                  <SelectStationAuto
                    disabled={!stationType}
                    placeholder="Chọn trạm quan trắc"
                    stationType={stationType}
                    fieldValue="_id"
                    onFetchSuccess={this.onStationAutosFetchSuccess}
                  />
                )
              )}
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <FormTableMeasureTime
            form={form}
            stationAuto={stationAuto}
            setMeasureKeyListSelected={this.setMeasureKeyListSelected}
            dataSource={dataSource}
            modalType={modalType}
            measureKeyListSelected={measureKeyListSelected}
          />
        </Row>
      </Modal>
    )
  }
}
