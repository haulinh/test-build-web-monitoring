import {
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Row,
  Col,
  Icon,
  Divider,
  Modal,
} from 'antd'
import { FormItem, Flex } from 'components/layouts/styles'
import React, { Component } from 'react'
import { FIELDS, optionSelectType } from './index'
import { translate as t } from 'hoc/create-lang'
import CalculateApi from 'api/CalculateApi'
import Categories from './Categories'
import { ILLDrawer } from '../Component'
import { get, isEmpty } from 'lodash-es'
import styled from 'styled-components'
import { rgb } from 'color'
import uuid from 'uuid'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const i18n = () => ({
  drawer: {
    title: {
      add: t('ticket.title.configProperties.drawer.add'),
      edit: t('ticket.title.configProperties.drawer.edit'),
    },
  },
  form: {
    label: {
      name: t('ticket.label.configProperties.name'),
      type: t('ticket.label.configProperties.type'),
      order: t('ticket.label.configProperties.order'),
    },
    placeholder: {
      name: t('ticket.placeholder.configProperties.name'),
      type: t('ticket.placeholder.configProperties.type'),
      order: t('ticket.placeholder.configProperties.order'),
    },
  },
  button: {
    add: t('ticket.button.configProperties.add'),
    edit: t('ticket.button.configProperties.edit'),
    del: t('ticket.button.configProperties.del'),
  },
  error: {
    required: t('ticket.required.configProperties.required'),
    isNumber: t('ticket.required.configProperties.isNumber'),
    max32: t('rules.max32'),
  },
  message: {
    success: text => text + ' ' + t('ticket.message.configProperties.success'),
    error: t('ticket.message.configProperties.error'),
  },
})

const DrawerCustom = styled(ILLDrawer)`
  .ant-drawer-body {
    padding-left: 0;
    padding-right: 0;
  }
`
@Form.create()
export default class ConfigForm extends Component {
  state = {
    isModalVisible: false,
    categories: [],
  }

  componentWillReceiveProps(nextProps) {
    const { form, currentActive } = this.props
    if (currentActive !== nextProps.currentActive) {
      const type = get(nextProps, 'currentActive.type', '')
      const categories = get(nextProps, 'currentActive.categories', [])

      form.setFieldsValue({
        [FIELDS.NAME]: get(nextProps, 'currentActive.name', ''),
        [FIELDS.TYPE]: type,
        [FIELDS.ORDER]: get(nextProps, 'currentActive.order', ''),
      })

      this.setState({ categories })
    }
  }

  clearFields = () => {
    const { form } = this.props
    form.resetFields()
  }

  onCreateCategory = () => {
    const { categories } = this.state
    let newKey = uuid()

    this.setState({ categories: [...categories, { key: newKey }] })
  }

  onDelSubCategory = key => {
    const { categories } = this.state
    const newList = categories.filter(item => item.key !== key)

    this.setState({ categories: newList })
  }

  onSubmit = async e => {
    e.preventDefault()
    const { form, onClose, currentActive } = this.props
    const values = await form.validateFields()
    const { name, order, type, categories = [] } = values

    const newCategories = Array.isArray(categories)
      ? categories
      : Object.keys(categories).map(key => ({ key, name: categories[key] }))

    const params = {
      order: order ? order : undefined,
      name: name.trim(),
      type,
      categories: newCategories.filter(Boolean).map((item, idx) => ({
        name: item.name,
        key: item.key,
        order: idx,
      })),
    }
    const isEdit = !isEmpty(currentActive)

    if (isEdit) await this.handleEdit(params)
    if (!isEdit) await this.handleCreate(params)

    form.resetFields()
    onClose()
  }

  handleOnChangeType = () => {
    this.setState({ categories: [] })
  }

  handleCreate = async params => {
    const { addConfig } = this.props
    const result = await CalculateApi.createConfig(params)
    if (!result) {
      message.error(i18n().message.error)
      return
    }
    message.info(i18n().message.success(i18n().button.add))

    this.clearFields()
    addConfig(result)
  }

