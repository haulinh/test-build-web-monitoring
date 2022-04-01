import { Button, Col, Form, Icon, Input, Radio, Row } from 'antd'
import InputNumberCell from 'components/elements/input-number-cell'
import SelectIcon from 'components/elements/select-icon-station-type'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import { autobind } from 'core-decorators'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { mapPropsToFields } from 'utils/form'
import LanguageInput, {LangConfig} from 'components/language'
import CalculateApi from 'api/CalculateApi'
import {getLanguage} from 'utils/localStorage'
import get from 'lodash/get'
import {connect} from 'react-redux'
import { updateLanguageContent } from 'redux/actions/languageAction'

function i18n() {
  return {
    mode: translate('stationTypeManager.form.mode.label'),
    auto: translate('stationTypeManager.type.auto'),
    periodic: translate('stationTypeManager.type.periodic'),
  }
}

const FormItem = Form.Item

@connect(() => ({}), {
  updateLanguageContent
})
@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
@autobind
export default class StationTypeForm extends React.PureComponent {
  static propTypes = {
    isEdit: PropTypes.bool,
    onSubmit: PropTypes.func,
    lang: langPropTypes,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      urlIcon: '',
      color: '',
      name: '',
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) return
      const data = {
        key: values.key,
        name: (values.name || '').trim(),
        isAuto: _.isUndefined(values.isAuto) ? false : values.isAuto,
        icon: this.state.urlIcon,
        color: this.state.color,
        numericalOrder: values.numericalOrder,
      }
      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
      if(res.success) {
        const language = this.getLanguageContents(values)
        const itemId = res.data._id
        const content = await CalculateApi.updateLanguageContent({itemId, type: 'StationType', language})
        this.props.updateLanguageContent(content)
      }
      if (res && res.error) {
        if (res.message === 'KEY_EXISTED') {
          this.props.form.setFields({
            key: {
              value: values.key,
              errors: [
                new Error(
                  this.props.lang.t('stationTypeManager.create.keyExisted')
                ),
              ],
            },
          })
        }
      }
    })
  }

  renderButtonUpload(name) {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{name}</div>
      </div>
    )
  }

  async componentDidMount() {
    const {initialValues, form} = this.props
    if (initialValues) {
      form.setFieldsValue({name: initialValues.name})
      let updateState = {}
      if (initialValues.icon && initialValues.icon !== '')
        updateState.urlIcon = initialValues.icon
      if (initialValues.color)
        updateState.color = initialValues.color
      this.setState(updateState)
    }
  }

  onChangeIcon(iconObject) {
    this.setState({
      urlIcon: iconObject.urlIcon,
      color: iconObject.color,
    })
  }

  getLanguageContents(values, fields = ['name']){
    const currentLang = getLanguage()
    const contents = get(values, 'language');

    const getContent = (field, value, lang) => {
      const isSetupLanguage = !!get(contents, field);
      if(currentLang === lang) return value
      return isSetupLanguage ? get(contents, `${field}.${lang}`, '').trim() : value;
    }
    const results = fields.reduce((prev, field) => {
      const inputValue = get(values, field, '').trim();
      prev[field] = LangConfig.reduce((p, {lang}) => ({
        ...p,
        [lang]: getContent(field, inputValue, lang)
      }), {})
      return prev
    }, {})

    return results
  }

  render() {
    const {form, lang, initialValues} = this.props
    const {getFieldDecorator} = form
    const {t} = lang

    const formItemLayout = {
      labelCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 3, offset: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    getFieldDecorator('language.name')

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label={t('stationTypeManager.form.key.label')}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: t('stationTypeManager.form.key.error'),
                  },
                  {
                    pattern: PATTERN_KEY,
                    message: t('stationTypeManager.form.key.pattern'),
                  },
                  {
                    max: 64,
                    message: t('stationTypeManager.form.key.max'),
                  },
                ],
              })(
                <Input
                  disabled={this.props.isEdit ? true : false}
                  size="large"
                  placeholder={t('stationTypeManager.form.key.label')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={t('stationTypeManager.form.name.label')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: t('stationTypeManager.form.name.error'),
                  },
                  {
                    pattern: PATTERN_NAME,
                    message: t('stationTypeManager.form.name.pattern'),
                  },
                  {
                    max: 64,
                    message: t('stationTypeManager.form.name.max'),
                  },
                ],
              })(
                <LanguageInput
                  size="large"
                  placeholder={t('stationTypeManager.form.name.label')}
                  itemId={get(initialValues, '_id')}
                  type='StationType'
                  language={form.getFieldValue('language.name')}
                  rules={[{
                    max: 64,
                    message: t('stationTypeManager.form.name.max'),
                  }]}
                  onChangeLanguage={language => form.setFieldsValue({'language.name': language})}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" gutter={16}>
          <Col span={8}>
            <FormItem
              {...{
                labelCol: {
                  xs: { span: 16, offset: 0 },
                  sm: { span: 4, offset: 0 },
                },
                wrapperCol: {
                  xs: { span: 12 },
                  sm: { span: 12 },
                },
              }}
              label={t('stationTypeManager.form.icon.label')}
            >
              <SelectIcon
                initialValues={this.state}
                onChangeValue={this.onChangeIcon}
              />
            </FormItem>
          </Col>
          <Col span={13}>
            <FormItem {...formItemLayout} label={i18n().mode}>
              {getFieldDecorator('isAuto', {
                rules: [
                  {
                    required: true,
                    message: t('stationTypeManager.form.mode.error'),
                  },
                ],
              })(
                <Radio.Group
                  disabled={this.props.isEdit ? true : false}
                  style={{ width: '100%' }}
                >
                  <Radio value={false}>{i18n().periodic}</Radio>
                  <Radio value={true}>{i18n().auto}</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem
              {...formItemLayout}
              labelCol={{ span: 12 }}
              label={t('stationTypeManager.form.numericalOrder.label')}
            >
              {getFieldDecorator('numericalOrder', {
                rules: [
                  {
                    required: true,
                    message: t('stationTypeManager.form.numericalOrder.error'),
                  },
                ],
              })(
                <InputNumberCell
                  style={{ width: '100%' }}
                  size="large"
                  placeholder={t(
                    'stationTypeManager.form.numericalOrder.placeholder'
                  )}
                  editable={true}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button
            style={{ width: '100%' }}
            loading={this.props.isLoading}
            type="primary"
            htmlType="submit"
          >
            {t('addon.save')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
