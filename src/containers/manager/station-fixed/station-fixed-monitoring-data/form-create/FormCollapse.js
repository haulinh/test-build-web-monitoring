import React, { Component } from 'react'
import { Collapse, Row, Col, Input } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { FIELDS } from '../constants'

const { Panel } = Collapse

export default class FormCollapse extends Component {
  render() {
    const { form } = this.props

    return (
      <div>
        <Collapse defaultActiveKey={1} expandIconPosition="right">
          <Panel key={1} header="Thông tin khác">
            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem label="Tên người lấy mẫu" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.SAMPLER)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label="Đặc điểm nơi quan trắc"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(FIELDS.OTHER.MONITORING_PLACE)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label="Yêu cầu đối với việc lấy mẫu"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(FIELDS.OTHER.REQUIREMENTS)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="Phương pháp lấy mẫu" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.METHOD)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label="Hóa chất bảo quản màu"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(FIELDS.OTHER.CHEMICAL)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label="Điều kiện bảo quản mẫu"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(FIELDS.OTHER.CONDITIONS)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem
                  label="Danh sách thiết bị lấy mẫu"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(FIELDS.OTHER.EQUIPMENTLIST)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="Ký hiệu mẫu" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.SYMBOL)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem label="Đặc điểm thời tiết" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.WEATHER)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="Người phân tích" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.ANALYST)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              <Col span={12}>
                <FormItem label="Nơi phân tích" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.PLACE_OF_ANALYSIS)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Ghi chú" style={{ width: '100%' }}>
                  {form.getFieldDecorator(FIELDS.OTHER.NOTES)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>

            {/* <Row
              gutter={16}
              justify="space-between"
              type="flex"
              style={{ width: '100%' }}
            >
              
            </Row> */}
          </Panel>
        </Collapse>

        <Clearfix height={12} />
      </div>
    )
  }
}
