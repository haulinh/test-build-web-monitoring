import { Row } from 'antd'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'

export default class Attachments extends Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <div style={{ fontWeight: '700', fontSize: '16px' }}>
            {t('stationFixedManager.label.attachment')}
          </div>
        </Row>
        <div style={{ height: '182px' }}></div>
      </React.Fragment>
    )
  }
}
