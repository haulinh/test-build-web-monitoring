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

@Form.create()
class ModalConditionFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      measures: [],
      stationAutos: [],
      isShowModalConditionFilter: true,
      isShowModalConfirmCancel: false,
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

    const param = {
      stationId: stationAuto._id,
      name: values.filterName,
      type: 'value',
      conditions: values.conditions,
    }

    try {
      await CalculateApi.createQaqcConfig(param)
      this.setState({ loading: false })
      message.success('Tạo thành công')
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
    }
    onCancel()
    form.resetFields()
    showModalConditionFilter(false)
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

  render() {
    const {
      form,
      onCancel,
      dataWithConditionFilter,
      ...otherProps
    } = this.props
    const { loading, isShowModalConfirmCancel } = this.state
    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const measureList = this.getMeasureList()

    return (
      <Modal
        title="Thêm điều kiện bộ lọc mới"
        {...otherProps}
        onCancel={this.showModalConfirmCancel}
        centered
        width={1060}
        footer={[
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
          </Row>,
        ]}
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
                  disabled={!stationType}
                  fieldValue="_id"
                  placeholder="Chọn trạm quan trắc"
                  stationType={stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                  stationHadConditionFilter={dataWithConditionFilter}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormTableMeasureCondition form={form} measureList={measureList} />
        </Row>
        <ModalConfirmCancel
          visible={isShowModalConfirmCancel}
          closable={false}
          footer={false}
          onCancelOut={this.handleContinueCreate}
          onConfirmCancel={this.handleCancelCreate}
        />
      </Modal>
    )
  }
}

export default ModalConditionFilter
