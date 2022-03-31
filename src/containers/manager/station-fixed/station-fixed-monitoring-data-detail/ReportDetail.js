import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Popover,
  Row,
  Drawer as DrawerAnt,
} from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import StationFixedReportApi from 'api/station-fixed/StationFixedReportApi'
import { Clearfix } from 'components/elements'
import { FormItem } from 'components/layouts/styles'
import ReportLogTable from 'containers/manager/station-fixed/station-fixed-monitoring-data-detail/ReportLogTable'
import { translate as t } from 'hoc/create-lang'
import { get } from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import FormMonitoring from '../station-fixed-monitoring-data/form-create'
import Attachments from './Attachments'
import { EditWrapper } from './components/index'
import ModalConfirmCancel from '../station-fixed-monitoring-data/components/ModalConfirmCancel'

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

const Drawer = styled(DrawerAnt)`
  .ant-drawer-body {
    height: calc(100% - 55px);
    flex-direction: column;
    padding: 0;
  }

  .ant-drawer-title {
    font-size: 16px;
    font-weight: 700;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 0;
    color: #111827;
  }
`

const styleText = {
  color: '#262626',
  fontSize: 14,
  border: '1px solid rgb(217, 217, 217)',
  borderRadius: 4,
}

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
    reportName: '',
    visibleDrawer: false,
    visibleModalConfirmCancel: false,
    logData: {},
    formType: 'editReportLog',
  }

  componentDidMount = async () => {
    const { initialValues } = this.props
    const periodic = await StationFixedPeriodic.getStationFixedPeriodics({}, {})

    this.setState({
      points: periodic.data,
      reportName: initialValues.report.name,
    })
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

  updateReportField = async reportName => {
    const { initialValues } = this.props
    try {
      await StationFixedReportApi.updateReportName(
        initialValues.report._id,
        reportName
      )
      message.success('Cập nhật tên báo cáo thành công!')
      this.setState({ reportName })
      return true
    } catch (error) {
      message.error('Cập nhật tên báo cáo thất bại!')
    }
  }

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

  onCloseDrawer = () => {
    this.setState({ visibleModalConfirmCancel: true })
  }

  handleClickRow = logData => {
    this.setState({
      visibleDrawer: true,
      logData: logData,
      formType: 'editReportLog',
    })
  }

  handleClickAddReportLog = () => {
    this.setState({ formType: 'createReportLog', visibleDrawer: true })
  }

  onConfirmCancel = () => {
    this.setState({
      visibleDrawer: false,
      visibleModalConfirmCancel: false,
    })
  }

  onCancelOut = () => {
    this.setState({ visibleModalConfirmCancel: false })
  }

  setVisibleDrawer = visible => {
    this.setState({
      visibleDrawer: visible,
    })
  }
  render() {
    const { form, initialValues } = this.props
    const {
      points,
      reportName,
      visibleDrawer,
      visibleModalConfirmCancel,
      logData,
      formType,
    } = this.state

    const stationName = this.getPointName(
      points,
      initialValues.report.stationId
    )
    const stationId = initialValues.report.stationId
    const reportId = initialValues.report._id

    return (
      <React.Fragment>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label={t('stationFixedManager.label.point')}>
              {form.getFieldDecorator('POINTS', {
                initialValue: this.getPointName(
                  points,
                  initialValues.report.stationId
                ),
              })(<Input style={{ height: '40px' }} disabled />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={t('stationFixedManager.table.title.reportName')}>
              {form.getFieldDecorator('REPORT', {
                initialValue: initialValues.report.name,
              })(
                <EditWrapper
                  maxLength={64}
                  style={{ ...styleText }}
                  type="input"
                  value={this.getPointName(
                    points,
                    initialValues.report.stationId
                  )}
                  update={() =>
                    this.updateReportField(
                      form.getFieldsValue(['REPORT']).REPORT
                    )
                  }
                  prevValue={reportName}
                ></EditWrapper>
              )}
            </FormItem>
          </Col>
        </Row>
        <Clearfix height={24} />
        {this.operations()}
        <Clearfix height={12} />
        <ReportLogTable
          form={form}
          dataSource={initialValues.logs}
          onClickReportLog={this.handleClickRow}
          onClickAddReportLog={this.handleClickAddReportLog}
        />
        <Clearfix height={16} />
        <Attachments />
        <Drawer
          key={visibleDrawer}
          title={'Chỉnh sửa dữ liệu'}
          visible={visibleDrawer}
          closable
          placement="right"
          onClose={this.onCloseDrawer}
          width={600}
        >
          <FormMonitoring
            setVisibleDrawer={this.setVisibleDrawer}
            type={'manual'}
            formType={formType}
            points={points}
            visibleDrawer={visibleDrawer}
            wrappedComponentRef={this.formRef}
            onResetForm={this.onResetForm}
            basicInfoData={{
              stationName,
              reportName,
              stationId,
              reportId,
              logData,
            }}
          />
          <ModalConfirmCancel
            visible={visibleModalConfirmCancel}
            onConfirmCancel={this.onConfirmCancel}
            onCancelOut={this.onCancelOut}
            closable={false}
          />
        </Drawer>
      </React.Fragment>
    )
  }
}
