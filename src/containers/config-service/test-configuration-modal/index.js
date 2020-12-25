import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { Button, Form, Modal, Input, notification } from 'antd'

import { translate as t } from 'hoc/create-lang'
import NotificationApi from 'api/NotificationApi'
import { validateEmail, validatePhone } from 'utils/rules'
import InputPhoneNumber from 'components/elements/input-phone-number'

import { MODAL_FIELDS } from '../helper'

const Marginbottom = styled.div`
  margin-bottom: 20px;
`

const i18n = {
  title: t('configService.testConfiguration'),
  phoneNumberLabel: t('configService.phoneNumberReceiveMessage'),
  emailLabel: t('configService.emailAddress'),
  esmsDescription: t('configService.esmsDescription'),
  mailGunDescription: t('configService.mailGunDescription'),
  send: t('global.send'),
  unknownError: t('global.unknownError'),
  sendMessageSuccessfully: t('configService.sendMessageSuccessfully'),
  esmsError: {
    100: t('errors.esms.100'),
    99: t('errors.esms.99'),
    101: t('errors.esms.101'),
    102: t('errors.esms.102'),
    103: t('errors.esms.103'),
    104: t('errors.esms.104'),
  },
  mailGunError: {
    401: t('errors.mailGun.401'),
    404: t('errors.mailGun.404'),
  },
}

@Form.create()
export default class TestConfigurationModal extends Component {
  state = { isVisible: false }

  modalGetContainer = () => document.getElementById('config-service')

  openModal = () => this.setState({ isVisible: true })

  hideModal = () => this.setState({ isVisible: false })

  handleTestSendMail = email => {
    const { organizationID } = this.props

    const data = {
      organizationID,
      type: 'email',
      emails: [email],
      subject: 'ilotusland Notification',
      html: 'Test send email',
    }
    return NotificationApi.sendEmail(data)
  }

  handleTestSendSms = phoneNumber => {
    const { organizationID } = this.props

    const data = {
      organizationID,
      type: 'sms',
      phone: phoneNumber,
      content: 'Test send SMS',
    }
    return NotificationApi.sendSms(data)
  }

  onSubmit = async e => {
    e.preventDefault()
    const { form, modalType } = this.props
    const values = await form.validateFields()
    if (!values) return
    this.setState({ isLoading: true })
    try {
      let result = {}
      if (modalType === 'esms') {
        result = await this.handleTestSendSms(values[MODAL_FIELDS.PHONE_NUMBER])
      }
      if (modalType === 'mailGun') {
        result = await this.handleTestSendMail(values[MODAL_FIELDS.EMAIL])
      }

      this.setState({ isLoading: false })
      const { error, errorCode, } = result
      if (error) {
        notification.error({ 
          message: 
            i18n.esmsError[errorCode] || 
            i18n.mailGunError[errorCode] || 
            result.message ||
            i18n.unknownError 
        })
        return
      }
      this.setState({ isVisible: false })
      notification.success({ message: i18n.sendMessageSuccessfully })
    } catch (error) {
      this.setState({ isLoading: false }, () => {
        notification.error({ message: i18n.unknownError })
      })
    }
  }

  render() {
    const { isVisible, isLoading } = this.state
    const { form, modalType } = this.props

    return (
      <Modal
        visible={isVisible}
        title={i18n.title}
        footer={null}
        onCancel={this.hideModal}
        getContainer={this.modalGetContainer}
      >
        <Form onSubmit={this.onSubmit}>
          {modalType === 'esms' && (
            <Fragment>
              <div>{i18n.esmsDescription}</div>
              <Form.Item colon={false} label={i18n.phoneNumberLabel}>
                {form.getFieldDecorator(MODAL_FIELDS.PHONE_NUMBER, {
                  rules: [{ validator: validatePhone }],
                })(<InputPhoneNumber />)}
              </Form.Item>
            </Fragment>
          )}
          {modalType === 'mailGun' && (
            <Fragment>
              <div>{i18n.mailGunDescription}</div>
              <Form.Item colon={false} label={i18n.emailLabel}>
                {form.getFieldDecorator(MODAL_FIELDS.EMAIL, {
                  rules: [{ validator: validateEmail }],
                })(<Input size="large" />)}
              </Form.Item>
            </Fragment>
          )}
          <Marginbottom />
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
          >
            {i18n.send}
          </Button>
        </Form>
      </Modal>
    )
  }
}
