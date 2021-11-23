import { Button, Col, Form, Modal, Row } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { translate as t } from 'hoc/create-lang'
import React, { Component } from 'react'
import FormTableMeasureTime from './FormTableMeasureTime'
import { FIELDS } from '../index'

@Form.create()
export default class ModalFilterTime extends Component {
  state = {
    stationAutos: [],
    stationAuto: [],
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({
      stationAutos,
    })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO)

    if (!stationAutoValue) return []

    const stationAuto = this.state.stationAutos.filter(stationAuto =>
      stationAutoValue.includes(stationAuto.key)
    )

    const measureList = getMeasuringListFromStationAutos(stationAuto)
    return measureList
  }

  handleSearch = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    console.log(values)
  }

  render() {
    const { form, showModalConfirmDelete, ...otherProps } = this.props
    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const measureList = this.getMeasuringList()

    return (
      <Modal
        width={900}
        title="Thêm bộ lọc điều kiện mới"
        {...otherProps}
        centered
        footer={[
          <Row type="flex" justify="space-between">
            <Button type="danger" onClick={showModalConfirmDelete}>
              Xoá bộ lọc
            </Button>
            <div style={{ display: 'flex' }}>
              <Button>Nhập lại</Button>
              <Button type="primary" onClick={this.handleSearch}>
                Cập nhật
              </Button>
            </div>
          </Row>,
        ]}
      >
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="Loại trạm">
              {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                rules: [
                  {
                    required: true,
                    message: t('report.required.station'),
                  },
                ],
              })(<SelectStationType placeholder="Chọn loại trạm" />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="Trạm quan trắc">
              {form.getFieldDecorator(FIELDS.STATION_AUTO, {
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
                  onFetchSuccess={this.onStationAutosFetchSuccess}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row span={24}>
          <FormTableMeasureTime form={form} measureList={measureList} />
        </Row>
      </Modal>
    )
  }
}
