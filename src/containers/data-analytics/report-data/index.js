import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Options from './options-chart'
import SelectQCVN from 'components/elements/select-qcvn-v2'

const i18n = {
  standard: 'Qui chuẩn',
}

class ReportData extends Component {
  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Options />
          </Col>
          <Col span={14}>
            <Row type="flex" align="middle">
              <Col span={3}>{i18n.standard}</Col>
              <Col span={21}>
                <SelectQCVN mode="multiple" />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ReportData
