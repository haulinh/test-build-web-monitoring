import { Col, Form, Row, DatePicker } from 'antd'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { Fields } from './index'
import { translate as t } from 'hoc/create-lang'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'

const { RangePicker } = DatePicker

@Form.create()
export default class Filter extends Component {
  render() {
    const { form } = this.props
    const { province } = form.getFieldsValue()

    return (
      <Form>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label={t('menuApp.config.site')}>
              {form.getFieldDecorator(Fields.province, {
                initialValue: '',
              })(<SelectProvince fieldValue="_id" isShowAll />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('menuApp.config.stationAuto')}>
              {form.getFieldDecorator(Fields.stationIds, {
                rules: [{ required: true }],
              })(<TreeSelectStation province={province} fieldValue="_id" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label={t('ticket.label.incident.time')}>
              {form.getFieldDecorator(Fields.time, {
                rules: [{ required: true }],
              })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
