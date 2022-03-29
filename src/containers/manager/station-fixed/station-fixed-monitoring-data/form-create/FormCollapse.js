import React, { Component } from 'react'
import { Collapse, Row, Col, Input } from 'antd'
import { Clearfix, FormItem } from 'components/layouts/styles'
import { FIELDS } from '../constants'
import styled from 'styled-components'

const { Panel } = Collapse

const FormCollapseContainer = styled.div`
  .ant-collapse {
    border: unset;
    background: unset;
  }
  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header {
    padding: 12px 0;
  }
  .ant-collapse-content-box {
    padding: 16px 0;
  }

  .ant-collapse-content,
  .ant-collapse-item {
    border: unset;
  }
`

export default class FormCollapse extends Component {
  render() {
    const { form } = this.props

    return (
      <FormCollapseContainer>
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.SAMPLER}`)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label="Đặc điểm nơi quan trắc"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.MONITORING_PLACE}`
                  )(<Input placeholder="Nhập thông tin" />)}
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
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.REQUIREMENTS}`
                  )(<Input placeholder="Nhập thông tin" />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="Phương pháp lấy mẫu" style={{ width: '100%' }}>
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.METHOD}`)(
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.CHEMICAL}`)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  label="Điều kiện bảo quản mẫu"
                  style={{ width: '100%' }}
                >
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.CONDITIONS}`
                  )(<Input placeholder="Nhập thông tin" />)}
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
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.EQUIPMENTLIST}`
                  )(<Input placeholder="Nhập thông tin" />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="Ký hiệu mẫu" style={{ width: '100%' }}>
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.SYMBOL}`)(
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
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.WEATHER}`)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="Người phân tích" style={{ width: '100%' }}>
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.ANALYST}`)(
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
                  {form.getFieldDecorator(
                    `otherInfo.${FIELDS.OTHER.PLACE_OF_ANALYSIS}`
                  )(<Input placeholder="Nhập thông tin" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Ghi chú" style={{ width: '100%' }}>
                  {form.getFieldDecorator(`otherInfo.${FIELDS.OTHER.NOTES}`)(
                    <Input placeholder="Nhập thông tin" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <Clearfix height={12} />
      </FormCollapseContainer>
    )
  }
}
