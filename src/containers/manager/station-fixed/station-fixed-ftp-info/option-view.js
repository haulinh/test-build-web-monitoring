import React from 'react'
import { Card, Button } from 'antd'
import { translate } from 'hoc/create-lang'

export default class FtpInfoView extends React.Component {
  handleEdit = e => {
    e.preventDefault()
    if (this.props.onEdit) {
      this.props.onEdit(e)
    }
  }

  handleAuto = e => {
    e.preventDefault()
    this.props.onClick(true)
  }

  handleManual = e => {
    e.preventDefault()
    this.props.onClick(false)
  }

  render() {
    return (
      <Card
        style={{ marginBottom: 8 }}
        title={translate('stationAutoManager.ftpFile.titleConfigFTP')}
      >
        <Button
          type="primary"
          onClick={this.handleAuto}
          style={{ marginRight: 16 }}
        >
          {translate('stationAutoManager.ftpFile.auto')}
        </Button>
        <Button type="primary" onClick={this.handleManual}>
          {translate('stationAutoManager.ftpFile.choosePath')}
        </Button>
      </Card>
    )
  }
}
