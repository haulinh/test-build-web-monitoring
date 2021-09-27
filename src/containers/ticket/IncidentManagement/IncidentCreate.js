import { Drawer, Form, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import SelectIncidentType from 'components/elements/select-data/ticket/SelectTicket'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { Fields, i18n } from './index'

@Form.create()
export default class IncidentCreate extends Component {
  render() {
    const { onClose, visible, form } = this.props

    console.log({ values: form.getFieldsValue() })

    return (
      <Drawer
        title="Basic Drawer"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <FormItem label={i18n().name}>
          {form.getFieldDecorator(Fields.name, { rules: [{ required: true }] })(
            <Input />
          )}
        </FormItem>

        <FormItem label={i18n().incidentType}>
          {form.getFieldDecorator(Fields.incidentType, {
            rules: [{ required: true }],
          })(<SelectIncidentType />)}
        </FormItem>

        <FormItem label={i18n().description}>
          {form.getFieldDecorator(Fields.description)(
            <TextArea style={{ height: '150px' }} />
          )}
        </FormItem>

        <FormItem>
          {form.getFieldDecorator(Fields.stationIds)(<TreeSelectStation />)}
        </FormItem>
      </Drawer>
    )
  }
}
