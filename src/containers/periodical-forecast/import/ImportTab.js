import React from 'react'
import { Row, Col, Icon, Form, Button, Alert, Spin, Modal } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'
import Clearfix from 'components/elements/clearfix'
import { isEmpty } from 'lodash-es'
import { downFileExcel } from 'utils/downFile'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'

const i18n = {
  headerTitle: t('importDataPoint.headerTitle'),
  description: t('importDataPoint.description'),
  startUpload: t('importDataPoint.startUpload'),
  phaseLabel: t('importDataPoint.phaseLabel'),
  measuringLabel: t('importDataPoint.measuringLabel'),
  measuringRequired: t('importDataPoint.measuringRequired'),
  stationTypeLabel: t('importDataPoint.stationTypeLabel'),
  requirements: (
    <p>
      {t('importDataPoint.requirements1')}{' '}
      <b>{t('importDataPoint.requirements2')}</b>
    </p>
  ),
  step1: t('importDataPoint.step1'),
  step2: t('importDataPoint.step2'),
  downloadText: t('importDataPoint.downloadText'),
  uploadText: t('importDataPoint.uploadText'),
  dragAndDrop: t('importDataPoint.dragAndDrop'),
  errorTitle: t('importDataPoint.errorTitle'),
  errorMessage: t('importDataPoint.errorMessage'),
  errorMessageNoData: t('importDataPoint.errorMessageNoData'),
  successTitle: t('importDataPoint.successTitle'),
  successMessage: count => t('importDataPoint.successMessage', { count }),
  line: t('importDataPoint.line'),
  duplicateParameter: t('importDataPoint.duplicateParameter'),
  duplicateData: t('importDataPoint.duplicateData'),
  invalidDataSheet: t('importDataPoint.invalidDataSheet'),
  invalidDateTime: t('importDataPoint.invalidDateTime'),
  invalidParameter: t('importDataPoint.invalidParameter'),
  pointKeyNotExisted: t('importDataPoint.pointKeyNotExisted'),
  parameterNotTypeNumber: t('importDataPoint.parameterNotTypeNumber'),
  pointAndPhaseNotBelongToStationType: t(
    'importDataPoint.pointAndPhaseNotBelongToStationType'
  ),
  selectPhaseError: t('importDataPoint.selectPhaseError'),
  upload: t('global.upload'),
  stationKeyNotExist: t('importDataForecast.stationKeyNotExist'),
  emptyFile: t('importDataForecast.emptyFile'),
  alarmLevelIinvalid: t('importDataForecast.alarmLevelIinvalid'),
  alarmLevelIIinvalid: t('importDataForecast.alarmLevelIIinvalid'),
  alarmLevelIIIinvalid: t('importDataForecast.alarmLevelIIIinvalid'),
  dateInvalid: t('importDataForecast.dateInvalid'),
  hourInvalid: t('importDataForecast.hourInvalid'),
  measureValueInvalid: t('importDataForecast.measureValueInvalid'),
  dataTypeInvalid: t('importDataForecast.dataTypeInvalid'),
  dataSourceInvalid: t('importDataForecast.dataSourceInvalid'),
  broadcastDateInvalid: t('importDataForecast.broadcastDateInvalid'),
  broadcastTimeInvalid: t('importDataForecast.broadcastTimeInvalid'),
  realDataInvalid: t('importDataForecast.realDataInvalid'),
  invalidDayDataNumber: t('importDataForecast.invalidDayDataNumber'),
  forecastDataInvalid: t('importDataForecast.forecastDataInvalid'),
  titleConfirm: t('importDataForecast.titleConfirm'),
  confirm: (
    <p>
      {' '}
      {t('importDataForecast.confirm1')}{' '}
      <b>{t('importDataForecast.confirm2')}</b>{' '}
      {t('importDataForecast.confirm3')}
    </p>
  ),
  cancel: t('global.cancel'),
}

const FIELDS = {
  FILE: 'file',
}

