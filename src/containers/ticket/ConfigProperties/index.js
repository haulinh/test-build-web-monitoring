import { Button, message } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import ConfigForm from './ConfigForm'
import ConfigList from './ConfigList'
import { Clearfix } from 'components/elements'
import CalculateApi from 'api/CalculateApi'
import createBreadcrumb from 'shared/breadcrumb/hoc'

const Breadcrumb = createBreadcrumb()

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
  switch: {
    hide: t('ticket.label.configProperties.switch.hide'),
    show: t('ticket.label.configProperties.switch.show')
  },
  message: {
    success: (text) => text + ' ' + t('ticket.message.configProperties.success'),
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
    const { configs } = this.state
    const newConfigs = [...configs, config]
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

  delConfig = (config) => {
    const { configs } = this.state
    const newConfigs = configs.filter(item => item._id !== config._id)
    this.setState({ configs: newConfigs })
  }

  setEdit = (record) => {
    this.setState({ visible: true, currentActive: record })
  }

  handleChangeToggle = async (id, toggle) => {
    try {
      await CalculateApi.updateToggel(id, !toggle)
      if (toggle) {
        message.success(i18n().message.success(i18n().switch.show))
        return
      }
      message.success(i18n().message.success(i18n().switch.hide))
    } catch (e) {
      message.error(i18n().message.error)
      console.log(e)
    }
  }

  render() {
    const { visible, configs, currentActive } = this.state
    return (
      <PageContainer right={this.renderButtonAdd()}>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n().menu,
            },
          ]}
        />
        <ConfigForm
          visible={visible}
          onClose={this.onClose}
          addConfig={this.addConfig}
          updateConfig={this.updateConfig}
          delConfig={this.delConfig}
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
