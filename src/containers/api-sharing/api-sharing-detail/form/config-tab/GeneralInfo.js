import { Col, Form, Input, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { i18n } from '../constant'

import { Header, BoxShadow } from '../styles'

export default function GeneralInfo({}) {
  return (
    <BoxShadow>
      <Header>{i18n.header.generalInfo}</Header>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label={i18n.label.apiName}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={i18n.label.apiType}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label={i18n.label.description}>
        <TextArea />
      </Form.Item>
    </BoxShadow>
  )
}
