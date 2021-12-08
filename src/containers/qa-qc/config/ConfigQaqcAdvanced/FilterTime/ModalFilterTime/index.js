import { Button, Col, Form, Modal, Row, message } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { translate as t } from 'hoc/create-lang'
import React, { Component } from 'react'
import FormTableMeasureTime from './FormTableMeasureTime'
import { FIELDS, i18n } from '../index'
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
      measuringList: [],
    }
  }

  onStationAutosFetchSuccess = stationAutoList => {
    this.setState({
      stationAutoList,
    })
  }

  getDataSourceCreate = () => {
    const { form } = this.props
    const { stationAutoList } = this.state
    const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO_ID)

    if (!stationAutoValue) return []

    const stationAuto = stationAutoList.find(
      stationAuto => stationAuto._id === stationAutoValue
    )
    const measureList = getMeasuringListFromStationAutos([stationAuto])
    const dataSourceCreate = measureList.map(measure => ({
      measure: measure.key,
      startAt: null,
      endAt: null,
    }))
    return dataSourceCreate
  }

  getConditionParam = () => {
    const { form } = this.props
    const { conditions } = form.getFieldsValue()
    // console.log({ conditions })

    //convert condition array to condition object
    const conditionList = Object.entries(conditions)
      .filter(([, value]) => Array.isArray(value) && value.length > 0)
      .map(([key, value]) => {
        return {
          measure: key,
          startAt: getTimeUTC(moment(value[0]).startOf('day')),
          endAt: getTimeUTC(moment(value[1]).endOf('day')),
        }
      })

    return conditionList
  }

  setInitValues = () => {
    const { form, dataItemFilterTime } = this.props
    const stationAutoId = _.get(dataItemFilterTime, 'station._id')
    const stationTypeId = _.get(dataItemFilterTime, 'station.stationType._id')

    form.setFieldsValue({
      [FIELDS.STATION_TYPE]: stationTypeId,
      [FIELDS.STATION_AUTO_ID]: stationAutoId,
    })
  }

  componentDidMount = () => {
    const { modalType } = this.props
    if (modalType === 'edit') {
      this.setInitValues()
    }
  }

  componentDidUpdate = prevProps => {
    const { modalType } = this.props

    if (modalType === 'edit') {
      const { dataItemFilterTime } = this.props
      const prevId = _.get(prevProps, 'dataItemFilterTime._id')
      const id = _.get(dataItemFilterTime, '_id')
      if (prevId !== id) this.setInitValues()
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

    // console.log({ params })

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
    const { measureKeyListSelected } = this.state

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const stationAuto = form.getFieldValue(FIELDS.STATION_AUTO_ID)
    const isEdit = modalType === 'edit'

    const dataSource = isEdit
      ? dataItemFilterTime.conditions
      : this.getDataSourceCreate()

    const DynamicButtonSubmit = {
      edit: (
        <Button type="primary" onClick={this.handleSubmit}>
          {i18n().button.update}
        </Button>
      ),
      create: (
        <Button
          type="primary"
          onClick={this.handleSubmitCreate}
          disabled={measureKeyListSelected.length === 0}
        >
          {i18n().button.create}
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
            {isEdit ? (
              <Col>
                <Button type="danger" onClick={onShowModalConfirmDelete}>
                  {i18n().button.delete}
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
                {i18n().button.reset}
              </Button>
              {DynamicButtonSubmit[modalType]}
            </Col>
          </Row>,
        ]}
      >
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label={i18n().form.label.stationType}>
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
                  disabled={isEdit}
                  placeholder={i18n().form.placeholder.stationType}
                  fieldValue="_id"
                />
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label={i18n().form.label.station}>
              {form.getFieldDecorator(FIELDS.STATION_AUTO_ID, {
                onChange: this.handleChangeStationAuto,
                rules: [
                  {
                    required: true,
                    message: t('report.required.station'),
                  },
                ],
              })(
                <SelectStationAuto
                  disabled={!stationType || isEdit}
                  fieldValue="_id"
                  stationType={stationType}
                  placeholder={i18n().form.placeholder.station}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <FormTableMeasureTime
            dataSource={dataSource}
            form={form}
            stationAuto={stationAuto}
            setMeasureKeyListSelected={this.setMeasureKeyListSelected}
            isEdit={isEdit}
            measureKeyListSelected={measureKeyListSelected}
            id={_.get(dataItemFilterTime, '_id')}
          />
        </Row>
      </Modal>
    )
  }
}
