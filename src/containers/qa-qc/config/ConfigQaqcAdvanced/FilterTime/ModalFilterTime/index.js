import { Button, Col, Form, message, Modal, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTimeUTC } from 'utils/datetime'
import { ModalConfirmCancel } from '../../components/index'
import { FIELDS } from '../index'
import { i18n } from '../index'
import FormTableMeasureTime from './FormTableMeasureTime'

@connect(state => ({
  measuresObj: state.global.measuresObj,
}))
@Form.create()
export default class ModalFilterTime extends Component {
  constructor(props) {
    super(props)
    this.tableRef = React.createRef()
    this.state = {
      stationAutoList: [],
      isVisible: false,
      measureKeyListSelected: [],
      isDisable: true,
      stationType: '',
      measuringList: [],
      dataSource: [],
      isModalConfirmCancel: false,
    }
  }

  onStationAutosFetchSuccess = stationAutoList => {
    this.setState(
      {
        stationAutoList,
      },
      () => {
        this.setInitValuesModalEdit()
        this.setInitialSelected()
      }
    )
  }

  setInitialSelected = () => {
    const { dataItemFilterTime } = this.props
    if (!dataItemFilterTime || !dataItemFilterTime.conditions) return
    const measureKeyHasValue = dataItemFilterTime.conditions.map(
      condition => condition.measure
    )
    this.setState({
      measureKeyListSelected: measureKeyHasValue,
    })
  }

  setInitValuesModalEdit = () => {
    const { modalType } = this.props
    if (modalType === 'edit') {
      this.setInitValues()
      const dataSource = this.getDataSource()
      this.setState({ dataSource }, () => {
        this.tableRef.current.setInitValues()
      })
    }
  }

  getDataSource = stationAutoValue => {
    const { form } = this.props
    const { stationAutoList } = this.state
    const stationAutoValueField =
      stationAutoValue || form.getFieldValue(FIELDS.STATION_AUTO_ID)

    if (!stationAutoValueField) return []

    const stationAuto = stationAutoList.find(
      stationAuto => stationAuto._id === stationAutoValueField
    )

    const measureList = getMeasuringListFromStationAutos([stationAuto])
    const dataSource = measureList.map(measure => ({
      measure: measure.key,
      startAt: null,
      endAt: null,
    }))
    return dataSource
  }

  getConditionParam = () => {
    const { form } = this.props
    const { conditions } = form.getFieldsValue()

    //convert condition array to condition object
    const conditionList = Object.entries(conditions)
      .filter(([, value]) => Array.isArray(value) && value.length > 0)
      .map(([key, value]) => {
        return {
          measure: key,
          startAt: getTimeUTC(moment(value[0]).utc()),
          endAt: getTimeUTC(moment(value[1]).utc()),
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

  componentDidUpdate = prevProps => {
    const { modalType, form } = this.props

    if (modalType === 'edit') {
      const { dataItemFilterTime } = this.props
      const prevId = _.get(prevProps, 'dataItemFilterTime._id')
      const id = _.get(dataItemFilterTime, '_id')
      if (prevId !== id) {
        form.resetFields()
        this.setInitValuesModalEdit()
        this.setInitialSelected()
      }
    }
  }

  onCancelModal = () => {
    const { form, confirmCancel } = this.props

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
    confirmCancel(false)
  }

  closeModalConfirmCancel = () => {
    this.setState({
      isModalConfirmCancel: false,
    })
  }

  handleConfirmCancel = () => {
    const { confirmCancel, clearDataItemFilterTime } = this.props
    this.setState({
      isModalConfirmCancel: false,
      dataSource: [],
    })
    clearDataItemFilterTime()
    confirmCancel(false)
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

  handleSubmitForm = async () => {
    const {
      form,
      showModal,
      modalType,
      dataItemFilterTime,
      clearDataItemFilterTime,
    } = this.props
    const idFilterTime = _.get(dataItemFilterTime, '_id')

    await form.validateFields()
    const params = this.getParams()

    if (modalType === 'create') {
      try {
        await CalculateApi.createQaqcConfig(params)
        message.success(t('qaqcConfig.advanced.message.create.success'))
      } catch (error) {
        message.success(t('addon.onSave.add.error'))
      }
    } else if (modalType === 'edit') {
      try {
        await CalculateApi.updateQaqcConfigById(idFilterTime, params)
        message.success(t('dataSearchFilterForm.update.success'))
      } catch (error) {
        message.success(t('addon.onSave.add.error'))
      }
    }

    form.resetFields()
    clearDataItemFilterTime()
    this.setState({
      dataSource: [],
    })
    showModal(false)
  }

  handleResetModal = () => {
    const { form, modalType } = this.props

    if (modalType === 'create') {
      form.resetFields()
      this.setState({
        dataSource: [],
      })
    }
    this.setState({
      measureKeyListSelected: [],
    })
    form.resetFields(['conditions'])
  }

  handleChangeStationType = () => {
    const { form } = this.props
    form.resetFields([FIELDS.STATION_AUTO_ID])
  }

  handleOnStationAutoChange = value => {
    const dataSource = this.getDataSource(value)

    this.setState({
      dataSource,
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
      measuresObj,
      ...otherProps
    } = this.props

    const {
      measureKeyListSelected,
      dataSource,
      isModalConfirmCancel,
    } = this.state

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const stationAuto = form.getFieldValue(FIELDS.STATION_AUTO_ID)
    const isEdit = modalType === 'edit'

    return (
      <div>
        <Modal
          width={900}
          title={modalTitle}
          onCancel={this.onCancelModal}
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
                <Button
                  type="primary"
                  onClick={this.handleSubmitForm}
                  disabled={measureKeyListSelected.length === 0}
                >
                  {isEdit ? i18n().button.update : i18n().button.create}
                </Button>
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
                  onChange: this.handleOnStationAutoChange,
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
              ref={this.tableRef}
              dataSource={dataSource}
              measuresObj={measuresObj}
              dataItemFilterTime={dataItemFilterTime}
              conditions={_.get(dataItemFilterTime, 'conditions')}
              form={form}
              stationAuto={stationAuto}
              setMeasureKeyListSelected={this.setMeasureKeyListSelected}
              isEdit={isEdit}
              measureKeyListSelected={measureKeyListSelected}
              id={_.get(dataItemFilterTime, '_id')}
            />
          </Row>
        </Modal>
        <ModalConfirmCancel
          onCancel={() =>
            this.setState({
              isModalConfirmCancel: false,
            })
          }
          type={modalType}
          onConfirmCancel={this.handleConfirmCancel}
          visible={isModalConfirmCancel}
          onCancelOut={this.closeModalConfirmCancel}
        />
      </div>
    )
  }
}
