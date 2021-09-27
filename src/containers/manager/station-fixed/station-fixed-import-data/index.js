import React from 'react'
import { Alert, Button, Col, Form, Icon, Row, Spin, Select } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import Dragger from 'antd/lib/upload/Dragger'
import { translate as t } from 'hoc/create-lang'

import {
  importDataStationFixed,
  exportDataTemplate,
  exportSimpleDataTemplate,
  importSimpleDataStationFixed,
} from 'api/station-fixed/StationFixedPointApi'
import SelectPhase from './select-phase'
import SelectMeasuring from './select-measuring'
import Clearfix from 'components/elements/clearfix'
import { downFileExcel } from 'utils/downFile'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'

const Header = styled.div`
  padding: 20px 24px;
  background: #fafbfb;
  box-shadow: inset 0px -1px 0px rgba(182, 182, 182, 0.25);
`

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

function i18n() {
  return {
    headerTitle: t('importDataPoint.headerTitle'),
    description: t('importDataPoint.description'),
    startUpload: t('importDataPoint.startUpload'),
    phaseLabel: t('importDataPoint.phaseLabel'),
    measuringLabel: t('importDataPoint.measuringLabel'),
    measuringRequired: t('importDataPoint.measuringRequired'),
    stationTypeLabel: t('importDataPoint.stationTypeLabel'),
    requirements: t('importDataPoint.requirements'),
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
    complexForm: t('importDataPoint.complexForm'),
    simpleForm: t('importDataPoint.simpleForm'),
    inputForm: t('importDataPoint.inputForm'),
  }
}

const optionExportData = [
  { key: 'simple', label: i18n().simpleForm },
  { key: 'complex', label: i18n().complexForm },
]

const FIELDS = {
  FILE: 'file',
  PHASE: 'phase',
  MEASURING: 'measuring',
  STATION_TYPE_ID: 'stationTypeId',
  PHASE_ID: 'phaseId',
  typeExport: 'typeExport',
}

const IMPORT_DATA_ERROR = {
  DUPLICATE_PARAMETER: i18n().duplicateParameter,
  DUPLICATE_DATA: i18n().duplicateData,
  INVALID_DATA_SHEET: i18n().invalidDataSheet,
  INVALID_DATE_TIME: i18n().invalidDateTime,
  INVALID_PARAMETER: i18n().invalidParameter,
  POINT_KEY_NOT_EXISTED: i18n().pointKeyNotExisted,
  PARAMETER_NOT_TYPE_NUMBER: i18n().parameterNotTypeNumber,
  POINT_KEY_NOT_BELONG_TO_STATION_TYPE: i18n()
    .pointAndPhaseNotBelongToStationType,
}

@protectRole(ROLE.STATION_FIXED_INPUT.VIEW)
class StationFixedImportData extends React.Component {
  state = {
    isSuccess: false,
    isLoading: false,
    isDownloadingFile: false,
    errorDetail: null,
    count: 0,
    typeExport: '',
  }

  getErrorDetail = errors => {
    const errorKey = errors[0]
    switch (errorKey) {
      case 'INVALID_PARAMETER':
        return `${IMPORT_DATA_ERROR[errorKey]} ${errors[1]}`
      case 'DUPLICATE_PARAMETER':
        return `${IMPORT_DATA_ERROR[errorKey]} ${errors[1]}`
      default:
        return IMPORT_DATA_ERROR[errors[0]]
    }
  }

  getErrors() {
    const { errorDetail } = this.state
    return (
      <div>
        {Object.keys(errorDetail).map(
          row =>
            !isEmpty(errorDetail[row]) && (
              <div key={row}>
                {i18n().line} {row}: {this.getErrorDetail(errorDetail[row])}
              </div>
            )
        )}
      </div>
    )
  }

  onChangeFile = async ({ file }) => {
    const { form } = this.props
    form.setFieldsValue({ [FIELDS.FILE]: file })
  }

  validatePhase = (_, value, callback) => {
    if (!value) callback(i18n().selectPhaseError)
    else if (value && value.length !== 2) callback(i18n().selectPhaseError)
    callback()
  }

  submitData = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    const phase = values[FIELDS.PHASE]
    const file = values[FIELDS.FILE]
    const typeImport = values[FIELDS.STATION_TYPE_ID]

    const formData = new FormData()
    formData.append(FIELDS.FILE, file)
    formData.append(FIELDS.STATION_TYPE_ID, phase[0].value)
    formData.append(FIELDS.PHASE_ID, phase[1].value)

