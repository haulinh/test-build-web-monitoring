import React from 'react'
import { Alert, Breadcrumb, Button, Col, Form, Icon, Row, Spin } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import Dragger from 'antd/lib/upload/Dragger'
import { translate as t } from 'hoc/create-lang'

import {
  importMultiPoint,
  exportMonitoringPointTemplate,
} from 'api/station-fixed/StationFixedPointApi'
import { downFileExcel } from 'utils/downFile'
import slug from 'constants/slug'

const Header = styled.div`
  padding: 20px 24px;
  background: #fafbfb;
  box-shadow: inset 0px -1px 0px rgba(182, 182, 182, 0.25);
  .ant-breadcrumb {
    font-size: 20px;
    font-weight: 600;
  }
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
    > div {
      margin-top: 20px;
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
  }
`

const i18n = {
  stationFixedTitle: t('stationFixedPoint.list.title'),
  importPoint: t('stationFixedPoint.importPoint.title'),
  description: t('importDataPoint.description'),
  startUpload: t('importDataPoint.startUpload'),
  phaseLabel: t('importDataPoint.phaseLabel'),
  stationTypeLabel: t('importDataPoint.stationTypeLabel'),
  requirements: t('importDataPoint.requirements'),
  step1: t('importDataPoint.step1'),
  step2: t('importDataPoint.step2'),
  downloadText: t('importDataPoint.downloadText'),
  uploadText: t('importDataPoint.uploadText'),
  dragAndDrop: t('importDataPoint.dragAndDrop'),
  errorTitle: t('importDataPoint.errorTitle'),
  errorMessage: t('importDataPoint.errorMessage'),
  successTitle: t('importDataPoint.successTitle'),
  successMessage: count => t('importDataPoint.successMessage', { count }),
  line: t('importDataPoint.line'),
  upload: t('global.upload'),
  duplicateData: t('stationFixedPoint.importPoint.errors.duplicateData'),
  requireField: t('stationFixedPoint.importPoint.errors.requireField'),
  invalidDataSheet: t('stationFixedPoint.importPoint.errors.invalidDataSheet'),
  invalidName: t('stationFixedPoint.importPoint.errors.invalidName'),
  invalidLatitude: t('stationFixedPoint.importPoint.errors.invalidLatitude'),
  invalidLongitude: t('stationFixedPoint.importPoint.errors.invalidLongitude'),
  invalidAddress: t('stationFixedPoint.importPoint.errors.invalidAddress'),
  qcvnKeyNotExist: t('stationFixedPoint.importPoint.errors.qcvnKeyNotExist'),
  stationTypeKeyNotExist: t(
    'stationFixedPoint.importPoint.errors.stationTypeKeyNotExist'
  ),
  measureKeyNotExist: t(
    'stationFixedPoint.importPoint.errors.measureKeyNotExist'
  ),
  noData: t('stationFixedPoint.importPoint.errors.noData'),
  invalidStationType: t(
    'stationFixedPoint.importPoint.errors.invalidStationType'
  ),
  invalidKey: t('stationFixedPoint.importPoint.errors.invalidKey'),
  duplicateMeasure: t('stationFixedPoint.importPoint.errors.duplicateMeasure'),
  requireOneMeasureParamerter: t(
    'stationFixedPoint.importPoint.errors.requireOneMeasureParamerter'
  ),
  requiredField: {
    key: t('stationFixedPoint.importPoint.requiredField.key'),
    name: t('stationFixedPoint.importPoint.requiredField.name'),
    stationTypeKey: t(
      'stationFixedPoint.importPoint.requiredField.stationType'
    ),
    lat: t('stationFixedPoint.importPoint.requiredField.lat'),
    lng: t('stationFixedPoint.importPoint.requiredField.lng'),
  },
}

const FIELDS = { FILE: 'file' }

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
}

class StationFixedImportData extends React.Component {
  state = {
    isSuccess: false,
    isLoading: false,
    isDownloadingFile: false,
    errorDetail: null,
    count: 0,
  }

  getErrorDetail = errors => {
    const match = errors[0].match(/(?<key>.*)?\s(?<params>.*)/)
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

  onChangeFile = async ({ file }) => {
    const { form } = this.props
    form.setFieldsValue({ [FIELDS.FILE]: file })
  }

  submitData = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    const file = values[FIELDS.FILE]

    const formData = new FormData()
    formData.append(FIELDS.FILE, file)

    try {
      this.setState({ isLoading: true, errorDetail: null, isSuccess: false })
      const result = await importMultiPoint(formData)
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
      this.setState({ isLoading: false })
    }
  }

  onDownloadFile = async () => {
    this.setState({ isDownloadingFile: true })
    const result = await exportMonitoringPointTemplate()
    downFileExcel(result.data, 'point-template')
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

    return (
      <div>
        <Header>
          <Breadcrumb separator=">">
            <Breadcrumb.Item href={slug.stationFixed.base}>
              {i18n.stationFixedTitle}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{i18n.importPoint}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
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
            <Row type="flex" justify="center" gutter={40} className="file">
              <Col span={8} className="download-wrapper">
                {isDownloadingFile && <Spin className="spin" />}
                <div
                  className="ant-upload ant-upload-drag"
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
                  disabled={isEmpty(file)}
                  loading={isLoading}
                >
                  {i18n.upload}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}

export default Form.create()(StationFixedImportData)
