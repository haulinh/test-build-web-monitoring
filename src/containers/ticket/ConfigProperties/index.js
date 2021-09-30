import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import ConfigForm from './ConfigForm'
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
  order: 'order',
  categories: 'categories',
  hidden: 'hidden',
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
    configs: [],
    currentActive: {}
  }

  async componentDidMount() {
    const configs = await CalculateApi.getConfigs()
    const newConfigs = configs.map(item => ({ ...item, type: obj[item.type] }))
    this.setState({ configs: newConfigs })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
      currentActive: {}
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  renderButtonAdd = () => {
    return (
      <Button onClick={this.showDrawer} type="primary">
        {t('addon.create')}
      </Button>
    )
  }

  addConfig = (config) => {
    const newConfigs = [...this.state.configs, { ...config, type: obj[config.type] }]
    this.setState({ configs: newConfigs })
  }

  updateConfig = (config) => {
    // const newConfigs = [...this.state.configs, { ...config, type: obj[config.type] }]
    // this.setState({ configs: newConfigs })
  }

  setEdit = (record) => {
    this.setState({ visible: true, currentActive: record })
  }

  render() {
    const { visible, configs, currentActive } = this.state
    return (
      <PageContainer title={t('ticket.menu.configProperties')} right={this.renderButtonAdd()}>
        <ConfigForm 
          visible={visible} 
          onClose={this.onClose} 
          addConfig={this.addConfig} 
          updateConfig={this.updateConfig} 
          currentActive={currentActive} 
          showDrawer={this.showDrawer} 
        />
        <Clearfix height={16}></Clearfix>
        <ConfigList configs={configs} setEdit={this.setEdit}></ConfigList>
      </PageContainer>
    )
  }
}
