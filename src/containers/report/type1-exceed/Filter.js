import { Col, Row, Switch } from 'antd'
import ReportType from 'components/elements/select-data/report/SelectReportType'
import TimeReport from 'components/elements/select-data/report/SelectTimeReport'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectProvince from 'components/elements/select-province'
import { FormItem } from 'components/layouts/styles'
import { ToolTip } from 'containers/search/common/tooltip'
import { translate as t } from 'hoc/create-lang'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { FIELDS, i18n } from './index'

const ColSwitch = styled(Col)`
  .ant-form-item .ant-switch {
    margin: 20px 0 4px;
  }
`

export default function Filter({ form, resetData = () => {} }) {
  const { reportType } = form.getFieldsValue() || {}

  const handleOnChangeReportType = type => {
    resetData()
    form.resetFields()
    const time = form.getFieldValue(FIELDS.TIME)
    form.setFieldsValue({ [FIELDS.TIME]: { ...time, type } })
  }

  const handleOnChangeFilter = value => {
    form.setFieldsValue({ isFilter: value })
  }

  const province = form.getFieldValue('province')

  return (
    <React.Fragment>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label={i18n().reportType.label}>
            {form.getFieldDecorator(FIELDS.REPORT_TYPE, {
              initialValue: 'date',
              onChange: handleOnChangeReportType,
            })(<ReportType form={form} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={i18n().time.label}>
            {form.getFieldDecorator(FIELDS.TIME, {
              initialValue: { type: 'date', value: moment() },
              rules: [
                {
                  required: true,
                  message: i18n().time.required,
                },
              ],
            })(<TimeReport reportType={reportType} />)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem label={i18n().province.label}>
            {form.getFieldDecorator(FIELDS.PROVINCE, {
              initialValue: '',
              onChange: val => {
                form.setFieldsValue({ stationKeys: null })
              },
            })(<SelectProvince isShowAll allowClear={false} />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem label={i18n().station.label}>
          {form.getFieldDecorator(FIELDS.STATION_KEY, {
            rules: [
              {
                required: true,
                message: i18n().station.required,
              },
            ],
          })(<TreeSelectStation province={province} />)}
        </FormItem>
      </Row>
      <Row type="flex" justify="end">
        <Col>
          <Row type="flex" align="middle">
            <Col>
              <ToolTip />
            </Col>
            <Col>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {t('report.qaqc.approveData')}
              </div>
            </Col>
            <ColSwitch>
              <div style={{ marginLeft: '10px' }}>
                <FormItem>
                  {form.getFieldDecorator('isFilter', {
                    initialValue: false,
                    onChange: handleOnChangeFilter,
                    valuePropName: 'checked',
                  })(<Switch form={form} />)}
                </FormItem>
              </div>
            </ColSwitch>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  )
}