const IMPORT_DATA_ERROR = {
  DUPLICATE_DATA: i18n.duplicateData,
  REQUIRE_FIELD: i18n.requireField,
  INVALID_DATA_SHEET: i18n.invalidDataSheet,
  INVALID_NAME: i18n.invalidName,
  INVALID_LATITUDE: i18n.invalidLatitude,
  INVALID_LONGITUDE: i18n.invalidLongitude,
  INVALID_ADDRESS: i18n.invalidAddress,
  QCVN_KEY_NOT_EXIST: i18n.qcvnKeyNotExist,
  STATION_TYPE_KEY_NOT_EXIST: i18n.stationTypeKeyNotExist,
  MEASURE_KEY_NOT_EXIST: i18n.measureKeyNotExist,
  NO_DATA: i18n.noData,
  INVALID_STATION_TYPE: i18n.invalidStationType,
  INVALID_KEY: i18n.invalidKey,
  DUPLICATE_MEASURE: i18n.duplicateMeasure,
  REQUIRE_ONE_MEASURE_PARAMERTER: i18n.requireOneMeasureParamerter,

  STATION_KEY_NOT_EXIST: i18n.stationKeyNotExist,
  EMPTY_FILE: i18n.emptyFile,
  ALARM_LEVEL_I_INVALID: i18n.alarmLevelIinvalid,
  ALARM_LEVEL_II_INVALID: i18n.alarmLevelIIinvalid,
  ALARM_LEVEL_III_INVALID: i18n.alarmLevelIIIinvalid,
  DATE_INVALID: i18n.dateInvalid,
  HOUR_INVALID: i18n.hourInvalid,
  MEASURE_VALUE_INVALID: i18n.measureValueInvalid,
  DATA_TYPE_INVALID: i18n.dataTypeInvalid,
  DATA_SOURCE_INVALID: i18n.dataSourceInvalid,
  BROADCAST_TIME_INVALID: i18n.broadcastTimeInvalid,
  BROADCAST_DATE_INVALID: i18n.broadcastDateInvalid,
  REAL_DATA_INVALID: i18n.realDataInvalid,
  INVALID_DAY_DATA_NUMBER: i18n.invalidDayDataNumber,
  FORECAST_DATA_INVALID: i18n.forecastDataInvalid,
}

const Text = styled.div`
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || '600'};
  color: ${props => props.color || '#000'};
  display: ${props => props.block || 'inline-block'};
  text-align: ${props => props.textAlign || 'normal'};
`

const Container = styled.div`
  .ant-form {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
  padding: 40px;
  .ant-upload-list {
    display: none;
  }
  .ant-alert {
    margin-bottom: 20px;
  }
  .ant-upload {
    .anticon {
      font-size: 35px;
      color: rgba(0, 0, 0, 0.45);
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    flex-direction: column;
    .ant-upload {
      padding: 0;
    }
  }
  .download-wrapper {
    position: relative;
    .spin {
      z-index: 1;
      position: absolute;
      top: 42%;
      left: 46%;
    }

    .disabled-download {
      pointer-events: none;
      opacity: 0.4;
    }
  }
`

@Form.create()
export default class ImportTab extends React.Component {
  state = {
    isSuccess: false,
    isLoading: false,
    isDownloadingFile: false,
    errorDetail: null,
    count: 0,
    isModalVisible: false,
  }

  onDownloadFile = async () => {
    this.setState({ isDownloadingFile: true })
    const result = await PeriodicForecastApi.exportDataTemplate()
    downFileExcel(result.data, 'data-template')
    this.setState({ isDownloadingFile: false })
  }

  onChangeFile = async ({ file }) => {
    const { form } = this.props
    form.setFieldsValue({ [FIELDS.FILE]: file })
  }

  getErrorDetail = errors => {
    const match = errors[0].match(/(?<key>\w*)?\s(?<params>.*)/)
    const key = match ? match.groups.key : errors[0]
    const params = match ? match.groups.params : ''

    let additionalInfo = params
    switch (true) {
      case /REQUIRE_FIELD/.test(key):
        additionalInfo = params
          .trim()
          .split(',')
          .map(field => i18n.requiredField[field])
          .join(', ')
        break
      default:
        break
    }
    return [IMPORT_DATA_ERROR[key], additionalInfo]
      .filter(item => item)
      .join(': ')
  }

