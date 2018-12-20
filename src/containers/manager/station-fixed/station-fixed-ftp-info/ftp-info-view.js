import React from 'react'
import { Card, Icon } from 'antd'
import { translate } from 'hoc/create-lang'

export default class FtpInfoView extends React.Component {
  handleEdit = e => {
    e.preventDefault()
    if (this.props.onEdit) {
      this.props.onEdit(e)
    }
  }
  render() {
    return (
      <Card style={{ marginBottom: 8 }}>
        <Row
          label={translate('stationAutoManager.ftpFile.addressLabel')}
          value={this.props.address}
          underline
        >
          <div onClick={this.handleEdit}>
            <Icon style={{ paddingLeft: 8, color: 'blue' }} type="edit" />{' '}
          </div>
        </Row>
        <Row
          label={translate('stationAutoManager.ftpFile.usernameLabel')}
          value={this.props.username}
        />
        <Row
          label={translate('stationAutoManager.ftpFile.passwordLabel')}
          value={this.props.password}
        />
      </Card>
    )
  }
}

const Row = ({ label, value, underline, children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ minWidth: 120 }}>
        <strong>{label}</strong>
      </div>
      <div style={{ paddingLeft: 8, color: 'blue' }}>
        <span style={{ textDecoration: underline ? 'underline' : 'none' }}>
          {value}
        </span>
      </div>
      {children}
    </div>
  )
}
