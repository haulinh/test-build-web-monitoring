import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import ConfigCreate from './ConfigCreate'
import ConfigList from './ConfigList'
import { Clearfix } from 'components/elements'
import CalculateApi from 'api/CalculateApi'

export const optionSelectType = [
  { key: 'text', label: 'Text' },
  { key: 'category', label: 'Category' },
  { key: 'number', label: 'Number' },
  { key: 'datetime', label: 'Date time' },
]

export const FIELDS = {
  name: 'name',
  type: 'type',
  categories: 'categories',
  hidden: 'hidden'
}

const obj = {
  text: "Text",
  category: "Category",
  number: "Number",
  datetime: "Date time"
}

export default class ConfigProperties extends Component {
  state = {
    visible: false,
    configs: []
  }

  async componentDidMount() {
    const configs = await CalculateApi.getConfig()
    const newConfigs = configs.map(item => ({ ...item, type: obj[item.type] }))
    this.setState({ configs: newConfigs })
  }

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
    const { visible, configs } = this.state
    return (
      <PageContainer title={t('ticket.menu.configProperties')} right={this.ButtonAdd()}>
        <ConfigCreate visible={visible} onClose={this.onClose} />
        <Clearfix height={16}></Clearfix>
        <ConfigList form={configs}></ConfigList>
      </PageContainer>
    )
  }
}
