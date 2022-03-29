import { Col, DatePicker, Input, Row } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS } from '../constants'
import SelectPoint from '../search/SelectPoint'

export default class FormInfoBasic extends Component {
  state = {
    stationTypeId: '',
  }

  render() {
    const { form, onChangePoint, points } = this.props

    return (
      <div>
        <div className="title">Thông tin cơ bản</div>
        <Row
          gutter={16}
          justify="space-between"
          type="flex"
          style={{ width: '100%' }}
        >
          <Col span={24}>
            <FormItem label="Tên báo cáo" style={{ width: '100%' }}>
              {form.getFieldDecorator(FIELDS.NAME_REPORT, {
                rules: [
                  {
                    required: true,
                    message: 'Tên báo cáo không được để trống',
                  },
                ],
              })(<Input style={{ width: '100%' }} placeholder="Tên báo cáo" />)}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={16}
          justify="space-between"
          type="flex"
          style={{ width: '100%' }}
        >
          <Col span={12}>
            <FormItem label="Điểm quan trắc" style={{ width: '100%' }}>
              {form.getFieldDecorator(FIELDS.POINT, {
                onChange: onChangePoint,
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn điểm quan trắc',
                  },
                ],
              })(
                <SelectPoint
                  points={points}
                  form={form}
                  mode="default"
                  size="default"
                  label="Điểm quan trắc"
                  showSearch
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="Thời gian" style={{ width: '100%' }}>
              {form.getFieldDecorator(FIELDS.TIME, {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="Select Time"
                  format="HH:mm DD/MM/YYYY"
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}
