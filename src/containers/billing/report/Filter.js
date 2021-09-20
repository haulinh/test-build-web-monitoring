import { Col, Row } from 'antd'
import SelectConfig from 'components/elements/select-data/billing/SelectConfig'
import SelectReportType from 'components/elements/select-data/billing/SelectReportType'
import SelectTimeReport from 'components/elements/select-data/billing/SelectTimeReport'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import { Fields, i18n } from './index'

export default function Filter({ form }) {
  const { stationType, reportType } = form.getFieldsValue() || {}

  return (
    <React.Fragment>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label={i18n().reportType.label}>
            {form.getFieldDecorator(Fields.reportType, {
              initialValue: 'month',
            })(<SelectReportType form={form} />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label={i18n().time.label}>
            {form.getFieldDecorator(Fields.time, {
              initialValue: { type: 'month' },
              rules: [
                {
                  required: true,
                },
              ],
            })(<SelectTimeReport reportType={reportType} />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label={i18n().stationType.label}>
            {form.getFieldDecorator(Fields.stationType, {
              rules: [
                {
                  required: true,
                },
              ],
            })(<SelectStationType />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label={i18n().stationName.label}>
            {form.getFieldDecorator(Fields.stationKey, {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <SelectStationAuto
                stationType={stationType}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label={i18n().billingConfig.label}>
            {form.getFieldDecorator(Fields.billingConfigId, {
              rules: [
                {
                  required: true,
                },
              ],
            })(<SelectConfig />)}
          </FormItem>
        </Col>
      </Row>
    </React.Fragment>
  )
}
