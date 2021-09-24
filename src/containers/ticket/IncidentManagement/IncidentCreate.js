import { Drawer, Form, Input } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { Fields } from './index'

@Form.create()
export default class IncidentCreate extends Component {
  render() {
    const { onClose, visible, form } = this.props

    return (
      <Drawer
        title="Basic Drawer"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <FormItem label={Fields.name}>
          {form.getFieldDecorator(Fields.name)(<Input />)}
        </FormItem>
      </Drawer>
    )
  }
}
