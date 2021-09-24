import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import IncidentCreate from './IncidentCreate'

export const Fields = {
  name: 'name',
  incidentType: 'incidentType',
  description: 'description',
}

export default class IncidentManagement extends Component {
  state = { visible: false }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  ButtonAdd = () => {
    return (
      <Button onClick={this.showDrawer} type="primary">
        {t('addon.create')}
      </Button>
    )
  }

  render() {
    const { visible } = this.state
    return (
      <PageContainer right={this.ButtonAdd()}>
        <IncidentCreate visible={visible} onClose={this.onClose} />
      </PageContainer>
    )
  }
}