  getErrors() {
    const { errorDetail } = this.state
    if (errorDetail.error)
      return <div>{IMPORT_DATA_ERROR[errorDetail.error]}</div>

    if (errorDetail.general) {
      return <div>{IMPORT_DATA_ERROR[errorDetail.general[0]]}</div>
    }

    return (
      <div>
        {Object.keys(errorDetail).map(
          row =>
            !isEmpty(errorDetail[row]) && (
              <div key={row}>
                {i18n.line} {row}: {this.getErrorDetail(errorDetail[row])}
              </div>
            )
        )}
      </div>
    )
  }

  submitData = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    const file = values[FIELDS.FILE]

    const formData = new FormData()
    formData.append(FIELDS.FILE, file)

    try {
      this.setState({ isLoading: true, errorDetail: null, isSuccess: false })
      const result = await PeriodicForecastApi.importStation(formData)
      if (result.count) {
        this.setState({
          isLoading: false,
          errorDetail: null,
          isSuccess: true,
          count: result.count,
        })
        return
      }

      this.setState({
        isLoading: false,
        errorDetail: result.errors,
        isSuccess: false,
      })
    } catch (error) {
      this.setState({ isLoading: false })
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    const file = form.getFieldValue(FIELDS.FILE)
    if (file) this.showModal()
  }

  showModal = () => {
    this.setState({ isModalVisible: true })
  }

  handleOk = () => {
    this.submitData()
    this.setState({ isModalVisible: false })
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false })
  }

  render() {
    const { form } = this.props
    form.getFieldDecorator(FIELDS.FILE)
    const file = form.getFieldValue(FIELDS.FILE) || {}

    const {
      isDownloadingFile,
      isLoading,
      errorDetail,
      isSuccess,
      count,
      isModalVisible,
    } = this.state

    return (
      <Container>
        <Form onSubmit={this.onSubmit}>
          <Row type="flex" justify="center">
            <Col span={16}>
              <Text
                fontWeight="normal"
                textAlign="center"
                color="rgba(0, 0, 0, 0.65);"
              >
                {i18n.requirements}
              </Text>
            </Col>
          </Row>

          <Clearfix height={8} />

          <Row type="flex" justify="center" gutter={40} className="file">
            <Col span={8} className="download-wrapper">
              {isDownloadingFile && <Spin className="spin" />}
              <div
                className={`ant-upload ant-upload-drag`}
                onClick={this.onDownloadFile}
              >
                <Text
                  block
                  className="step ant-upload-text"
                  color="rgba(0, 0, 0, 0.65);"
                  fontWeight="normal"
                >
                  {i18n.step1}
                </Text>
                <Icon type="download"></Icon>
                <Text block fontSize={20} color="rgba(0, 0, 0, 0.65);">
                  {i18n.downloadText}
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <Dragger
                beforeUpload={() => false}
                onChange={this.onChangeFile}
                accept=".xlsx"
              >
                <Text
                  block
                  className="step ant-upload-text"
                  color="rgba(0, 0, 0, 0.65);"
                  fontWeight="normal"
                >
                  {i18n.step2}
                </Text>
                <Icon type="upload"></Icon>
                <div>
                  <Text block fontSize={20} color="rgba(0, 0, 0, 0.65);">
                    {i18n.uploadText}
                  </Text>
                  <Text block fontWeight="normal">
                    {file.name || i18n.dragAndDrop}
                  </Text>
                </div>
              </Dragger>
            </Col>
          </Row>

          <Clearfix height={8} />

          <Row type="flex" justify="center">
            {isSuccess && (
              <Col span={16}>
                <Alert
                  message={i18n.successTitle}
                  description={i18n.successMessage(count)}
                  type="success"
                  showIcon
                />
              </Col>
            )}
            {!isEmpty(errorDetail) && (
              <Col span={16}>
                <Alert
                  message={i18n.errorTitle}
                  description={i18n.errorMessage}
                  type="error"
                  showIcon
                />
                <Alert description={this.getErrors()} type="error" />
              </Col>
            )}
          </Row>

          <Row type="flex" justify="center">
            <Col span={3}>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                {i18n.upload}
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText={i18n.cancel}
          okText={i18n.upload}
        >
          <b style={{ fontSize: '16px' }}>{i18n.titleConfirm}</b>
          <Clearfix height={12} />
          {i18n.confirm}
        </Modal>
      </Container>
    )
  }
}
