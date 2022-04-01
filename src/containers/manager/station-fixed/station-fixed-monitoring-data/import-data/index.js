import { Alert, Button, Col, Form, Icon, Input, Radio, Row } from 'antd'
import StationFixedPeriodic, {
  importDataExcelMonitoring,
  importDataExcelMonitoringSimple,
} from 'api/station-fixed/StationFixedPeriodic'
import { Clearfix, FormItem } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import Breadcrumb from '../../breadcrumb'
import { FIELDS, i18n, REPORT_TYPE } from '../constants'
import ImportFile from './ImportFile'
import ModalDownloadFile from './ModalDownloadFile'
import styled from 'styled-components'

const IMPORT_DATA_ERROR = {
  DUPLICATE_PARAMETER: i18n().errorUploadFile.duplicateParameter,
  DUPLICATE_DATA: i18n().errorUploadFile.duplicateData,
  INVALID_DATA_SHEET: i18n().errorUploadFile.invalidDataSheet,
  INVALID_DATE_TIME: i18n().errorUploadFile.invalidDateTime,
  INVALID_PARAMETER: i18n().errorUploadFile.invalidParameter,
  POINT_KEY_NOT_EXISTED: i18n().errorUploadFile.pointKeyNotExisted,
  PARAMETER_NOT_TYPE_NUMBER: i18n().errorUploadFile.parameterNotTypeNumber,
  POINT_KEY_NOT_BELONG_TO_STATION_TYPE: i18n().errorUploadFile
    .pointAndPhaseNotBelongToStationType,
  FILE_EMPTY: i18n().importExcel.notificationUpload.empty.desc,
  POINT_KEY_REQUIRED: i18n().errorUploadFile.pointKeyRequired,
  DATETIME_REQUIRED: i18n().errorUploadFile.dateTimeRequired,
}

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
}

const ImportFileWrapper = styled.div`
  min-height: 100vh;
`

@Form.create()
export default class StationFixedImportExcel extends Component {
  state = {
    visibleModalDownload: false,
    hasFile: false,
    isImportSuccess: false,
    errorDetail: null,
    count: null,
    points: [],
  }

