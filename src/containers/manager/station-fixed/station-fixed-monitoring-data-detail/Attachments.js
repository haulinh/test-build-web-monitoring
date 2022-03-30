import { Row } from 'antd'
import React, { Component } from 'react'

export default class Attachments extends Component {
  render() {
    return (
      <div>
        <Row>
          <div style={{ fontWeight: '700', fontSize: '16px' }}>Đính kèm</div>
        </Row>
        <div style={{ height: '182px' }}></div>
      </div>
    )
  }
}
