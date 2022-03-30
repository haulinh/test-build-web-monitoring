import { Col, Input, Row, Form, Button } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import Breadcrumb from '../../breadcrumb'
import { FIELDS, i18n } from '../constants'
import ImportFile from './ImportFile'

@Form.create()
export default class StationFixedImportExcel extends Component {
  onChangeUpload = status => {
    console.log({ status })
  }

  onSubmitForm = value => {
    console.log({ value })
  }
  render() {
    const { form } = this.props

    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData', 'importExcel']} />
        <Clearfix height={25} />

        <Row>
          <Col span={12}>
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
            })(
              <Row type="flex" style={{ gap: '5px' }}>
                <div>Tên báo cáo</div>
                <Input placeholder="Nhập tên cho báo cáo" />
                <div style={{ color: '#FF821E', fontSize: '12px' }}>
                  Ghi chú: Định danh cho tên Báo cáo giúp bạn quản lý dữ liệu dễ
                  hơn.
                </div>
              </Row>
            )}
          </Col>
        </Row>
        <ImportFile onChangeUpload={this.onChangeUpload} />

        <Row type="flex" align="center" justify="center">
          <Button type="primary" onClick={this.onSubmitForm} htmlType="submit">
            Tải lên
          </Button>
        </Row>

        <Clearfix height={30} />
      </PageContainer>
    )
  }
}
