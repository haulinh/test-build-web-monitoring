import { Button, Col, Form, Input, Modal, Row, message } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import React from 'react'
import { Clearfix } from 'components/layouts/styles'
import { FIELDS } from '../index'
import FormTableMeasureCondition from './FormTableMeasureCondition'
import _ from 'lodash'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import CalculateApi from 'api/CalculateApi'
import { ModalConfirmCancel } from 'containers/qa-qc/config/ConfigQaqcAdvanced/components'

@Form.create()
class ModalConditionFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      visible: false,
      isDeleteVisible: false,
      measures: [],
      stationAutos: [],
      stationAutoList: [],
      isShowModalConditionFilter: true,
      isShowModalConfirmCancel: false,
    }
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({
      stationAutos,
    })
  }

  onChangeStationType = stationKey => {
    const { form } = this.props
    form.resetFields('stationKeys')
    form.resetFields('conditions')
    const { stationAutos } = this.state
    const stationAutoList = stationAutos.filter(
      stationAuto => _.get(stationAuto, 'stationType.key') === stationKey
    )
    this.setState({
      stationAutoList,
    })
  }

  onChangeStation = () => {
    const { form } = this.props
    form.resetFields('conditions')
  }

  getMeasureList = () => {
    const { form } = this.props
    const stationAutoValue = form.getFieldValue(FIELDS.STATION)

    if (!stationAutoValue) return []

    const stationAutoList = this.state.stationAutos.filter(stationAuto =>
      stationAutoValue.includes(stationAuto.key)
    )
    const measureList = getMeasuringListFromStationAutos(stationAutoList)
    return measureList
  }

  onSubmit = async e => {
    e.preventDefault()
    const { form, onCancel } = this.props
    const values = await form.validateFields()
    this.setState({ loading: true })

    const stationAutoValue = await form.getFieldValue(FIELDS.STATION)

    if (!stationAutoValue) return []

    const stationAutoList = this.state.stationAutos.find(stationAuto =>
      stationAutoValue.includes(stationAuto.key)
    )

    const param = {
      stationId: stationAutoList._id,
      name: values.filterName,
      type: 'value',
      conditions: values.conditions,
    }

    try {
      await CalculateApi.createQaqcConfigs(param)
      this.setState({ loading: false })
      message.success('Tạo thành công')
    } catch (error) {
      console.log(error)
    }
    onCancel()
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
    const { form, onCancel, ...otherProps } = this.props
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
              loading={this.state.loading}
              onClick={this.onSubmit}
            >
              Tạo mới
            </Button>
            <Clearfix width={9} />
          </Row>,
        ]}
      >
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label="Tên bộ lọc">
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
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn loại trạm',
                  },
                ],
              })(<SelectStationType placeholder="Chọn loại trạm" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Trạm quan trắc">
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
                  placeholder="Chọn trạm quan trắc"
                  stationType={stationType}
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <FormTableMeasureCondition form={form} measureList={measureList} />
        </Row>
        <ModalConfirmCancel
          visible={this.state.isShowModalConfirmCancel}
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
