import { Col, Input, Row, Form, Button, Icon } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import React, { Component } from 'react'
import Breadcrumb from '../../breadcrumb'
import { FIELDS, i18n } from '../constants'
import ImportFile from './ImportFile'
import ModalDownloadFile from './ModalDownloadFile'

@Form.create()
export default class StationFixedImportExcel extends Component {
  state = {
    visibleModalDownload: false,
  }

  onSubmitForm = async () => {
    const { form } = this.props

    const value = form.getFieldsValue()

    const { file, name } = value

    const fileUpload = _.get(file, 'file')

    console.log({ fileUpload })
  }

  onClickDownload = () => {
    this.setState({
      visibleModalDownload: true,
    })
  }

  onCancel = () => {
    this.setState({
      visibleModalDownload: false,
    })
  }

  render() {
    const { form } = this.props
    const { visibleModalDownload } = this.state
    const fileUpload = form.getFieldValue(FIELDS.FILE) || {}

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData', 'importExcel']} />
        <Clearfix height={25} />

        <Row>
          <Col span={12}>
            <FormItem label="Tên báo cáo">
              {form.getFieldDecorator(FIELDS.NAME_REPORT, {
                rules: [
                  {
                    max: 64,
                    message: i18n().drawer.formBasic.message.nameReport.max64,
                  },
                  {
                    whitespace: true,
                    message: i18n().drawer.formBasic.message.nameReport.require,
                  },
                ],
              })(<Input placeholder="Nhập tên cho báo cáo" />)}
            </FormItem>
            <div style={{ color: '#FF821E', fontSize: '12px' }}>
              Ghi chú: Định danh cho tên Báo cáo giúp bạn quản lý dữ liệu dễ
              hơn.
            </div>
          </Col>
        </Row>

        <Row
          type="flex"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            Tải xuống tệp tin mẫu để đưa hàng loạt thông tin dữ liệu lên hệ
            thống.
          </div>
          <Button type="link" onClick={this.onClickDownload}>
            <Row type="flex" align="middle" style={{ gap: '8px' }}>
              Tải xuống tệp mẫu
              <Icon type="download" />
            </Row>
          </Button>
        </Row>

        <FormItem>
          {form.getFieldDecorator(FIELDS.FILE)(
            <ImportFile
              multiple={false}
              beforeUpload={() => false}
              file={fileUpload.file}
            />
          )}
        </FormItem>

        <Row type="flex" align="center" justify="center">
          <Button type="primary" onClick={this.onSubmitForm} htmlType="submit">
            Tải lên
          </Button>
        </Row>

        <Clearfix height={30} />

        <ModalDownloadFile
          visible={visibleModalDownload}
          onCancel={this.onCancel}
        />
      </PageContainer>
    )
  }
}
