import { Button, Checkbox, Col, Form, Input, Popover, Row } from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import { Clearfix } from 'components/elements'
import { FormItem } from 'components/layouts/styles'
import ReportLogTable from 'containers/manager/station-fixed/station-fixed-monitoring-data-detail/ReportLogTable'
import { translate as t } from 'hoc/create-lang'
import { get } from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import Attachments from './Attachments'

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
      dateTime: t('stationFixedManager.table.title.dateTime'),
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
]

@Form.create()
export default class ReportDetail extends Component {
  state = {
    points: [],
  }

  componentDidMount = async () => {
    const periodic = await StationFixedPeriodic.getStationFixedPeriodics({}, {})

    this.setState({ points: periodic.data })
  }

  operations = () => (
    <Flex>
      <Popover content={this.content()} placement="bottom" trigger="click">
        <CustomButton icon="profile">
          {t('stationFixedManager.button.add')}
        </CustomButton>
      </Popover>
    </Flex>
  )

  getPointName = (points, stationId) => {
    const pointEdit = points.find(point => point._id === stationId)

    return get(pointEdit, 'name', '')
  }

  content = () => {
    const { form } = this.props
    return (
      <Form>
        <OptionalInfoContainer
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {optionalInfo.map(item => (
            <div key={item.field} style={{ marginBottom: '8px' }}>
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
    const { form, initialValues } = this.props
    const { points } = this.state

    return (
      <React.Fragment>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label={t('stationFixedManager.label.point')}>
              {form.getFieldDecorator('POINTS', {
                initialValue: initialValues.report.name,
              })(<Input style={{ height: '40px' }} disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={t('stationFixedManager.table.title.reportName')}>
              {form.getFieldDecorator('REPORT', {
                initialValue: this.getPointName(
                  points,
                  initialValues.report.stationId
                ),
              })(<Input style={{ height: '40px' }}></Input>)}
            </FormItem>
          </Col>
        </Row>
        <Clearfix height={24} />
        {this.operations()}
        <Clearfix height={12} />
        <ReportLogTable form={form} dataSource={initialValues.logs} />
        <Clearfix height={16} />
        <Attachments />
      </React.Fragment>
    )
  }
}
