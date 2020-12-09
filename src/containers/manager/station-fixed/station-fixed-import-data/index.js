import { Alert, Col, Form, Icon, Row, Select } from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import { importDataStationFixed } from 'api/station-fixed/StationFixedPointApi'
import { isEmpty } from 'lodash'
import React from 'react'
import styled from 'styled-components'

const { Option } = Select

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
  padding: 40px;
  .file {
    margin-top: 20px;
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
  line: 'Dòng',
  duplicateParameter: '2 cột trùng mã thông số',
  duplicateData: 'Dữ liệu trùng',
  invalidDataSheet: 'Dữ liệu sheet không hợp lệ',
  invalidDateTime: 'Ngày giờ không hợp lệ',
  invalidParameter: 'Mã thông số không tồn tại',
  pointKeyNotExisted: 'Mã điểm không tồn tại',
}

const FIELDS = {
  FILE: 'file',
  PHASE_ID: 'phaseId',
  STATION_TYPE_ID: 'stationTypeId',
}

const IMPORT_DATA_ERROR = {
  DUPLICATE_PARAMETER: i18n.duplicateParameter,
  DUPLICATE_DATA: i18n.duplicateData,
  INVALID_DATA_SHEET: i18n.invalidDataSheet,
  INVALID_DATE_TIME: i18n.invalidDateTime,
  INVALID_PARAMETER: i18n.invalidParameter,
  POINT_KEY_NOT_EXISTED: i18n.pointKeyNotExisted,
}

class StationFixedImportData extends React.Component {
  state = { isSuccess: false, isLoading: false, errorDetail: null }

  getErrorDetail = (errors) => {
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
    const error = 'error'
    return (
      <div>
        {Object.keys(errorDetail).map(row => (
          <div key={row}>
            {i18n.line} {row}: {this.getErrorDetail(errorDetail[row])}
          </div>
        ))}
      </div>
    )
  }

  onChangeFile = async ({ file }) => {
    const { form } = this.props
    const values = await form.validateFields()
    const formData = new FormData()
    formData.append(FIELDS.FILE, file)
    formData.append(FIELDS.PHASE_ID, values[FIELDS.PHASE_ID])
    formData.append(FIELDS.STATION_TYPE_ID, values[FIELDS.STATION_TYPE_ID])

    try {
      this.setState({ isLoading: true })
      const result = await importDataStationFixed(formData)
      if (result.status === 'ok') {
        this.setState({ isLoading: false, isSuccess: true })
        return
      }

      this.setState({ isLoading: false, errorDetail: result })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { form } = this.props
    const { errorDetail, isSuccess } = this.state

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

          <Form>
            <Row gutter={20}>
              <Col span={6}>
                <Form.Item label={i18n.phaseLabel}>
                  {form.getFieldDecorator(FIELDS.PHASE_ID)(
                    <Select>
                      <Option value="1">Đợt 1</Option>
                      <Option value="2">Đợt 2</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={i18n.stationTypeLabel}>
                  {form.getFieldDecorator(FIELDS.STATION_TYPE_ID)(
                    <Select>
                      <Option value="3">Không khí</Option>
                      <Option value="4">Mặt nước</Option>
                    </Select>
                  )}
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
                      {i18n.dragAndDrop}
                    </Text>
                  </div>
                </Dragger>
              </Col>
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
          </Form>
        </Container>
      </div>
    )
  }
}

export default Form.create()(StationFixedImportData)
