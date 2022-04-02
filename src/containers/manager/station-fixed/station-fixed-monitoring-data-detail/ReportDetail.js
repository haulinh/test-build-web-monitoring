import {
  Button,
  Checkbox,
  Col,
  Drawer as DrawerAnt,
  Form,
  Input,
  message,
  Popover,
  Row,
} from 'antd'
import StationFixedPeriodic from 'api/station-fixed/StationFixedPeriodic'
import StationFixedReportApi from 'api/station-fixed/StationFixedReportApi'
import { Clearfix } from 'components/elements'
import { FormItem } from 'components/layouts/styles'
import ReportLogTable from 'containers/manager/station-fixed/station-fixed-monitoring-data-detail/ReportLogTable'
import { translate as t } from 'hoc/create-lang'
import { get } from 'lodash'
import moment from 'moment-timezone'
import React, { Component } from 'react'
import styled from 'styled-components'
import { getTimeUTC } from 'utils/datetime'
import ModalConfirmCancel from '../station-fixed-monitoring-data/components/ModalConfirmCancel'
import FormMonitoring from '../station-fixed-monitoring-data/form-create'
import Attachments from './Attachments'
import { EditWrapper } from './components/index'

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
    drawer: {
      title: {
        edit: t('stationFixedMonitoring.drawer.title.edit'),
        create: t('stationFixedMonitoring.drawer.title.create'),
      },
    },
    updateReportName: {
      success: t('stationFixedMonitoring.updateReportName.success'),
      error: t('stationFixedMonitoring.updateReportName.error'),
    },
    addButton: t('dataPointReport.button.add'),
    exportExcelButton: t('dataPointReport.button.exportExcel'),
    dataTab: t('dataPointReport.tab.data'),
    numberOrder: t('dataPointReport.title.numberOrder'),
    message: {
      nameReport: {
        require: t(
          'stationFixedMonitoring.drawer.formBasic.message.nameReport.require'
        ),
        max64: t(
          'stationFixedMonitoring.drawer.formBasic.message.nameReport.max64'
        ),
      },
      point: {
        require: t(
          'stationFixedMonitoring.drawer.formBasic.message.point.require'
        ),
      },
      time: t('stationFixedMonitoring.drawer.formBasic.message.time'),
    },
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
    dataSourceLog: [],
    loading: false,
  }

  componentDidMount = async () => {
    const { initialValues, loading } = this.props
    const periodic = await StationFixedPeriodic.getStationFixedPeriodics({}, {})

    this.setState({
      points: periodic.data,
      reportName: initialValues.report.name,
      dataSourceLog: initialValues.logs,
      loading,
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
    const { initialValues, form } = this.props
    try {
      await StationFixedReportApi.updateReportName(
        initialValues.report._id,
        reportName.trim()
      )
      form.setFieldsValue({ REPORT: reportName.trim() })
      message.success(i18n().updateReportName.success)
      this.setState({ reportName: reportName.trim() })
      return true
    } catch (error) {
      message.error(i18n().updateReportName.error)
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
    this.setState({
      formType: 'createReportLog',
      visibleDrawer: true,
    })
  }

  onConfirmCancel = () => {
    this.setState({
      visibleDrawer: false,
      visibleModalConfirmCancel: false,
      loading: true,
    })

    setTimeout(() => {
      this.setState({ loading: false })
    }, 400)
  }

  onCancelOut = () => {
    this.setState({ visibleModalConfirmCancel: false })
  }

  setVisibleDrawer = visible => {
    this.setState({ visibleDrawer: visible })
  }

  setDataSourceLog = async (logEdited, loading) => {
    const { initialValues } = this.props
    const { dataSourceLog, formType } = this.state

    logEdited.datetime = getTimeUTC(moment(logEdited.datetime))

    const newMeasuringLog = Object.values(
      get(logEdited, 'measuringLogs', {})
    ).map(measuring => {
      return {
        key: measuring.key,
        value: measuring.value,
        textValue: measuring.value,
      }
    })

    logEdited.measuringLogs = newMeasuringLog.reduce((base, current) => {
      return { ...base, [current.key]: current }
    }, {})

    if (formType === 'editReportLog') {
      const newDataSourceLog = dataSourceLog.map(log => {
        if (log._id === logEdited._id) return logEdited
        return log
      })
      this.setState({ dataSourceLog: newDataSourceLog, loading })
      return
    }
    const newReportData = await StationFixedReportApi.getStationFixedReport(
      initialValues.report._id
    )

    this.setState({ dataSourceLog: newReportData.logs, loading })
  }

  deleteLogData = dataSourceAfterDelete => {
    this.setState({ dataSourceLog: dataSourceAfterDelete })
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
      dataSourceLog,
      loading,
    } = this.state

    const stationName = this.getPointName(
      points,
      initialValues.report.stationId
    )
    const stationId = initialValues ? initialValues.report.stationId : ''
    const reportId = initialValues ? initialValues.report._id : ''

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
                rules: [
                  {
                    required: true,
                    message: i18n().message.nameReport.require,
                  },
                  {
                    max: 64,
                    message: i18n().message.nameReport.max64,
                  },
                  {
                    whitespace: true,
                    message: i18n().message.nameReport.require,
                  },
                ],
              })(
                <EditWrapper
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
          dataSource={dataSourceLog}
          onClickReportLog={this.handleClickRow}
          onClickAddReportLog={this.handleClickAddReportLog}
          handleDeleteLog={this.deleteLogData}
          loading={loading}
        />
        <Clearfix height={16} />
        <Attachments />
        <Drawer
          key={visibleDrawer}
          title={
            formType === 'editReportLog'
              ? i18n().drawer.title.edit
              : i18n().drawer.title.create
          }
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
            handleSuccessEditLog={this.setDataSourceLog}
            handleSuccessCreateLog={this.setDataSourceLog}
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
