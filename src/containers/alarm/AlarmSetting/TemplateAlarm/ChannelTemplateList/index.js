import { Button, Form, message, Row } from 'antd'
import { updateAlarmConfig } from 'api/CategoryApi'
import { Clearfix } from 'components/elements'
import { Flex } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import update from 'immutability-helper'
import React, { Component } from 'react'
import { i18n } from '../../constants'
import ChannelTemplate from './ChannelTemplate'

@Form.create()
export default class ChannelTemplateList extends Component {
  state = {
    loadingSubmit: false,
  }

  //#region life cycle
  componentDidMount = () => {
    const { configType, form } = this.props
    form.setFieldsValue(configType)
  }
  //#endregion life cycle

  handleSubmit = async () => {
    const { form, setConfig, config, configTypeKey } = this.props
    const value = form.getFieldsValue()

    const newConfig = update(config, {
      [configTypeKey]: {
        channels: {
          $set: value,
        },
      },
    })

    setConfig(newConfig)
    this.setState({ loadingSubmit: true })

    const response = await updateAlarmConfig(newConfig)
    if (response.success) {
      this.setState({ loadingSubmit: false })
      message.success(translate('global.saveSuccess'))
      return
    }

    this.setState({ loadingSubmit: false })
  }

  render() {
    const { configType, form } = this.props
    const { loadingSubmit } = this.state

    const channelKeys = Object.keys(configType)

    return (
      <Flex flexDirection="column" gap={16}>
        {channelKeys.map(channelKey => (
          <ChannelTemplate
            key={channelKey}
            channelKey={channelKey}
            form={form}
          />
        ))}
        <Clearfix height={44} />
        <Row type="flex" justify="center">
          <Button
            style={{ width: '20%' }}
            onClick={this.handleSubmit}
            type="primary"
            block
            loading={loadingSubmit}
          >
            {i18n().button.save}
          </Button>
        </Row>
      </Flex>
    )
  }
}

ChannelTemplateList.defaultProps = {
  configType: {},
  setConfig: () => {},
}