  getErrorDetail = errors => {
    if (errors === 'Invalid Operation, no operations specified') {
      return IMPORT_DATA_ERROR.FILE_EMPTY
    }
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
                {i18n().errorUploadFile.line} {row}:{' '}
                {this.getErrorDetail(errorDetail[row])}
              </div>
            )
        )}
      </div>
    )
  }
  componentDidMount = async () => {
    try {
      const stationFixed = await StationFixedPeriodic.getStationFixedPeriodics(
        {},
        {}
      )

      const stationFixedActive = stationFixed.data.filter(point => point.active)

      this.setState({ points: stationFixedActive })
    } catch (error) {
      console.error({ error })
    }
  }

  onSubmitForm = async () => {
    const params = this.getParams()

    if (!params) return

    const formData = new FormData()
    formData.append(FIELDS.FILE, params.file)
    if (params.nameReport) {
      const nameReport = params.nameReport.trim()
      formData.append(FIELDS.NAME_REPORT, nameReport)
    }

    try {
      let response
      if (params.typeReport === REPORT_TYPE.DETAIL) {
        response = await importDataExcelMonitoring(formData)
      } else if (params.typeReport === REPORT_TYPE.SIMPLE) {
        response = await importDataExcelMonitoringSimple(formData)
      }

      if (response.success) {
        this.setState({
          isImportSuccess: true,
          errorDetail: null,
          count: response.count,
        })
      } else {
        this.setState({
          errorDetail: response,
          isImportSuccess: false,
          count: null,
        })
      }
    } catch (error) {
      console.error({ error })
    }
  }

  getParams = () => {
    const { form } = this.props
    const value = form.getFieldsValue()

    const file = value[FIELDS.FILE]

    if (!file) {
      this.setState({ hasFile: true })
      return
    }

    const nameReport = value[FIELDS.NAME_REPORT]

    const typeReport = value[FIELDS.TYPE_REPORT]

    const params = {
      nameReport: nameReport,
      file: file.file,
      typeReport,
    }

    return params
  }

  onClickDownload = () => {
    this.setState({
      visibleModalDownload: true,
    })
  }

  onCancel = () => {
    this.setState({ visibleModalDownload: false })
  }

  onChangeUploadFile = ({ file }) => {
    const { form } = this.props

    this.setState({
      hasFile: false,
    })

    form.setFieldsValue({ [FIELDS.FILE]: file })
  }

  render() {
    const { form } = this.props
    const {
      visibleModalDownload,
      hasFile,
      errorDetail,
      points,
      isImportSuccess,
      count,
    } = this.state
    const fileUpload = form.getFieldValue(FIELDS.FILE) || {}

    return (
      <PageContainer>
        <ImportFileWrapper>
          <Breadcrumb items={['monitoringData', 'importExcel']} />
          <Clearfix height={25} />

          <Row>
            <Col span={12}>
              <FormItem label={i18n().importExcel.nameReport}>
                {form.getFieldDecorator(FIELDS.NAME_REPORT, {
                  rules: [
                    {
                      max: 64,
                      message: i18n().drawer.formBasic.message.nameReport.max64,
                    },
                    {
                      whitespace: true,
                      message: i18n().drawer.formBasic.message.nameReport
                        .require,
                    },
                  ],
                })(<Input placeholder={i18n().importExcel.placeholder} />)}
              </FormItem>
              <div style={{ color: '#FF821E', fontSize: '12px' }}>
                {i18n().importExcel.note}
              </div>
            </Col>
          </Row>

          <Clearfix height={16} />

          <Row
            type="flex"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div>{i18n().importExcel.desc}</div>
            <Button type="link" onClick={this.onClickDownload}>
              <Row type="flex" align="middle" style={{ gap: '8px' }}>
                {i18n().downloadExcel.downloadFile}
                <Icon type="download" />
              </Row>
            </Button>
          </Row>

          <FormItem>
            {form.getFieldDecorator(FIELDS.FILE, {
              onChange: this.onChangeUploadFile,
            })(
              <ImportFile
                multiple={false}
                beforeUpload={() => false}
                file={fileUpload.file}
              />
            )}
          </FormItem>

          <Row type="flex" justify="center">
            <Form.Item
              label={i18n().downloadExcel.modal.typeReport.title}
              {...formItemLayout}
              style={{ marginBottom: 0 }}
            >
              {form.getFieldDecorator(FIELDS.TYPE_REPORT, {
                initialValue: REPORT_TYPE.DETAIL,
                valuePropsName: 'checked',
              })(
                <Radio.Group>
                  <Row type="flex" justify="space-between" gutter={10}>
                    <Col span={12}>
                      <Radio value={REPORT_TYPE.DETAIL}>
                        {i18n().downloadExcel.modal.typeReport.detailTitle}
                      </Radio>
                    </Col>

                    <Col span={12}>
                      <Radio value={REPORT_TYPE.SIMPLE}>
                        {i18n().downloadExcel.modal.typeReport.simpleTitle}
                      </Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              )}
            </Form.Item>
          </Row>

          <Clearfix height={10} />

          <Row type="flex" align="center" justify="center">
            <Button
              type="primary"
              onClick={this.onSubmitForm}
              htmlType="submit"
            >
              {i18n().button.upload}
            </Button>
          </Row>

          <Clearfix height={30} />

          {hasFile && (
            <Row justify="center" type="flex">
              <Col span={12}>
                <Alert
                  message={i18n().importExcel.notificationUpload.notFile.title}
                  type="error"
                  showIcon
                  description={
                    i18n().importExcel.notificationUpload.notFile.desc
                  }
                />
              </Col>
            </Row>
          )}

          {!isEmpty(errorDetail) && (
            <Row>
              <Row justify="center" type="flex">
                <Col span={12}>
                  <Alert
                    message={
                      i18n().importExcel.notificationUpload.uploadError.title
                    }
                    description={
                      i18n().importExcel.notificationUpload.uploadError.desc
                    }
                    type="error"
                    showIcon
                  />
                </Col>
              </Row>
              <Clearfix height={12} />
              <Row justify="center" type="flex">
                <Col span={12}>
                  <Alert type="error" description={this.getErrors()} />
                </Col>
              </Row>
            </Row>
          )}

          {isImportSuccess && count > 0 && (
            <Row justify="center" type="flex">
              <Col span={12}>
                <Alert
                  message={i18n().importExcel.notificationUpload.success.title}
                  description={`${
                    i18n().importExcel.notificationUpload.success.desc
                  }${count}${
                    i18n().importExcel.notificationUpload.success.desc2
                  }`}
                  type="success"
                  showIcon
                />
              </Col>
            </Row>
          )}

          <Clearfix height={30} />

          <ModalDownloadFile
            points={points}
            key={visibleModalDownload}
            visible={visibleModalDownload}
            onCancel={this.onCancel}
            setVisibleModal={visible =>
              this.setState({
                visibleModalDownload: visible,
              })
            }
          />
        </ImportFileWrapper>
      </PageContainer>
    )
  }
}
