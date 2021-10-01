import { Button, message } from 'antd'
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
  NAME: 'name',
  TYPE: 'type',
  ORDER: 'order',
  CATEGORIES: 'categories',
  HIDDEN: 'hidden',
}

const i18n = () => ({
  menu: t('ticket.menu.configProperties'),
  message: {
    success: t('ticket.message.configProperties.success'),
    error: t('ticket.message.configProperties.error')
  }
})

export default class ConfigProperties extends Component {
  state = {
    visible: false,
    configs: [],
    currentActive: {},
  }

  async componentDidMount() {
    const configs = await CalculateApi.getConfigs()
    this.setState({ configs })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
      currentActive: {},
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
    const newConfigs = [...this.state.configs, config]
    this.setState({ configs: newConfigs })
  }

  updateConfig = (id, config) => {
    const { configs } = this.state
    const newConfigs = [...configs]
    const indexUpdate = configs.findIndex((item) => (
      item._id === id
    ))
    newConfigs[indexUpdate] = config
    this.setState({ configs: newConfigs })
  }

  setEdit = (record) => {
    this.setState({ visible: true, currentActive: record })
  }

  handleChangeToggle = async (id, toggle) => {
    try {
      message.success(i18n().message.success)
      await CalculateApi.updateToggel(id, toggle)
    } catch (e) {
      message.error(i18n().message.error)
      console.log(e)
    }
  }
  
  render() {
    const { visible, configs, currentActive } = this.state
    return (
      <PageContainer title={i18n().menu} right={this.renderButtonAdd()}>
        <ConfigForm
          visible={visible}
          onClose={this.onClose}
          addConfig={this.addConfig}
          updateConfig={this.updateConfig}
          currentActive={currentActive}
          showDrawer={this.showDrawer} />
        <Clearfix height={16} />
        <ConfigList
          configs={configs}
          setEdit={this.setEdit}
          handleChangeToggle={this.handleChangeToggle} />
      </PageContainer>
    )
  }
}
