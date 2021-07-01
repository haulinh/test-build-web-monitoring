import { Row, Form, Col } from 'antd'
import SelectProvince from 'components/elements/select-province'
import SelectStationType from 'components/elements/select-station-type'
import React from 'react'

import { BoxShadow, Header } from '../styles'
import { i18n } from '../constant'

export default function Condition() {
  return (
    <BoxShadow>
      <Header>{i18n.header.condition}</Header>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label={i18n.label.province}>
            <SelectProvince />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={i18n.label.stationType}>
            <SelectStationType />
          </Form.Item>
        </Col>
      </Row>
    </BoxShadow>
  )
}
