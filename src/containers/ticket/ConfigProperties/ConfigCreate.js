import { Button, Col, Drawer, Form, Input, Row, Select } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, optionSelectType } from './index'
import { translate as t } from 'hoc/create-lang'
import CalculateApi from 'api/CalculateApi'
import Categories from './Categories'


const i18n = () => ({
    drawer: {
        title: t('ticket.config.drawer.title')
    },
    form: {
        name: t('ticket.label.configProperties.name'),
        type: t('ticket.label.configProperties.type'),
        button: t('ticket.label.configProperties.button')
    }
})

@Form.create()
export default class ConfigCreate extends Component {

    onSubmit = async (e) => {
        e.preventDefault()
        const { form } = this.props;
        const values = await form.validateFields();
        const result = await CalculateApi.createConfig(values)
        console.log({ result })
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
                    <Categories />
                    <Row justify="end">
                        <Col>
                            <Button type="primary" htmlType="submit">
                                {i18n().form.button}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        )
    }
}
