import React from 'react'
import { Select } from 'antd'
import { translate as t } from 'hoc/create-lang'
import { getLanguage } from 'utils/localStorage'

const { Option } = Select

const lang = getLanguage()

export const SMS_TYPE = {
  ESMS: {
    title: 'Esms SMS',
    value: 'esms',
  },
  TWILIO: {
    title: 'Twilio SMS',
    value: 'twilio',
  },
}

export const ESMS_FIELDS = {
  API_URL: 'apiUrl',
  API_KEY: 'apiKey',
  SECRET_KEY: 'secretKey',
  SMS_TYPE: 'smsType',
  BRANCH_NAME: 'branchName',
}

export const TWILIO_FIELDS = {
  ACCOUNT_SID: 'accountSid',
  AUTH_TOKEN: 'authToken',
  TWILIO_NUMBER: 'twilioNumber',
}

export const MAILGUN_FIELDS = {
  DOMAIN: 'domain',
  API_KEY: 'mapiKey',
  EMAIL_FROM: 'from',
}

export const MODAL_FIELDS = {
  PHONE_NUMBER: 'phoneNumber',
  EMAIL: 'email',
}

export const getEsmsFormFields = esmsDefaultConfigs => [
  {
    fieldName: ESMS_FIELDS.API_URL,
    label: t('configService.esmsForm.url.label'),
    placeholder: t('configService.esmsForm.url.placeholder'),
    initialValue: esmsDefaultConfigs[ESMS_FIELDS.API_URL],
    rules: [requiredFieldRules(t('configService.esmsForm.url.label'))],
  },
  {
    fieldName: ESMS_FIELDS.API_KEY,
    label: t('configService.esmsForm.key.label'),
    placeholder: t('configService.esmsForm.key.placeholder'),
    initialValue: esmsDefaultConfigs[ESMS_FIELDS.API_KEY],
    rules: [requiredFieldRules(t('configService.esmsForm.key.label'))],
  },
  {
    fieldName: ESMS_FIELDS.SECRET_KEY,
    label: t('configService.esmsForm.secret.label'),
    placeholder: t('configService.esmsForm.secret.placeholder'),
    initialValue: esmsDefaultConfigs[ESMS_FIELDS.SECRET_KEY],
    rules: [requiredFieldRules(t('configService.esmsForm.secret.label'))],
  },
  {
    fieldName: ESMS_FIELDS.SMS_TYPE,
    label: t('configService.esmsForm.smsType.label'),
    input: hasPermission => (
      <Select
        disabled={!hasPermission}
        placeholder={t('configService.esmsForm.smsType.placeholder')}
      >
        <Option value="2">{t('configService.customerCare')} (2)</Option>
        <Option value="8">{t('configService.advertisement')} (8)</Option>
      </Select>
    ),
    initialValue: esmsDefaultConfigs[ESMS_FIELDS.SMS_TYPE],
    rules: [requiredFieldRules(t('configService.esmsForm.smsType.label'))],
  },
  {
    fieldName: ESMS_FIELDS.BRANCH_NAME,
    label: t('configService.esmsForm.brand.label'),
    placeholder: t('configService.esmsForm.brand.placeholder'),
    initialValue: esmsDefaultConfigs[ESMS_FIELDS.BRANCH_NAME],
    rules: [requiredFieldRules(t('configService.esmsForm.brand.label'))],
  },
]

export const getTwilioFormFields = twilioDefaultConfigs => [
  {
    fieldName: TWILIO_FIELDS.ACCOUNT_SID,
    label: (
      <React.Fragment>
        {t('configService.twilioForm.accountSid.label')}
        <a
          target="_blank"
          href="https://www.twilio.com/console/account/settings"
        >
          {' '}
          Twilio Account Settings
        </a>
        {')'}
      </React.Fragment>
    ),
    placeholder: t('configService.twilioForm.accountSid.placeholder'),
    initialValue: twilioDefaultConfigs[TWILIO_FIELDS.ACCOUNT_SID],
    rules: [
      requiredFieldRules(t('configService.twilioForm.accountSid.message')),
    ],
  },
  {
    fieldName: TWILIO_FIELDS.AUTH_TOKEN,
    label: (
      <React.Fragment>
        {t('configService.twilioForm.authToken.label')}
        <a
          target="_blank"
          href="https://www.twilio.com/console/phone-numbers/incoming"
        >
          {' '}
          Twilio Account Settings
        </a>
        {')'}
      </React.Fragment>
    ),
    placeholder: t('configService.twilioForm.authToken.placeholder'),
    initialValue: twilioDefaultConfigs[TWILIO_FIELDS.AUTH_TOKEN],
    rules: [
      requiredFieldRules(t('configService.twilioForm.authToken.message')),
    ],
  },
  {
    fieldName: TWILIO_FIELDS.TWILIO_NUMBER,
    label: (
      <React.Fragment>
        {t('configService.twilioForm.twilioNumber.label')}
        <a
          target="_blank"
          href="https://www.twilio.com/console/account/settings"
        >
          {' '}
          {lang === 'vi' ? 'tại đây' : 'here'}
        </a>
        {')'}
      </React.Fragment>
    ),
    placeholder: t('configService.twilioForm.twilioNumber.placeholder'),
    initialValue: twilioDefaultConfigs[TWILIO_FIELDS.TWILIO_NUMBER],
    rules: [
      requiredFieldRules(t('configService.twilioForm.twilioNumber.message')),
    ],
  },
]

export const getMailgunFormFields = mailgunDefaultConfigs => [
  {
    fieldName: MAILGUN_FIELDS.DOMAIN,
    label: t('configService.mailGunForm.domain.label'),
    placeholder: t('configService.mailGunForm.domain.placeholder'),
    initialValue: mailgunDefaultConfigs[MAILGUN_FIELDS.DOMAIN],
    rules: [requiredFieldRules(t('configService.mailGunForm.domain.label'))],
  },
  {
    fieldName: MAILGUN_FIELDS.API_KEY,
    label: t('configService.mailGunForm.key.label'),
    placeholder: t('configService.mailGunForm.key.placeholder'),
    initialValue: mailgunDefaultConfigs.apiKey,
    rules: [requiredFieldRules(t('configService.mailGunForm.key.label'))],
  },
  {
    fieldName: MAILGUN_FIELDS.EMAIL_FROM,
    label: t('configService.mailGunForm.emailFrom.label'),
    placeholder: t('configService.mailGunForm.emailFrom.placeholder'),
    initialValue: mailgunDefaultConfigs[MAILGUN_FIELDS.EMAIL_FROM],
    rules: [requiredFieldRules(t('configService.mailGunForm.emailFrom.label'))],
  },
]

function requiredFieldRules(field) {
  return {
    required: true,
    message: t('rules.requiredField', { field }),
  }
}
