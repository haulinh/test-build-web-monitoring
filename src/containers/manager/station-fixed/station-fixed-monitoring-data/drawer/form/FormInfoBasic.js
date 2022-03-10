import SelectStationFixed from 'components/elements/select-station-fixed'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS } from '../../constants'
import SelectPhase from '../select/SelectPhase'

export default class FormInfoBasic extends Component {
  render() {
    const { form, phases } = this.props

    return (
      <div>
        <div className="title">Thông tin cơ bản</div>
        <div className="row-form">
          <FormItem label="Đợt quan trắc" style={{ width: '50%' }}>
            {form.getFieldDecorator('anc', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<SelectPhase phases={phases} />)}
          </FormItem>

          <FormItem label="Điểm quan trắc" style={{ width: '50%' }}>
            {form.getFieldDecorator(FIELDS.PHASE, {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <SelectStationFixed
                style={{ width: '100%' }}
                placeholder="Điểm quan trắc"
              />
            )}
          </FormItem>
        </div>

        <div className="row-form">
          <FormItem label="Đợt quan trắc" style={{ width: '50%' }}>
            {form.getFieldDecorator(FIELDS.PHASE, {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <SelectPhase
                style={{ width: '100%' }}
                placeholder="Điểm quan trắc"
              />
            )}
          </FormItem>

          <FormItem label="Đợt quan trắc" style={{ width: '50%' }}>
            {form.getFieldDecorator(FIELDS.PHASE, {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <SelectPhase
                style={{ width: '100%' }}
                placeholder="Điểm quan trắc"
              />
            )}
          </FormItem>
        </div>
      </div>
    )
  }
}
