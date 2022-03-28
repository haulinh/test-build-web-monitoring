import SelectStationFixed from 'components/elements/select-station-fixed'
import { FormItem } from 'components/layouts/styles'
import SelectPhase from 'containers/manager/station-fixed/station-fixed-import-data/select-phase'
import _ from 'lodash'
import React, { Component } from 'react'
import { FIELDS } from '../constants'
import { Input, Row, Col } from 'antd'
import { DatePicker } from 'antd'
import moment from 'moment-timezone'

export default class FormInfoBasic extends Component {
  state = {
    stationTypeId: '',
  }

  render() {
    const { form, onChangePoint, onFetchPointSuccess } = this.props
    const { stationTypeId } = this.state

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
                  },
                ],
              })(<Input style={{ width: '100%' }} placeholder="Tên báo cáo" />)}
            </FormItem>
          </Col>
          {/* <Col span={12}>
            <FormItem label="Đợt quan trắc" style={{ width: '100%' }}>
              {form.getFieldDecorator(FIELDS.PHASE, {
                onChange: this.onChangePhase,
              })(<SelectPhase width="100%" />)}
            </FormItem>
          </Col> */}
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
                  },
                ],
              })(
                <SelectStationFixed
                  style={{ width: '100%' }}
                  placeholder="Điểm quan trắc"
                  onFetchSuccess={onFetchPointSuccess}
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