  handleEdit = async params => {
    const { updateConfig, currentActive } = this.props
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

  handleDel = async param => {
    const { delConfig, onClose } = this.props
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

  handleOnClose = async () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const isValue = Object.values(values).some(value => value)
    const { isSubmitted } = this.state
    if (isSubmitted || !isValue) {
      this.props.onClose()
      return
    }
    if (!isSubmitted && isValue) {
      this.setState({ isModalVisible: true })
    }
  }

  handleOk = () => {
    this.setState({ isModalVisible: false })
    if (!this.isEdit()) {
      this.clearFields()
    }
    this.props.onClose()
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false })
  }

  isEdit = () => {
    const { currentActive } = this.props
    return !isEmpty(currentActive)
  }

  render() {
    const { isModalVisible, categories } = this.state
    const { visible, form, currentActive } = this.props
    const type = form.getFieldValue(FIELDS.TYPE)
    const isEdit = this.isEdit()
    return (
      <React.Fragment>
        <DrawerCustom
          closable={false}
          onClose={this.handleOnClose}
          visible={visible}
          width={400}
        >
          <Row
            type="flex"
            justify="space-between"
            style={{ paddingRight: 24, paddingLeft: 24 }}
          >
            <Col>
              <b
                style={{
                  fontWeight: '500',
                  fontSize: '16px',
                  color: rgb(0, 0, 0, 0.85),
                }}
              >
                {!isEdit ? i18n().drawer.title.add : i18n().drawer.title.edit}{' '}
              </b>
            </Col>
            <Col>
              {isEdit &&
                protectRole(ROLE.INCIDENT_CONFIG_PROPERTIES.DELETE)(
                  <Icon
                    onClick={() => this.handleDel(currentActive)}
                    type="delete"
                    style={{ fontSize: '16px', color: '#F5222D' }}
                  />
                )}
            </Col>
          </Row>
          <Divider style={{ width: '100%' }}></Divider>
          <Form
            layout="vertical"
            onSubmit={this.onSubmit}
            style={{
              height: '100%',
              position: 'relative',
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              <div>
                <FormItem label={i18n().form.label.name}>
                  {form.getFieldDecorator(FIELDS.NAME, {
                    rules: [
                      {
                        required: true,
                        message: i18n().error.required,
                      },
                      {
                        max: 32,
                        message: i18n().error.max32,
                      },
                      {
                        whitespace: true,
                        message: i18n().error.required,
                      },
                    ],
                  })(<Input placeholder={i18n().form.placeholder.name} />)}
                </FormItem>
                <FormItem label={i18n().form.label.type}>
                  {form.getFieldDecorator(FIELDS.TYPE, {
                    onChange: this.handleOnChangeType,
                    rules: [
                      {
                        required: true,
                        message: i18n().error.required,
                      },
                    ],
                  })(
                    <Select disabled={isEdit}>
                      {optionSelectType.map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <FormItem label={i18n().form.label.order}>
                  {form.getFieldDecorator(FIELDS.ORDER, {
                    rules: [
                      {
                        pattern: RegExp('^[0-9]*$'),
                        message: i18n().error.isNumber,
                      },
                    ],
                  })(
                    <InputNumber
                      placeholder={i18n().form.placeholder.order}
                      type="number"
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
                {type === 'category' && (
                  <Categories
                    categories={categories}
                    form={form}
                    onCreateCategory={this.onCreateCategory}
                    onDelSubCategory={this.onDelSubCategory}
                  />
                )}
              </div>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  marginRight: 24,
                  alignSelf: 'end',
                  height: 32,
                  minHeight: 32,
                }}
              >
                {!isEdit ? i18n().button.add : i18n().button.edit}
              </Button>
            </Flex>
          </Form>
        </DrawerCustom>
        <Modal
          centered
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={t('global.leave')}
          cancelText={t('global.cancel')}
          title={t('global.leaveConfirm.title')}
        >
          {t('global.leaveConfirm.content')}
        </Modal>
      </React.Fragment>
    )
  }
}
