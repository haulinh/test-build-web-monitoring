import { Col, DatePicker, Input, Row } from 'antd'
import { FormItem } from 'components/layouts/styles'
import moment from 'moment'
import React, { Component } from 'react'
import { FIELDS, i18n } from '../constants'
import SelectPoint from '../search/SelectPoint'

const locale = {
  lang: {
    now: i18n().drawer.formBasic.datePicker.now,
    timeSelect: i18n().drawer.formBasic.datePicker.selectTime,
    ok: 'OK',
    yearFormat: 'YYYY',
    dateFormat: 'D M YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'D M YYYY HH:mm:ss',
    monthBeforeYear: true,
  },
}
export default class FormInfoBasic extends Component {
  state = {
    stationTypeId: '',
  }

  componentDidMount = () => {
    const { form, formType, basicInfoData } = this.props
    if (formType === 'editReportLog' || formType === 'createReportLog') {
      setTimeout(() => {
        form.setFieldsValue({
          [FIELDS.NAME_REPORT]: basicInfoData.reportName,
          [FIELDS.POINT]: basicInfoData.stationName,
        })
        if (formType === 'editReportLog') {
          form.setFieldsValue({
            [FIELDS.TIME]: moment(basicInfoData.logData.datetime),
          })
        }
      })
    }
  }

  render() {
    const { form, onChangePoint, points, formType } = this.props

    const isDisable =
      formType === 'editReportLog' || formType === 'createReportLog'
        ? true
        : false

    return (
      <div>
        <div className="title">{i18n().drawer.formBasic.title}</div>
        <Row
          gutter={16}
          justify="space-between"
          type="flex"
          style={{ width: '100%' }}
        >
          <Col span={24}>
            <FormItem
              label={i18n().drawer.formBasic.nameReport}
              style={{ width: '100%' }}
            >
              {form.getFieldDecorator(FIELDS.NAME_REPORT, {
                rules: [
                  {
                    required: true,
                    message: i18n().drawer.formBasic.message.nameReport.require,
                  },
                  {
                    max: 64,
                    message: i18n().drawer.formBasic.message.nameReport.max64,
                  },
                  {
                    whitespace: true,
                    message: i18n().drawer.formBasic.message.nameReport.require,
                  },
                ],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder={i18n().drawer.formBasic.nameReport}
                  disabled={isDisable}
                />
              )}
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
            <FormItem
              label={i18n().drawer.formBasic.point}
              style={{ width: '100%' }}
            >
              {form.getFieldDecorator(FIELDS.POINT, {
                onChange: onChangePoint,
                rules: [
                  {
                    required: true,
                    message: i18n().drawer.formBasic.message.point.require,
                  },
                ],
              })(
                <SelectPoint
                  points={points}
                  form={form}
                  mode="default"
                  size="default"
                  label={i18n().drawer.formBasic.point}
                  showSearch
                  disabled={isDisable}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              label={i18n().drawer.formBasic.time}
              style={{ width: '100%' }}
            >
              {form.getFieldDecorator(FIELDS.TIME, {
                rules: [
                  {
                    required: true,
                    message: i18n().drawer.formBasic.message.time,
                  },
                ],
              })(
                <DatePicker
                  locale={locale}
                  style={{ width: '100%' }}
                  showTime
                  placeholder={i18n().drawer.formBasic.selectTime}
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
