import { Col, Input, Row } from 'antd'
import React, { Component } from 'react'
import SelectProvinceForm from '../station-fixed-monitoring-data/search/SelectProvinceForm'

export default class ReportDetail extends Component {
  render() {
    return (
      <div>
        <Row gutter={12}>
          <Col span={12}>
            <Input value="Trạm Hoàn Kiếm"></Input>
          </Col>
          <Col span={12}>
            <Input value="Báo cáo QTĐK - MP1 261121"></Input>
          </Col>
        </Row>
      </div>
    )
  }
}
