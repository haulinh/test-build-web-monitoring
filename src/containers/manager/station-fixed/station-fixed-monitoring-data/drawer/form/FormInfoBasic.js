import SelectStationFixed from 'components/elements/select-station-fixed'
import { FormItem } from 'components/layouts/styles'
import SelectPhase from 'containers/manager/station-fixed/station-fixed-import-data/select-phase'
import _ from 'lodash'
import React, { Component } from 'react'
import { FIELDS } from '../../constants'
import { Input } from 'antd'
import { DatePicker } from 'antd'
import moment from 'moment-timezone'

export default class FormInfoBasic extends Component {
  state = {
    stationTypeId: '',
  }

  onChangePhase = phase => {
    const { form } = this.props

    const stationTypeId = _.get(phase, ['0', 'stationTypeId'])

    this.setState({
      stationTypeId,
    })
    form.resetFields([FIELDS.POINT])
  }
  render() {
    const { form, onChangePoint, onFetchPointSuccess } = this.props
    const { stationTypeId } = this.state

    return (
      <div>
        <div className="title">Thông tin cơ bản</div>
        <div className="row-form">
          <FormItem label="Đợt quan trắc" style={{ width: '50%' }}>
            {form.getFieldDecorator(FIELDS.PHASE, {
              onChange: this.onChangePhase,
            })(<SelectPhase width="100%" />)}
          </FormItem>

          <FormItem label="Điểm quan trắc" style={{ width: '50%' }}>
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
                fieldValue="_id"
                stationType={stationTypeId}
                onFetchSuccess={onFetchPointSuccess}
              />
            )}
          </FormItem>
        </div>

        <div className="row-form">
          <FormItem label="Tên báo cáo" style={{ width: '50%' }}>
            {form.getFieldDecorator(FIELDS.NAME_REPORT, {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input style={{ width: '100%' }} placeholder="Tên báo cáo" />)}
          </FormItem>

          <FormItem label="Thời gian" style={{ width: '50%' }}>
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
        </div>
      </div>
    )
  }
}
