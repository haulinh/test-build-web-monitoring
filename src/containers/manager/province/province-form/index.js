import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import createLanguageHoc, { langPropTypes } from '../../../../hoc/create-lang'
import InputNumberCell from 'components/elements/input-number-cell'
import { Clearfix } from 'components/elements'
import LanguageInput, {getLanguageContents} from 'components/language'
import { updateLanguageContent } from 'redux/actions/languageAction'
import {connect} from 'react-redux'
import CalculateApi from 'api/CalculateApi'
import get from 'lodash/get'

const FormItem = Form.Item

@connect(() => ({}), {
  updateLanguageContent
})
@Form.create({ })
@createLanguageHoc
@autobind
export default class ProvinceForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    isLoading: PropTypes.bool,
  }

  componentDidMount() {
    const {isEdit, form, initialValues} = this.props
    if (!isEdit) return
    form.setFieldsValue({
      key: initialValues.key,
      name: initialValues.name,
      numericalOrder: initialValues.numericalOrder
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) return
      const data = {
        key: values.key,
        name: (values.name || '').trim(),
        numericalOrder: values.numericalOrder,
      }
      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
      if(res.success) this.updateLanguage(res.data._id) 

      if (res && res.error) {
        if (res.message === 'KEY_EXISTED') {
          this.props.form.setFields({
            key: {
              value: values.key,
              errors: [
                new Error(this.props.lang.t('province.create.keyExisted')),
              ],
            },
          })
        }
      }
    })
  }

  updateLanguage(itemId, type = 'Province') {
    const {form, updateLanguageContent} = this.props
    const values = form.getFieldsValue()
    const language = getLanguageContents(values)
    updateLanguageContent({itemId, type, language})
  }

  onChangeLanguage(language, field='name') {
    const {form, isEdit, initialValues} = this.props
    const languageFieldName = `language.${field}`;
    const content = form.getFieldValue(languageFieldName);
    form.setFieldsValue({[languageFieldName]: language})

    // don't process save for initial data or creation flow
    if(!isEdit || !content) return
    this.updateLanguage(initialValues._id)
  }

  render() {
    const {form, lang, initialValues} = this.props
    const {getFieldDecorator} = form
    const {t} = lang

    const formItemLayout = {
      labelCol: {
        sm: { span: 6, offset: 0 },
      },
      wrapperCol: {
        sm: { span: 17, offset: 0 },
      },
    }

    form.getFieldDecorator('language.name')
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={8}>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('province.form.key.label')}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: t('province.form.key.error'),
                  },
                  {
                    pattern: PATTERN_KEY,
                    message: t('province.form.key.pattern'),
                  },
                  {
                    max: 64,
                    message: t('province.form.key.max'),
                  },
                ],
              })(
                <Input
                  size="large"
                  disabled={this.props.isEdit}
                  placeholder={t('province.form.key.placeholder')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('province.form.name.label')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: t('province.form.name.error'),
                  },
                  {
                    pattern: PATTERN_NAME,
                    message: t('province.form.name.pattern'),
                  },
                  {
                    max: 64,
                    message: t('province.form.name.max'),
                  },
                ],
              })(
                <LanguageInput
                  size="large"
                  placeholder={t('province.form.name.placeholder')}
                  itemId={get(initialValues, '_id')}
                  type='Province'
                  language={form.getFieldValue('language.name')}
                  rules={[{
                    max: 64,
                    message: t('province.form.name.max'),
                  }]}
                  onChangeLanguage={(language) => this.onChangeLanguage(language)}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('province.form.numericalOrder.label')}
            >
              {getFieldDecorator('numericalOrder', {
                rules: [
                  {
                    required: true,
                    message: t('province.form.numericalOrder.error'),
                  },
                ],
              })(
                <InputNumberCell
                  placeholder={t('province.form.numericalOrder.placeholder')}
                  size="large"
                  editable
                  min={1}
                  max={1000000}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Clearfix height={16} />
        <FormItem>
          <Button
            style={{ width: '100%' }}
            isLoading={this.props.isLoading}
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
