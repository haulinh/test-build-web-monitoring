import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import ConfigCreate from './ConfigCreate'
import ConfigList from './ConfigList'
import { Clearfix } from 'components/elements'

export const FIELDS = {
  name: 'name',
  type: 'type',
  categories: 'categories',
  hidden: 'hidden'
}

const initData = [
  {
    "name": "abc",
    "type": "Text",
    "hidden": true
  },
  {
    "name": "ABC",
    "type": "Date Time",
    "hidden": true
  },
  {
    "name": "CDF",
    "type": "Number",
    "hidden": true
  },
  {
    "name": "xyz",
    "type": "Category",
    "hidden": false
  }
]

export default class ConfigProperties extends Component {
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
      <PageContainer title={t('ticket.menu.configProperties')} right={this.ButtonAdd()}>
        <ConfigCreate visible={visible} onClose={this.onClose}/>
        <Clearfix height={16}></Clearfix>
        <ConfigList form={initData}></ConfigList>
      </PageContainer>
    )
  }
}
