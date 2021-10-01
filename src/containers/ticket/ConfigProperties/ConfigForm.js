import { Button, Form, Input, Select, InputNumber, message, Row, Col, Icon, Divider } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, optionSelectType } from './index'
import { translate as t } from 'hoc/create-lang'
import CalculateApi from 'api/CalculateApi'
import Categories from './Categories'
import { FixedBottom, ILLDrawer } from '../Component'
import { get, isEmpty } from 'lodash-es'
import styled from 'styled-components'


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
  },
  button: {
    add: t('ticket.label.configProperties.button.add'),
    edit: t('ticket.label.configProperties.button.edit'),
    del: t('ticket.label.configProperties.button.del')
  },
  error: {
    required: t('ticket.required.configProperties.required'),
    isNumber: t('ticket.required.configProperties.isNumber')
  },
  message: {
    success: (text) => text + ' ' + t('ticket.message.configProperties.success'),
    error: t('ticket.message.configProperties.error')
  }
})

const DrawerCustom = styled(ILLDrawer)`
  .ant-drawer-body{
    padding-left: 0;
    padding-right: 0;
  }
`

@Form.create()
export default class ConfigForm extends Component {
  state = {
    listCategory: [],
  }

  componentWillReceiveProps(nextProps) {
    const { form, currentActive } = this.props
    if (currentActive !== nextProps.currentActive) {
      const type = get(nextProps, 'currentActive.type', '');
      const categories = get(nextProps, 'currentActive.categories', []);

      form.setFieldsValue({
        [FIELDS.NAME]: get(nextProps, 'currentActive.name', ''),
        [FIELDS.TYPE]: type,
        [FIELDS.ORDER]: get(nextProps, 'currentActive.order', ''),
      })

      this.setState(
        {
          listCategory: categories
            .map(item => item.key)
        },
        () => {
          categories.map(item => {
            form.setFieldsValue({
              [`categories[${item.key}]`]: item.name
            })
            return []
          })
        }
      )
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
    message.info(i18n().message.success(i18n().button.add))
    form.resetFields()
    addConfig(result)
  }

  handleEdit = async (params) => {
    const { updateConfig, currentActive } = this.props;
    try {
      await CalculateApi.updateConfigById(currentActive._id, params)
      message.info(i18n().message.success(i18n().button.edit))
      const newConfig = { ...currentActive, ...params }
      updateConfig(currentActive._id, newConfig)
    } catch (e) {
      message.error(i18n().message.error)
      console.log(e)
    }
  }

  handleDel = async (param) => {
    const { delConfig, onClose } = this.props;
    try {
      await CalculateApi.delConfig(param._id)
      message.info(i18n().message.success(i18n().button.del))
      delConfig(param)
      onClose()
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
      <DrawerCustom
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <Row type="flex" justify="space-between" style={{ paddingRight: 24, paddingLeft: 24 }}>
          <Col><b> {!isEdit ? i18n().drawer.title.add : i18n().drawer.title.edit} </b></Col>
          <Col>
            {isEdit && (
              <Icon
                onClick={() => this.handleDel(currentActive)}
                type="delete"
                style={{ fontSize: "16px", color: "#F5222D" }} />
            )}
          </Col>
        </Row>
        <Divider style={{ width: "100%" }}></Divider>
        <Form
          layout="vertical"
          onSubmit={this.onSubmit}
          style={{ height: '100%', position: 'relative', paddingLeft: 24, paddingRight: 24 }}
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
            <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
              {!isEdit ? i18n().button.add : i18n().button.edit}
            </Button>
          </FixedBottom>
        </Form>
      </DrawerCustom>
    )
  }
}
