import { Button, Col, Form, Input, message, Modal, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { Clearfix } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { ModalConfirmCancel } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import React from 'react'
import { FIELDS } from '../index'
import FormTableMeasureCondition from './FormTableMeasureCondition'
import { FormItem } from 'components/layouts/styles'
import { ModalConfirmDelete } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'
import { connect } from 'react-redux'
import _ from 'lodash'

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return {
    stationAutoById,
  }
}

@Form.create()
@connect(mapStateToProp)
class ModalConditionFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      measures: [],
      stationAutos: [],
      isShowModalConditionFilter: true,
      isShowModalConfirmCancel: false,
      isShowModalConfirmDelete: false,
    }
  }

  componentDidMount() {
    const { type, form, conditionItemSelected } = this.props
    if (type === 'edit') {
      form.setFieldsValue({
        [FIELDS.FILTER_NAME]: conditionItemSelected.name,
        [FIELDS.STATION_TYPE]: conditionItemSelected.station.stationType._id,
        [FIELDS.STATION]: conditionItemSelected.station._id,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { type, form, conditionItemSelected } = this.props
    if (
      type === 'edit' &&
      prevProps.conditionItemSelected._id !== conditionItemSelected._id
    ) {
      form.setFieldsValue({
        [FIELDS.FILTER_NAME]: conditionItemSelected.name,
        [FIELDS.STATION_TYPE]: conditionItemSelected.station.stationType._id,
        [FIELDS.STATION]: conditionItemSelected.station._id,
      })
      return false
    }
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({
      stationAutos,
    })
  }

  onChangeStationType = () => {
    const { form } = this.props
    form.resetFields(FIELDS.STATION)
    form.resetFields(FIELDS.CONDITIONS)
  }

  onChangeStation = () => {
    const { form } = this.props
    form.resetFields(FIELDS.CONDITIONS)
  }

  getMeasureList = () => {
    const { form } = this.props
    const { stationAutos } = this.state
    const stationAutoValue = form.getFieldValue(FIELDS.STATION)
    if (!stationAutoValue) return []

    const stationAuto = stationAutos.find(
      stationAuto => stationAutoValue === stationAuto._id
    )
    const measureList = getMeasuringListFromStationAutos([stationAuto])
    return measureList
  }

  onSubmit = async e => {
    e.preventDefault()
    const { form, onCancel, showModalConditionFilter } = this.props
    const { stationAutos } = this.state
    const values = await form.validateFields()
    this.setState({ loading: true })

    const stationAutoValue = form.getFieldValue(FIELDS.STATION)

    const stationAuto = stationAutos.find(
      stationAuto => stationAutoValue === stationAuto._id
    )

    console.log(values.conditions)

    const param = {
      stationId: stationAuto._id,
      name: values.filterName,
      type: 'value',
      conditions: values.conditions,
    }

    // try {
    //   await CalculateApi.createQaqcConfig(param)
    //   this.setState({ loading: false })
    //   message.success('Tạo thành công')
    // } catch (error) {
    //   this.setState({ loading: false })
    //   console.log(error)
    // }
    // onCancel()
    // form.resetFields()
    // showModalConditionFilter(false)
  }

  handleResetFields = () => {
    const { form } = this.props
    form.resetFields()
  }

  showModalConfirmCancel = () => {
    this.setState({ isShowModalConfirmCancel: true })
  }

  handleContinueCreate = () => {
    this.setState({ isShowModalConfirmCancel: false })
  }

  handleCancelCreate = () => {
    const { form, onCancel } = this.props
    this.setState({ isShowModalConfirmCancel: false })
    onCancel()
    form.resetFields()
  }

  getStationAutosExcludeList = () => {
    const { dataWithConditionFilter } = this.props
    const stationAutosExcludeList = dataWithConditionFilter.map(item => {
      return item.stationId
    })
    return stationAutosExcludeList
  }

  handleDeleteConditionFilter = () => {
    this.setState({
      isShowModalConfirmDelete: true,
    })
  }

  onCancelModalConfirmDelete = () => {
    this.setState({
      isShowModalConfirmDelete: false,
    })
  }

  render() {
    const {
      form,
      onCancel,
      type,
      conditionItemSelected,
      stationAutoById,
      dataWithConditionFilter,
      ...otherProps
    } = this.props
    const {
      loading,
      isShowModalConfirmCancel,
      isShowModalConfirmDelete,
    } = this.state
    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const measureList =
      type === 'edit'
        ? _.get(
            stationAutoById,
            `${conditionItemSelected.stationId}.measuringList`,
            []
          )
        : this.getMeasureList()
    const stationAutosExcludeList = this.getStationAutosExcludeList()

    console.log(conditionItemSelected)
    const Footer = {
      create: (
        <Row type="flex" justify="end">
          <Button key="back" onClick={this.handleResetFields}>
            Nhập lại
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.onSubmit}
          >
            Tạo mới
          </Button>
          <Clearfix width={9} />
        </Row>
      ),
      edit: (
        <Row type="flex" justify="space-between">
          <Col span={3}>
            <Row type="flex" justify="start">
              <Clearfix width={9} />
              <Button
                type="danger"
                key="delete"
                onClick={this.handleDeleteConditionFilter}
              >
                Xóa bộ lọc
              </Button>
            </Row>
          </Col>
          <Col span={5}>
            <Row type="flex" justify="end">
              <Button key="back" onClick={this.handleResetFields}>
                Nhập lại
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.onSubmit}
              >
                Cập nhật
              </Button>
              <Clearfix width={9} />
            </Row>
          </Col>
        </Row>
      ),
    }

    return (
      <Modal
        {...otherProps}
        onCancel={this.showModalConfirmCancel}
        centered
        width={1060}
        footer={[Footer[type]]}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label="Tên bộ lọc">
              {form.getFieldDecorator(FIELDS.FILTER_NAME, {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng nhập tên bộ lọc',
                  },
                  {
                    max: 64,
                    message: 'Không được nhập quá 64 ký tự',
                  },
                  {
                    whitespace: true,
                    message: 'Vui lòng nhập dữ liệu',
                  },
                ],
              })(<Input placeholder="Tên bộ lọc" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn loại trạm',
                  },
                ],
              })(
                <SelectStationType
                  disabled={type === 'edit' ? true : false}
                  fieldValue="_id"
                  placeholder="Chọn loại trạm"
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Trạm quan trắc">
              {form.getFieldDecorator(FIELDS.STATION, {
                onChange: this.onChangeStation,
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn trạm quan trắc',
                  },
                ],
              })(
                <SelectStationAuto
                  disabled={type === 'edit' ? true : !stationType}
                  fieldValue="_id"
                  placeholder="Chọn trạm quan trắc"
                  stationType={stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                  stationAutosExclude={
                    type === 'create' ? stationAutosExcludeList : []
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormTableMeasureCondition
            form={form}
            measureList={measureList}
            data={conditionItemSelected.conditions}
            type={type}
          />
        </Row>
        <ModalConfirmCancel
          type={type}
          visible={isShowModalConfirmCancel}
          closable={false}
          footer={false}
          onCancelOut={this.handleContinueCreate}
          onConfirmCancel={this.handleCancelCreate}
        />
        <ModalConfirmDelete
          visible={isShowModalConfirmDelete}
          closable={false}
          footer={false}
          // onConfirmDelete={this.deleteConditionFilterItem}
          onCancelDelete={this.onCancelModalConfirmDelete}
        />
      </Modal>
    )
  }
}

export default ModalConditionFilter
