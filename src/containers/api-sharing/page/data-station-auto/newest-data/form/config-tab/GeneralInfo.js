import { Col, Form, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { i18n } from 'containers/api-sharing/constants'
import React from 'react'

import { Header, BoxShadow } from '../styles'

export default function GeneralInfo({ form }) {
  return (
    <BoxShadow>
      <Header>{i18n.detailPage.header.generalInfo}</Header>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label={i18n.detailPage.label.apiName}>
            {form.getFieldDecorator('name')(<Input />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={i18n.detailPage.label.apiType}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label={i18n.detailPage.label.description}>
        {form.getFieldDecorator('description')(<TextArea />)}
      </Form.Item>
    </BoxShadow>
  )
}
