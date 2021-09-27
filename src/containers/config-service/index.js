import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Skeleton,
} from 'antd'
import OrganizationApi from 'api/OrganizationApi'
import ROLE from 'constants/role'
import { translate as t } from 'hoc/create-lang'
import protectRole, { PermissionPopover } from 'hoc/protect-role'
import React, { Component, createRef, Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  ESMS_FIELDS,
  getEsmsFormFields,
  getMailgunFormFields,
  getTwilioFormFields,
  MAILGUN_FIELDS,
  SMS_TYPE,
  TWILIO_FIELDS,
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
  display: flex;
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

function i18n() {
  return {
    headerTitle: t('configService.title'),
    save: t('global.save'),
    testConfiguration: t('configService.testConfiguration'),
    sms: {
      title: t('configService.smsService'),
    },
    mailgun: {
      title: t('configService.mailGunService'),
    },
  }
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
    isSubmitSmsForm: false,
    isSubmitMailGunForm: false,
  }

  modalRef = createRef()

  async componentDidMount() {
    try {
      const {
        organization: { _id: organizationId },
      } = this.props
      this.setState({ isFetchingOrganization: true })
      const result = await OrganizationApi.getOrganization(organizationId)
      const {
        notifyChannels: { sms },
      } = result.data
      const defaultService = sms.find(item => item.allowed) || {}
      this.setState({
        organization: result.data || {},
        isFetchingOrganization: false,
        smsType: defaultService.serviceName || SMS_TYPE.ESMS.value,
      })
    } catch (error) {
      this.setState({ isFetchingOrganization: false })
    }
  }

  setShowModal = modalType => {
    this.setState({ modalType }, this.modalRef.openModal)
  }

  onChangeSelectSmsType = e => {
    this.setState({ smsType: e.target.value }, async () => {
      const { organization: { _id: organizationId } = {} } = this.props
      const service = {
        serviceType: 'sms',
        serviceName: e.target.value,
      }
      const result = await OrganizationApi.switchNotifyChannel(
        organizationId,
        service
      )
      if (result) {
        notification.success({
          message: t('configService.changeServiceName', {
            serviceName: e.target.value,
          }),
        })
      }
    })
  }

  renderForm = params => {
    const { form } = this.props
    const { isLoading, type, title, formFields, onSubmit } = params
    return (
      <Card>
        {type === 'mailGun' ? (
          <Text fontSize={16} color="#272727">
            {title}
          </Text>
        ) : (
          <Fragment>
            <Text fontSize={16} color="#272727">
              {title}
            </Text>
            <PermissionPopover
              roles={ROLE.SERVICE_CONFIG.SETUP}
              popoverPlacement="right"
            >
              {hasPermission => (
                <Radio.Group
                  onChange={this.onChangeSelectSmsType}
                  value={this.state.smsType}
                >
                  {Object.keys(SMS_TYPE).map(type => (
                    <Radio
                      key={type}
                      value={SMS_TYPE[type].value}
                      disabled={!hasPermission}
                    >
                      {SMS_TYPE[type].title}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
            </PermissionPopover>
          </Fragment>
        )}

        <Form onSubmit={onSubmit}>
          {formFields.map(item => (
            <PermissionPopover
              key={item.fieldName}
              roles={ROLE.SERVICE_CONFIG.SETUP}
              popoverPlacement="right"
            >
              {hasPermission => (
                <Form.Item label={item.label} colon={false}>
                  {form.getFieldDecorator(item.fieldName, {
                    initialValue: item.initialValue,
                    rules: item.rules,
                  })(
                    item.input ? (
                      item.input(hasPermission)
                    ) : (
                      <Input
                        disabled={!hasPermission}
                        placeholder={item.placeholder}
                      />
                    )
                  )}
                </Form.Item>
              )}
            </PermissionPopover>
          ))}
          <Row type="flex" align="middle" gutter={12} className="btnGroup">
            <Col>
              <PermissionPopover roles={ROLE.SERVICE_CONFIG.SETUP}>
                <Button loading={isLoading} type="primary" htmlType="submit">
                  {i18n().save}
                </Button>
              </PermissionPopover>
            </Col>
            <Col>
              <Text
                className="test-configuration"
                onClick={() => this.setShowModal(type)}
              >
                {i18n().testConfiguration}
              </Text>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  updateNotifyChannel = async (service, isEsmsFormSubmit) => {
    this.setState({
      isSubmitSmsForm: isEsmsFormSubmit,
      isSubmitMailGunForm: !isEsmsFormSubmit,
    })
    const { organization: { _id: organizationId } = {} } = this.props
    const result = await OrganizationApi.updateNotifyChannel(
      organizationId,
      service
    )
    if (result) {
      this.setState({ isSubmitSmsForm: false, isSubmitMailGunForm: false })
      notification.success({ message: t('global.saveSuccess') })
    }
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

  handleUpdateFormTwilio = async e => {
    e.preventDefault()
    const { form } = this.props
    const formValues = await form.validateFields(Object.values(TWILIO_FIELDS))
    if (!formValues) return

    const service = {
      serviceType: 'sms',
      serviceName: 'twilio',
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
      isSubmitSmsForm,
      isSubmitMailGunForm,
      isFetchingOrganization,
      organization: { notifyChannels: { sms, email } = {} },
      smsType,
    } = this.state

    const {
      organization: { _id: organizationId },
    } = this.props

    const esmsDefaultConfigs =
      ((sms || []).find(item => item.serviceName === 'esms') || {}).configs ||
      {}
    const twilioDefaultConfigs =
      ((sms || []).find(item => item.serviceName === 'twilio') || {}).configs ||
      {}
    const mailgunDefaultConfigs =
      ((email || []).find(item => item.serviceName === 'mailgun') || {})
        .configs || {}

    const esmsForm = {
      type: 'esms',
      title: i18n().sms.title,
      isLoading: isSubmitSmsForm,
      onSubmit: this.handleUpdateFormEsms,
      formFields: getEsmsFormFields(esmsDefaultConfigs),
    }

    const twilioForm = {
      type: 'esms',
      title: i18n().sms.title,
      isLoading: isSubmitSmsForm,
      onSubmit: this.handleUpdateFormTwilio,
      formFields: getTwilioFormFields(twilioDefaultConfigs),
    }

    const smsForm = {
      twilio: twilioForm,
      esms: esmsForm,
    }

    const mailGunForm = {
      type: 'mailGun',
      isLoading: isSubmitMailGunForm,
      title: i18n().mailgun.title,
      onSubmit: this.handleUpdateFormEmailGun,
      formFields: getMailgunFormFields(mailgunDefaultConfigs),
    }

    return (
      <Wrapper id="config-service">
        <Header>
          <Text fontSize={22} color="#3B3B3B" fontWeight={600}>
            {i18n().headerTitle}
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
            {smsType
              ? this.renderForm(smsForm[smsType])
              : this.renderForm(smsForm.esms)}
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
