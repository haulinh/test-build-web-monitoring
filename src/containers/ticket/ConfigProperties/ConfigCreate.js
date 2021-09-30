import { Button, Form, Input, Select, InputNumber, message } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, optionSelectType } from './index'
import { translate as t } from 'hoc/create-lang'
import CalculateApi from 'api/CalculateApi'
import Categories from './Categories'
import { FixedBottom, ILLDrawer } from '../Component'


const i18n = () => ({
    drawer: {
        title: t('ticket.title.configProperties.drawer')
    },
    form: {
        name: t('ticket.label.configProperties.name'),
        type: t('ticket.label.configProperties.type'),
        order: t('ticket.label.configProperties.order'),
        button: t('ticket.label.configProperties.button')
    },
    error: {
        required: t('ticket.required.configProperties.required'),
        isNumber: t('ticket.required.configProperties.isNumber')
    },
    message: {
        success: t('ticket.message.configProperties.success'),
        error: t('ticket.message.configProperties.error')
    }
})

@Form.create()
export default class ConfigCreate extends Component {
    state = {
        optionType: "",
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const { form, addConfig } = this.props;
        const values = await form.validateFields();
        const { order, categories } = values

        if (!order) {
            values.order = undefined
        }

        if (categories) {
            values.categories = categories.map((item, idx) => ({
                name: item,
                order: idx
            }))
        }

        const result = await CalculateApi.createConfig(values)
        if (result) {
            message.info(i18n().message.success)
            form.resetFields()
            addConfig(result)
            this.props.onClose()
        } else {
            message.error(i18n().message.error)
        }
    }

    onHandleChange = (value) => {
        this.setState({ optionType: value })
    }

    render() {
        const { optionType } = this.state
        const { onClose, visible, form } = this.props
        return (
            <ILLDrawer
                title={i18n().drawer.title}
                closable={false}
                onClose={onClose}
                visible={visible}
                width={400}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onSubmit={this.onSubmit}
                    style={{ height: '100%', position: 'relative' }}
                >
                    <FormItem label={i18n().form.name}>
                        {form.getFieldDecorator(FIELDS.name, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n().error.required
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label={i18n().form.type}>
                        {form.getFieldDecorator(FIELDS.type, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n().error.required
                                }
                            ]
                        })(
                            <Select
                                style={{ width: '100%' }}
                                onChange={this.onHandleChange}
                            >
                                {optionSelectType.map(item => (
                                    <Select.Option key={item.key} value={item.key}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={i18n().form.order}>
                        {form.getFieldDecorator(FIELDS.order, {
                            rules: [
                                {
                                    pattern: RegExp('^[0-9]*$'),
                                    message: i18n().error.isNumber
                                }
                            ]
                        })(
                            <InputNumber
                                type="number"
                                style={{ width: '100%' }}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {optionType === 'category' && (
                            <Categories form={form} />
                        )}
                    </FormItem>
                    <FixedBottom>
                        <Button type="primary" htmlType="submit">
                            {i18n().form.button}
                        </Button>
                    </FixedBottom>
                </Form>
            </ILLDrawer>
        )
    }
}
