import { Button, Form, Input, Select, InputNumber, message } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, optionSelectType } from './index'
import { translate as t } from 'hoc/create-lang'
import CalculateApi from 'api/CalculateApi'
import Categories from './Categories'
import { FixedBottom, ILLDrawer } from '../Component'
import { get, isEmpty } from 'lodash-es'

const i18n = () => ({
  drawer: {
    title: {
      add: t('ticket.title.configProperties.drawer.add'),
      edit: t('ticket.title.configProperties.drawer.edit')
    }
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
export default class ConfigForm extends Component {
  state = {
    listCategory: [],
  }

  componentWillReceiveProps(nextProps) {
    const { form, currentActive } = this.props
    if (currentActive !== nextProps.currentActive) {
      const type = get(nextProps, 'currentActive.type', '');
      form.setFieldsValue({
        [FIELDS.TYPE]: type,
        [FIELDS.NAME]: get(nextProps, 'currentActive.name', ''),
        [FIELDS.ORDER]: get(nextProps, 'currentActive.order', ''),
      })

      this.setState(
        { listCategory: get(nextProps, 'currentActive.categories', [])
            .map(item => item.key)},
        () => {
          get(nextProps, 'currentActive.categories', []).map(item => {
            form.setFieldsValue({
              [`categories[${item.key}]`]: item.name
            })
          })
        })
    }
  }

  onCreateCategory = () => {
    const { listCategory } = this.state;
    let newKey = 0;

    if (listCategory.length) {
      newKey = listCategory.push()
    }

    this.setState({ listCategory: [...listCategory, newKey] })
  }

  onDelSubCategory = (idxDelete) => {
    const { listCategory } = this.state;
    const newList = listCategory.filter((_, idx) => idx !== idxDelete)

    this.setState({ listCategory: newList })
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const { form, onClose, currentActive } = this.props;
    const values = await form.validateFields();

    const params = {
      order: values.order ? values.order : undefined,
      name: values.name,
      type: values.type,
      categories: Array.isArray(values.categories) ?
        values.categories.map((item, idx) => ({
          name: item,
          order: idx
        })) : []
    }

    const isEdit = !isEmpty(currentActive)

    if (isEdit) await this.handleEdit(params)
    if (!isEdit) await this.handleCreate(params)

    form.resetFields()
    onClose()
  }

  handleCreate = async (params) => {
    const { form, addConfig } = this.props;
    const result = await CalculateApi.createConfig(params)
    if (!result) {
      message.error(i18n().message.error)
      return;
    }
    message.info(i18n().message.success)
    form.resetFields()
    addConfig(result)
  }

  handleEdit = async (params) => {
    const { updateConfig, currentActive } = this.props;
    try {
      await CalculateApi.updateConfigById(currentActive._id, params)
      message.info(i18n().message.success)
      const newConfig = { ...currentActive, ...params }
      updateConfig(currentActive._id, newConfig)
    } catch (e) {
      message.error(i18n().message.error)
      console.log(e)
    }
  }

  onDelConfig = async (id) => {
    try {
      await CalculateApi.delConfig(id)
      message.info(i18n().message.success)
    } catch (e) {
      message.error(i18n().message.error)
      console.log(e)
    }
  }

  render() {
    const { listCategory } = this.state
    const { onClose, visible, form, currentActive } = this.props
    const isEdit = !isEmpty(currentActive)
    const type = form.getFieldValue(FIELDS.TYPE);

    return (
      <ILLDrawer
        title={isEdit ? i18n().drawer.title.edit : i18n().drawer.title.add}
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <Form
          layout="vertical"
          onSubmit={this.onSubmit}
          style={{ height: '100%', position: 'relative' }}
        >
          <FormItem label={i18n().form.name}>
            {form.getFieldDecorator(FIELDS.NAME, {
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
            {form.getFieldDecorator(FIELDS.TYPE, {
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
                disabled={isEdit}
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
            {form.getFieldDecorator(FIELDS.ORDER, {
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
          {type === 'category' && (
            <Categories
              form={form}
              listCategory={listCategory}
              onCreateCategory={this.onCreateCategory}
              onDelSubCategory={this.onDelSubCategory} />
          )}
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
