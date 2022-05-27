import { Button, Col, Drawer, Modal, Row } from 'antd'
import React, { Component } from 'react'

export default class DrawerConfigAlarm extends Component {
  getHeaderDrawer = () => {
    return (
      <Row type="flex" justify="center">
        <Col span={12}>
          <Row justify="center">Cấu hình chi tiết</Row>
        </Col>
        <Col spam={12}>
          <Row type="flex" justify="center" align="">
            <Button type="danger">Cancel</Button>
            <Button type="primary">Accept</Button>
          </Row>
        </Col>
      </Row>
    )
  }
  render() {
    return (
      <Drawer
        visible={true}
        width={448}
        placement="right"
        title={this.getHeaderDrawer()}
        closable
      >
        <div
          style={{
            width: '400px',
            height: '184px',
            border: '2px solid #F3F4F6',
            borderRadius: '8px',
            boxShadow: '0px 0px 4px rgba(24, 144, 255, 0.5)',
          }}
        >
          <span>Trạm</span>
          <span>Nước Lán Tháp</span>
          <span>Loại cảnh báo:</span>
          <span>Quy chuẩn: </span>
        </div>
      </Drawer>
    )
  }
}
