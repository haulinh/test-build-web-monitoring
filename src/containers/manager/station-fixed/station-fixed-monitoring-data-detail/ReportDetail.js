import { Button, Checkbox, Col, Form, Input, Popover, Row, Tabs } from 'antd'
import React, { Component } from 'react'
import SelectProvinceForm from '../station-fixed-monitoring-data/search/SelectProvinceForm'
import styled from 'styled-components'
import { Clearfix } from 'components/elements'
import ReportTable from 'containers/manager/station-fixed/station-fixed-monitoring-data-detail/ReportTable'
import { FormItem } from 'components/layouts/styles'
import Attachments from './Attachments'
import { translate as t } from 'hoc/create-lang'

const { TabPane } = Tabs

const Flex = styled.div`
  display: flex;
  justify-content: flex-end;
`

const OptionalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: inherit;
  }
`

const CustomButton = styled(Button)`
  background-color: #e1edfb;
  color: #1890ff;
  font-weight: 500;
  font-size: 16px;
  border-color: transparent;
  height: 40px;
`

export function i18n() {
  return {
    receivedAt: t('dataPointReport.title.receivedAt'),
    phaseName: t('dataPointReport.title.phaseName'),
    pointName: t('dataPointReport.title.pointName'),
    qcvn: {
      isApplying: t('qcvn.form.expired.isApplying'),
      invalid: t('qcvn.invalid'),
    },
    optionalInfo: {
      year: t('dataPointReport.optionalInfo.year'),
      month: t('dataPointReport.optionalInfo.month'),
      symbol: t('dataPointReport.optionalInfo.symbol'),
      weather: t('dataPointReport.optionalInfo.weather'),
      sampler: t('dataPointReport.optionalInfo.sampler'),
      notes: t('dataPointReport.optionalInfo.notes'),
      monitoringPlace: t('dataPointReport.optionalInfo.monitoringPlace'),
      requirements: t('dataPointReport.optionalInfo.requirements'),
      method: t('dataPointReport.optionalInfo.method'),
      chemical: t('dataPointReport.optionalInfo.chemical'),
      conditions: t('dataPointReport.optionalInfo.conditions'),
      equipmentlist: t('dataPointReport.optionalInfo.equipmentlist'),
      analyst: t('dataPointReport.optionalInfo.analyst'),
      placeOfAnalysis: t('dataPointReport.optionalInfo.placeOfAnalysis'),
      createdAt: t('dataPointReport.optionalInfo.createdAt'),
    },
    addButton: t('dataPointReport.button.add'),
    exportExcelButton: t('dataPointReport.button.exportExcel'),
    dataTab: t('dataPointReport.tab.data'),
    numberOrder: t('dataPointReport.title.numberOrder'),
  }
}

const optionalInfo = [
  // { field: 'year', checked: false },
  // { field: 'month', checked: false },
  { field: 'monitoringPlace', checked: false },
  { field: 'requirements', checked: false },
  { field: 'method', checked: false },
  { field: 'chemical', checked: false },
  { field: 'conditions', checked: false },
  { field: 'equipmentlist', checked: false },
  { field: 'symbol', checked: false },
  { field: 'weather', checked: false },
  { field: 'analyst', checked: false },
  { field: 'placeOfAnalysis', checked: false },
  // { field: 'createdAt', checked: false },
]

@Form.create()
export default class ReportDetail extends Component {
  operations = () => (
    <Flex>
      <Popover content={this.content()} placement="bottom" trigger="click">
        <CustomButton icon="profile">Thêm thông tin</CustomButton>
      </Popover>
    </Flex>
  )

  content = () => {
    const { form } = this.props
    return (
      <Form>
        <OptionalInfoContainer
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {optionalInfo.map(item => (
            <div key={item.key} style={{ marginBottom: '8px' }}>
              {form.getFieldDecorator(item.field)(
                <Checkbox>{i18n().optionalInfo[item.field]}</Checkbox>
              )}
            </div>
          ))}
        </OptionalInfoContainer>
      </Form>
    )
  }
  render() {
    const { form } = this.props
    return (
      <div>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label="Điểm quan trắc">
              {form.getFieldDecorator('POINTS', {
                initialValue: 'Trạm Hoàn Kiếm',
              })(<Input style={{ height: '40px' }} disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Tên báo cáo">
              {form.getFieldDecorator('REPORT', {
                initialValue: 'Báo cáo QTĐK - MP1 261121',
              })(<Input style={{ height: '40px' }}></Input>)}
            </FormItem>
          </Col>
        </Row>
        <Clearfix height={24} />
        {this.operations()}
        <Clearfix height={12} />
        <ReportTable form={form} />
        <Clearfix height={16} />
        <Attachments />
      </div>
    )
  }
}