    try {
      this.setState({ isLoading: true, errorDetail: null, isSuccess: false })
      let result
      if (typeImport === 'complex') {
        result = await importDataStationFixed(formData)
      } else {
        result = await importSimpleDataStationFixed(formData)
      }

      if (result.success) {
        this.setState({
          isLoading: false,
          errorDetail: null,
          isSuccess: true,
          count: result.count,
        })
        return
      }
      this.setState({ isLoading: false, errorDetail: result, isSuccess: false })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  onDownloadFile = async () => {
    const { form } = this.props
    this.setState({ isDownloadingFile: true })
    const measurings = form.getFieldValue(FIELDS.MEASURING)
    const typeForm = form.getFieldValue(FIELDS.typeExport)
    if (typeForm === 'complex') {
      const result = await exportDataTemplate(measurings)
      downFileExcel(result.data, 'data-template')
    } else {
      const result = await exportSimpleDataTemplate(measurings)
      downFileExcel(result.data, 'simple-data-template')
    }
    this.setState({ isDownloadingFile: false })
  }

  onSubmit = e => {
    e.preventDefault()
    this.submitData()
  }

  render() {
    const { form } = this.props
    const {
      isDownloadingFile,
      isLoading,
      errorDetail,
      isSuccess,
      count,
    } = this.state
    form.getFieldDecorator(FIELDS.FILE)
    const file = form.getFieldValue(FIELDS.FILE) || {}

    const stationTypeId =
      form.getFieldValue(FIELDS.PHASE) &&
      form.getFieldValue(FIELDS.PHASE).length === 2
        ? form.getFieldValue(FIELDS.PHASE)[0].stationTypeId
        : null

    const countMeasuring = form.getFieldValue(FIELDS.MEASURING)
      ? form.getFieldValue(FIELDS.MEASURING).length
      : 0

    return (
      <React.Fragment>
        <Header>
          <Text fontSize={22} color="#3B3B3B" fontWeight={600}>
            {i18n().headerTitle}
          </Text>
        </Header>
        <Container>
          <Text color="rgba(0, 0, 0, 0.65);">{i18n().description}</Text>
          <Text color="rgba(0, 0, 0, 0.65);" block>
            {i18n().startUpload}
          </Text>

          <Form onSubmit={this.onSubmit}>
            <Row gutter={36}>
              <Col span={8}>
                <Form.Item label={i18n().phaseLabel}>
                  {form.getFieldDecorator(FIELDS.PHASE, {
                    rules: [
                      // { required: true, message: i18n().selectPhaseError },
                      { validator: this.validatePhase, required: true },
                    ],
                  })(<SelectPhase />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={i18n().inputForm}>
                  {form.getFieldDecorator(FIELDS.typeExport, {
                    initialValue: 'complex',
                  })(
                    <Select>
                      {optionExportData.map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label={i18n().measuringLabel}>
                  {form.getFieldDecorator(
                    FIELDS.MEASURING,
                    {}
                  )(<SelectMeasuring stationTypeId={stationTypeId} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span={16}>
                <Text
                  fontWeight="normal"
                  textAlign="center"
                  color="rgba(0, 0, 0, 0.65);"
                >
                  {i18n().requirements}
                </Text>
              </Col>
            </Row>
            <Row type="flex" justify="center" gutter={40} className="file">
              <Col span={8} className="download-wrapper">
                {isDownloadingFile && <Spin className="spin" />}
                <div
                  className={`ant-upload ant-upload-drag ${
                    countMeasuring < 1 ? 'disabled-download' : ''
                  }`}
                  onClick={this.onDownloadFile}
                >
                  <Text
                    block
                    className="step ant-upload-text"
                    color="rgba(0, 0, 0, 0.65);"
                    fontWeight="normal"
                  >
                    {i18n().step1}
                  </Text>
                  <Icon type="download"></Icon>
                  <Text block fontSize={20} color="rgba(0, 0, 0, 0.65);">
                    {i18n().downloadText}
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
                    {i18n().step2}
                  </Text>
                  <Icon type="upload"></Icon>
                  <div>
                    <Text block fontSize={20} color="rgba(0, 0, 0, 0.65);">
                      {i18n().uploadText}
                    </Text>
                    <Text block fontWeight="normal">
                      {file.name || i18n().dragAndDrop}
                    </Text>
                  </div>
                </Dragger>
              </Col>
            </Row>
            <Clearfix height={8} />
            <Row type="flex" justify="center">
              {isSuccess && count > 0 && (
                <Col span={16}>
                  <Alert
                    message={i18n().successTitle}
                    description={i18n().successMessage(count)}
                    type="success"
                    showIcon
                  />
                </Col>
              )}
              {isSuccess && count === 0 && (
                <Col span={16}>
                  <Alert
                    message={i18n().errorTitle}
                    description={i18n().errorMessageNoData}
                    type="error"
                    showIcon
                  />
                </Col>
              )}
              {!isEmpty(errorDetail) && (
                <Col span={16}>
                  <Alert
                    message={i18n().errorTitle}
                    description={i18n().errorMessage}
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
                  {i18n().upload}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </React.Fragment>
    )
  }
}

export default Form.create()(StationFixedImportData)
