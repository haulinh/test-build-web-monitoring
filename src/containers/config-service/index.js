import React, { Component, createRef, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Button, Col, Form, Input, Row, Skeleton } from 'antd'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

import { translate as t } from 'hoc/create-lang'
import OrganizationApi from 'api/OrganizationApi'

import {
  ESMS_FIELDS,
  MAILGUN_FIELDS,
  getEsmsFormFields,
  getMailgunFormFields,
} from './helper'

import TestConfigurationModal from './test-configuration-modal'

const Wrapper = styled.div`
  .skeleton {
    width: 548px;
    margin: 24px;
  }
  .btnGroup {
    margin-top: 24px;
  }
  form {
    .ant-form-item {
      margin-bottom: 5px;
    }
    .ant-form-item-control {
      line-height: normal;
    }
    label {
      margin-bottom: 0;
      font-weight: 600;
      font-size: 12px;
    }
    .test-configuration {
      color: #2693fc;
      cursor: pointer;
    }
    .ant-btn {
      width: 100px;
    }
  }
`

const Header = styled.div`
  padding: 20px 24px;
  background: #fafbfb;
  box-shadow: inset 0px -1px 0px rgba(182, 182, 182, 0.25);
`

const Container = styled.div`
  padding: 24px;
`

const Text = styled.div`
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || '600'};
  color: ${props => props.color || '#000'};
`

const Card = styled.div`
  width: 548px;
  padding: 24px;
  border-radius: 4px;
  margin-bottom: 24px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  > div:first-child {
    margin-bottom: 10px;
  }
`

const i18n = {
  headerTitle: t('configService.title'),
  save: t('global.save'),
  testConfiguration: t('configService.testConfiguration'),
  esms: {
    title: t('configService.esmsService'),
  },
  mailgun: {
    title: t('configService.mailGunService'),
  },
}
@protectRole(ROLE.SERVICE_CONFIG.VIEW)
@Form.create()
@connect(state => ({
  organization: state.auth.userInfo.organization,
}))
export default class ConfigService extends Component {
  state = {
    modalType: '',
    organization: {},
    isFetchingOrganization: false,
    isSubmitEsmsForm: false,
    isSubmitMailGunForm: false,
  }

  modalRef = createRef()

  async componentDidMount() {
    const {
      organization: { _id: organizationId },
    } = this.props
    this.setState({ isFetchingOrganization: true })
    const result = await OrganizationApi.getOrganization(organizationId)
    this.setState({
      organization: result.data || {},
      isFetchingOrganization: false,
    })
  }

  setShowModal = modalType => {
    this.setState({ modalType }, this.modalRef.openModal)
  }

  renderForm = params => {
    const { form } = this.props
    const { isLoading, type, title, formFields, onSubmit } = params
    return (
      <Card>
        <Text fontSize={16} color="#272727">
          {title}
        </Text>
        <Form onSubmit={onSubmit}>
          {formFields.map(item => (
            <Form.Item key={item.fieldName} label={item.label} colon={false}>
              {form.getFieldDecorator(item.fieldName, {
                initialValue: item.initialValue,
                rules: item.rules,
              })(
                protectRole(
                  ROLE.SERVICE_CONFIG.SETUP,
                  [],
                  'input'
                )(<Input  placeholder={item.placeholder} />)
              )}
            </Form.Item>
          ))}
          <Row type="flex" align="middle" gutter={12} className="btnGroup">
            {protectRole(ROLE.SERVICE_CONFIG.SETUP)(
              <Col>
                <Button loading={isLoading} type="primary" htmlType="submit">
                  {i18n.save}
                </Button>
              </Col>
            )}

            <Col>
              <Text
                className="test-configuration"
                onClick={() => this.setShowModal(type)}
              >
                {i18n.testConfiguration}
              </Text>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  updateNotifyChannel = async (service, isEsmsFormSubmit) => {
    this.setState({
      isSubmitEsmsForm: isEsmsFormSubmit,
      isSubmitMailGunForm: !isEsmsFormSubmit,
    })
    const { organization: { _id: organizationId } = {} } = this.props
    const result = await OrganizationApi.updateNotifyChannel(
      organizationId,
      service
    )
    if (result)
      this.setState({ isSubmitEsmsForm: false, isSubmitMailGunForm: false })
  }

  handleUpdateFormEsms = async e => {
    e.preventDefault()
    const { form } = this.props
    const formValues = await form.validateFields(Object.values(ESMS_FIELDS))
    if (!formValues) return

    const service = {
      serviceType: 'sms',
      serviceName: 'esms',
      configs: formValues,
    }

    this.updateNotifyChannel(service, true)
  }

  handleUpdateFormEmailGun = async e => {
    e.preventDefault()
    const { form } = this.props
    const formValues = await form.validateFields(Object.values(MAILGUN_FIELDS))
    if (!formValues) return

    const service = {
      serviceType: 'email',
      serviceName: 'mailgun',
      configs: {
        ...formValues,
        apiKey: formValues[MAILGUN_FIELDS.API_KEY],
      },
    }

    this.updateNotifyChannel(service)
  }

  render() {
    const {
      modalType,
      isSubmitEsmsForm,
      isSubmitMailGunForm,
      isFetchingOrganization,
      organization: { notifyChannels: { sms, email } = {} },
    } = this.state

    const {
      organization: { _id: organizationId },
    } = this.props

    const esmsDefaultConfigs =
      ((sms || []).find(item => item.serviceName === 'esms') || {}).configs ||
      {}
    const mailgunDefaultConfigs =
      ((email || []).find(item => item.serviceName === 'mailgun') || {})
        .configs || {}

    const esmsForm = {
      type: 'esms',
      title: i18n.esms.title,
      isLoading: isSubmitEsmsForm,
      onSubmit: this.handleUpdateFormEsms,
      formFields: getEsmsFormFields(esmsDefaultConfigs),
    }

    const mailGunForm = {
      type: 'mailGun',
      isLoading: isSubmitMailGunForm,
      title: i18n.mailgun.title,
      onSubmit: this.handleUpdateFormEmailGun,
      formFields: getMailgunFormFields(mailgunDefaultConfigs),
    }

    return (
      <Wrapper id="config-service">
        <Header>
          <Text fontSize={20} fontWeight="bold" color="rgba(0, 0, 0, 0.85)">
            {i18n.headerTitle}
          </Text>
        </Header>

        {isFetchingOrganization ? (
          <Fragment>
            <Skeleton
              className="skeleton"
              paragraph={{ rows: 8 }}
              avatar={false}
              title={false}
            />
            <Skeleton
              className="skeleton"
              paragraph={{ rows: 8 }}
              avatar={false}
              title={false}
            />
          </Fragment>
        ) : (
          <Container>
            {this.renderForm(esmsForm)}
            {this.renderForm(mailGunForm)}
          </Container>
        )}
        <TestConfigurationModal
          organizationID={organizationId}
          modalType={modalType}
          wrappedComponentRef={ref => (this.modalRef = ref)}
        />
      </Wrapper>
    )
  }
}
