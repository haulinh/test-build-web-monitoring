import { Button, Drawer, Form, Input, Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS } from './index'
import { translate as t } from 'hoc/create-lang'

const i18n = () => ({
    drawer: {
        title: t('ticket.config.drawer.title')
    },
    form: {
        name: t('ticket.config.form.name'),
        type: t('ticket.config.form.type'),
        button: t('ticket.config.form.button')
    }
})

const optionSelectType = [
    { key: 'text', label: 'Text' },
    { key: 'category', label: 'Category' },
    { key: 'number', label: 'Number' },
    { key: 'datetime', label: 'Date time' },
]

@Form.create()
export default class ConfigCreate extends Component {

    onSubmit = async (e) => {
        e.preventDefault()
        const { form } = this.props;
        const values = await form.validateFields();
        console.log(values)
    }
    
    render() {
        const { onClose, visible, form } = this.props
        return (
            <Drawer
                title={i18n().form.button}
                closable={false}
                onClose={onClose}
                visible={visible}
                width={400}>
                <Form
                    form={form}
                    layout="vertical"
                    onSubmit={this.onSubmit}
                >
                    <FormItem label={i18n().form.name}>
                        {form.getFieldDecorator(FIELDS.name)(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label={i18n().form.type}>
                        {form.getFieldDecorator(FIELDS.type)(
                            <Select
                                style={{ width: '100%' }}
                            >
                                {optionSelectType.map(item => (
                                    <Select.Option key={item.key} value={item.key}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <Button type="primary" htmlType="submit">
                        {i18n().form.button}
                    </Button>
                </Form>
            </Drawer>
        )
    }
}
