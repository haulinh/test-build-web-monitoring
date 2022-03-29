import React, { Component } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../../breadcrumb'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { Col, Input, Row } from 'antd'
import ImportFile from './ImportFile'

export default class StationFixedImportExcel extends Component {
  onChangeUpload = status => {
    console.log({ status })
  }
  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['monitoringData', 'importExcel']} />
        <Clearfix height={25} />

        <Row>
          <Col span={12}>
            <Row type="flex" style={{ gap: '5px' }}>
              <div>Tên báo cáo</div>
              <Input placeholder="Nhập tên cho báo cáo" />
              <div style={{ color: '#FF821E', fontSize: '12px' }}>
                Ghi chú: Định danh cho tên Báo cáo giúp bạn quản lý dữ liệu dễ
                hơn.
              </div>
            </Row>
          </Col>
        </Row>
        <ImportFile onChangeUpload={this.onChangeUpload} />
      </PageContainer>
    )
  }
}
