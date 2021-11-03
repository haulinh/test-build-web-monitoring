import { Col, Row } from 'antd'
import ReportType from 'components/elements/select-data/report/SelectReportType'
import TimeReport from 'components/elements/select-data/report/SelectTimeReport'
import SelectProvince from 'components/elements/select-province'
import SelectStationAuto from 'components/elements/select-station-auto'
import { FormItem } from 'components/layouts/styles'
import React from 'react'
import moment from 'moment'

export default function Filter({ form }) {

  const handleOnChangeReportType = value => {
    form.setFieldsValue({ time: { type: value} })
  }

  const handleOnChangeTime= value => {
  }

  const province = form.getFieldValue('province')

  return (
    <React.Fragment>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label="Loại báo cáo">
            {form.getFieldDecorator('reportType', {
              initialValue: 'day',
              onChange: handleOnChangeReportType,
            })(<ReportType form={form} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="Thời gian">
            {form.getFieldDecorator('time', {
              initialValue: {type: 'day', value: moment()},
              onChange: handleOnChangeTime,
            })(<TimeReport form={form} />)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem label="Đơn vị quản lý">
            {form.getFieldDecorator('province', {
            })(<SelectProvince fieldValue='_id' isShowAll allowClear={false} />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem label="Trạm quan trắc">
          {form.getFieldDecorator('plant', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <SelectStationAuto
                fieldValue="_id"
                province={province}
                mode="tags"
                />
          )}
        </FormItem>
      </Row>
    </React.Fragment>
  )
}
