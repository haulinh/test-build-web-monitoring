import { Button, Col, Form, Modal, Row } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import React, { Component } from 'react'
import FormTableMeasureTime from './FormTableMeasureTime'
import { FIELDS } from '../index'

@Form.create()
export default class ModalFilterTime extends Component {
  state = {
    stationAutos: [],
    stationAutoList: [],
  }
  onStationAutosFetchSuccess = stationAutos => {
    this.setState({
      stationAutos,
    })
  }
  onChangeStationType = stationKey => {
    const { stationAutos } = this.state
    const stationAutoList = stationAutos.filter(
      stationAuto => _.get(stationAuto, 'stationType.key') === stationKey
    )
    this.setState({
      stationAutoList,
    })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const stationAutoValue = form.getFieldValue(FIELDS.STATION_AUTO)

    if (!stationAutoValue) return []

    const stationAutoList = this.state.stationAutos.filter(stationAuto =>
      stationAutoValue.includes(stationAuto.key)
    )
    const measureList = getMeasuringListFromStationAutos(stationAutoList)
    return measureList
  }

  handleSearch = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const { stationKeys, stationType, time, ...newValues } = values
    console.log(newValues)
  }

  render() {
    const { form, showConfirmDelete } = this.props

    const stationType = form.getFieldValue(FIELDS.STATION_TYPE)
    const measureList = this.getMeasuringList()
    return (
      <Modal
        width={900}
        title="Thêm bộ lọc điều kiện mới"
        {...this.props}
        centered
        footer={[
          <Row type="flex" justify="space-between">
            <Button type="danger" onClick={showConfirmDelete}>
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
                onChange: this.onChangeStationType,
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
