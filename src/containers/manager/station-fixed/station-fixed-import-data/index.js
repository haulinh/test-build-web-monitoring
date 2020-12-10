import React from 'react'
import { Alert, Button, Col, Form, Icon, Row } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import Dragger from 'antd/lib/upload/Dragger'
import { translate as t } from 'hoc/create-lang'

import { importDataStationFixed } from 'api/station-fixed/StationFixedPointApi'
import SelectPhase from './select-phase'

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
    > div {
      margin-top: 20px;
    }
  }
  padding: 40px;
  .ant-upload-list {
    display: none;
  }
  .ant-alert{
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
`

const i18n = {
  headerTitle: 'Nhập dữ liệu điểm quan trắc',
  description:
    'Thêm dữ liệu quan trắc điểm định kỳ bằng cách tải lên file xlsx với những thông tin cần thiết.',
  startUpload: 'Bắt đầu bằng cách lựa chọn đợt nhập liệu',
  phaseLabel: 'Đợt quan trắc',
  stationTypeLabel: 'Loại trạm',
  requirements:
    'Tải lên dữ liệu chứa thông tin các điểm quan trắc theo mẫu bên dưới. Hãy đảm bảo những trường thông tin chính xác tuyệt đối. Dữ liệu đã được tải lên hệ thống sẽ không thể loại bỏ',
  step1: 'Bước 1: Tải file mẫu và điền các trường cần thiết',
  step2: 'Bước 2: Tải lên file đã được điền các trường',
  downloadText: 'Tải về file mẫu',
  uploadText: 'Tải lên file mẫu',
  dragAndDrop: 'Kéo thả file vào đây',
  errorTitle: 'Tải lên thất bại',
  errorMessage: 'Một số dòng dữ liệu bị lỗi. Vui lòng kiểm tra và thử lại',
  successTitle: 'Tải lên thành công',
  successMessage: 'Tải lên thành công 100 dòng dữ liệu.',
  line: 'Dòng',
  duplicateParameter: '2 cột trùng mã thông số',
  duplicateData: 'Dữ liệu trùng',
  invalidDataSheet: 'Dữ liệu sheet không hợp lệ',
  invalidDateTime: 'Ngày giờ không hợp lệ',
  invalidParameter: 'Mã thông số không tồn tại',
  pointKeyNotExisted: 'Mã điểm không tồn tại',
  parameterNotTypeNumber: 'Thông số sai định dạng',
  selectPhaseError: 'Vui lòng chọn đợt quan trắc',
  save: t('global.save'),
}

const FIELDS = {
  FILE: 'file',
  PHASE: 'phase',
  STATION_TYPE_ID: 'stationTypeId',
  PHASE_ID: 'phaseId',
}

const IMPORT_DATA_ERROR = {
  DUPLICATE_PARAMETER: i18n.duplicateParameter,
  DUPLICATE_DATA: i18n.duplicateData,
  INVALID_DATA_SHEET: i18n.invalidDataSheet,
  INVALID_DATE_TIME: i18n.invalidDateTime,
  INVALID_PARAMETER: i18n.invalidParameter,
  POINT_KEY_NOT_EXISTED: i18n.pointKeyNotExisted,
  PARAMETER_NOT_TYPE_NUMBER: i18n.parameterNotTypeNumber,
}

class StationFixedImportData extends React.Component {
  state = {
    isSuccess: false,
    isLoading: false,
    errorDetail: null,
  }

  getErrorDetail = errors => {
    const errorKey = errors[0]
    switch (errorKey) {
      case 'INVALID_PARAMETER':
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

  validatePhase = (_, value, callback) => {
    if (!value) callback(i18n.selectPhaseError)
    else if (value && value.length !== 2) callback(i18n.selectPhaseError)
    callback()
  }

  submitData = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    const phase = values[FIELDS.PHASE]
    const file = values[FIELDS.FILE]

    const formData = new FormData()
    formData.append(FIELDS.FILE, file)
    formData.append(FIELDS.STATION_TYPE_ID, phase[0].value)
    formData.append(FIELDS.PHASE_ID, phase[1].value)

    try {
      this.setState({ isLoading: true })
      const result = await importDataStationFixed(formData)
      if (result.status === 'ok') {
        this.setState({ isLoading: false, isSuccess: true })
        return
      }

      this.setState({ isLoading: false, errorDetail: result, isSuccess: false })
    } catch (error) {
      console.log(error)
    }
  }

  onSubmit = e => {
    e.preventDefault()
    this.submitData()
  }

  render() {
    const { form } = this.props
    const { isLoading, errorDetail, isSuccess } = this.state
    form.getFieldDecorator(FIELDS.FILE)
    const file = form.getFieldValue(FIELDS.FILE) || {}

    return (
      <div>
        <Header>
          <Text fontSize={22} color="#3B3B3B" fontWeight={600}>
            {i18n.headerTitle}
          </Text>
        </Header>
        <Container>
          <Text color="rgba(0, 0, 0, 0.65);">{i18n.description}</Text>
          <Text color="rgba(0, 0, 0, 0.65);" block>
            {i18n.startUpload}
          </Text>

          <Form onSubmit={this.onSubmit}>
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item label={i18n.phaseLabel}>
                  {form.getFieldDecorator(FIELDS.PHASE, {
                    rules: [{ validator: this.validatePhase }],
                  })(<SelectPhase />)}
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
                  {i18n.requirements}
                </Text>
              </Col>
            </Row>
            <Row type="flex" justify="center" gutter={40} className="file">
              <Col span={8}>
                <div className="ant-upload ant-upload-drag">
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
                    description={i18n.successMessage}
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
                  {i18n.save}
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
