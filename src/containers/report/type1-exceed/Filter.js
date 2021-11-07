import { Col, Row } from 'antd'
import ReportType from 'components/elements/select-data/report/SelectReportType'
import TimeReport from 'components/elements/select-data/report/SelectTimeReport'
import CheckFilter from 'components/elements/select-data/report/CheckFilter'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import moment from 'moment'
import { FIELDS } from './index'

export default function Filter({ form, resetData = () => {} }) {
  const { reportType } = form.getFieldsValue() || {}

  const handleOnChangeReportType = value => {
    resetData()
    form.setFieldsValue({ [FIELDS.TIME]: { type: value } })
  }

  const handleOnChangeFilter = value => {
    form.setFieldsValue({ isFilter: value })
  }

  const province = form.getFieldValue('province')

  return (
    <React.Fragment>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label="Loại báo cáo">
            {form.getFieldDecorator(FIELDS.REPORT_TYPE, {
              initialValue: 'year',
              onChange: handleOnChangeReportType,
            })(<ReportType form={form} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Thời gian">
            {form.getFieldDecorator(FIELDS.TIME, {
              initialValue: { type: 'year', value: moment().year() },
            })(<TimeReport reportType={reportType} />)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem label="Đơn vị quản lý">
            {form.getFieldDecorator(
              FIELDS.PROVINCE,
              {}
            )(<SelectProvince isShowAll allowClear={false} />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem label="Trạm quan trắc">
          {form.getFieldDecorator(FIELDS.STATION_KEY, {
            rules: [
              {
                required: true,
              },
            ],
          })(<SelectStationAuto province={province} mode="tags" />)}
        </FormItem>
      </Row>
      <Row type="flex" align="middle" justify="end">
        <FormItem style={{ width: '240px' }}>
          {form.getFieldDecorator(FIELDS.IS_FILTER, {
            initialValue: false,
            onChange: handleOnChangeFilter,
          })(<CheckFilter form={form} />)}
        </FormItem>
      </Row>
    </React.Fragment>
  )
}
