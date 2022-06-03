import { Button, Form, Row } from 'antd'
import { Clearfix } from 'components/elements'
import { Flex } from 'components/layouts/styles'
import React, { Component } from 'react'
import { ConfigChannelTemplate } from './ConfigChannelTemplate'

@Form.create()
export default class ChannelTemplateList extends Component {
  //#region life cycle
  componentDidMount = () => {
    const { config, form } = this.props
    form.setFieldsValue(config)
  }
  //#endregion life cycle

  handleSubmit = () => {
    const { form } = this.props
    const value = form.getFieldsValue()
    console.log({ value })
  }

  render() {
    const { config, form } = this.props
    if (!config) return null

    const channelKeys = Object.keys(config)

    return (
      <Flex flexDirection="column" gap={16}>
        {channelKeys.map(channelKey => (
          <ConfigChannelTemplate channelKey={channelKey} form={form} />
        ))}
        <Clearfix height={44} />
        <Row type="flex" justify="center">
          <Button
            style={{ width: '20%' }}
            onClick={this.handleSubmit}
            type="primary"
            block
          >
            Lưu
          </Button>
        </Row>
      </Flex>
    )
  }
}
