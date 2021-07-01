import React, { Component } from 'react'
import Condition from './Condition'
import GeneralInfo from './GeneralInfo'
import SettingQuery from './SettingQuery'
import { Col, Row } from 'antd'

export default class ConfigTab extends Component {
  render() {
    return (
      <Row style={{ background: 'white' }} gutter={[0, 32]}>
        <Col span={24}>
          <GeneralInfo />
        </Col>
        <Col span={24}>
          <Condition />
        </Col>
        <Col span={24}>
          <SettingQuery />
        </Col>
      </Row>
    )
  }
}
