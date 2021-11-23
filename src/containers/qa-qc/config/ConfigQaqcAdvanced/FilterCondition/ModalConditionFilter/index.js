import { Button, Col, Form, Input, Modal, Row } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import React from 'react'
import { FIELDS } from '../index'
import FormTableMeasureCondition from './FormTableMeasureCondition'
import _ from 'lodash'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
@Form.create()
class ModalConditionFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isDeleteVisible: false,
      measures: [],
      stationAutos: [],
      stationAutoList: [],
    }
  }
  onStationAutosFetchSuccess = stationAutos => {
    this.setState({
      stationAutos,
    })
  }
  onChangeStationType = stationKey => {
    const { stationAutos } = this.state
    const stationAutoList = stationAutos.find(
      stationAuto => _.get(stationAuto, 'stationType.key') === stationKey
    )
    this.setState({
      stationAutoList,
    })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const stationAutoValue = form.getFieldValue(FIELDS.STATION)

    if (!stationAutoValue) return []

    const stationAutoList = this.state.stationAutos.filter(stationAuto =>
      stationAutoValue.includes(stationAuto.key)
    )
    const measureList = getMeasuringListFromStationAutos(stationAutoList)
    return measureList
  }

  onSubmit = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    console.log(values)
  }

  render() {
    const { form } = this.props

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)

    const measureList = this.getMeasuringList()
    return (
      <Modal
        title="Thêm điều kiện bộ lọc mới"
        {...this.props}
        centered
        width={1060}
        footer={[
          <Row type="flex" justify="end">
            <Button key="back">Nhập lại</Button>
            <Button key="submit" type="primary" onClick={this.onSubmit}>
              Tạo mới
            </Button>
          </Row>,
        ]}
      >
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label="Tên bộ lọc">
              {form.getFieldDecorator(FIELDS.FILTER_NAME, {
                initialValue: 'Tên bộ lọc',
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                onChange: this.onChangeStationType,
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<SelectStationType placeholder="Chọn loại trạm" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Trạm quan trắc">
              {form.getFieldDecorator(FIELDS.STATION, {
                rules: [
                  {
                    required: true,
                    message: '',
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
      </Modal>
    )
  }
}

export default ModalConditionFilter
