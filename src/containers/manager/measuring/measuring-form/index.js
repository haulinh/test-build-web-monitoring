import { Button, Col, Form, Input, Row } from 'antd'
import InputNumberCell from 'components/elements/input-number-cell'
import LanguageInput, { getLanguageContents } from 'components/language'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import { autobind } from 'core-decorators'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import { get, isEqual } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { updateLanguageContent } from 'redux/actions/languageAction'

const FormItem = Form.Item

@Form.create({
  // mapPropsToFields: mapPropsToFields,
})
@createLanguage
@connect(null, { updateLanguageContent })
@withRouter
@autobind
export default class MeasuringForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    lang: langPropTypes,
    isEdit: PropTypes.bool,
  }

  componentDidMount() {
    const { form, initialValues } = this.props
    form.setFieldsValue(initialValues)
  }

  componentDidUpdate(prevProps) {
    const { initialValues, form } = this.props

    if (!isEqual(initialValues.name, prevProps.initialValues.name)) {
      form.setFieldsValue({ name: initialValues.name })
    }
  }

  constructor(props) {
    super(props)
    const { match } = props
    this._id = get(match, 'params.key')
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) return
      const { isEdit } = this.props
      const data = {
        key: values.key,
        name: (values.name || '').trim(),
        unit: values.unit ? values.unit : '',
        numericalOrder: values.numericalOrder,
      }

      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
      if (!isEdit) {
        this._id = get(res, 'data._id')
      }

      if (res && res.error) {
        if (res.message === 'KEY_EXISTED') {
          this.props.form.setFields({
            key: {
              value: values.key,
              errors: [
                new Error(
                  this.props.lang.t('measuringManager.create.keyExisted')
                ),
              ],
            },
          })
        }
        return
      }

      this.updateLanguage()
    })
  }

  updateLanguage(type = 'Measure') {
    const { form, updateLanguageContent } = this.props

    const values = form.getFieldsValue()
    const language = getLanguageContents(values)

    updateLanguageContent({
      itemId: this._id,
      itemKey: values.key,
      type,
      language,
    })
  }
  onChangeLanguage(language, field = 'name') {
    const { form, isEdit } = this.props
    const languageFieldName = `language.${field}`

    form.setFieldsValue({ [languageFieldName]: language })
    const content = form.getFieldValue(languageFieldName)

    // don't process save for initial data or creation flow
    if (!isEdit || !content) return
    this.updateLanguage()
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      lang: { t },
    } = this.props

    const formItemLayout = {
      labelCol: {
        // sm: { span: 2, offset: 0 }
        xs: { span: 0, offset: 0 },
        sm: { span: 0, offset: 0 },
      },
      wrapperCol: {
        // sm: { span: 20, offset: 0 }
        xs: { span: 12 },
        sm: { span: 24 },
      },
    }

    getFieldDecorator('language.name')

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={16}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('measuringManager.form.key.label')}
            >
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: t('measuringManager.form.key.error'),
                  },
                  {
                    pattern: PATTERN_KEY,
                    message: t('measuringManager.form.key.pattern'),
                  },
                  {
                    max: 64,
                    message: t('measuringManager.form.key.max'),
                  },
                ],
              })(
                <Input
                  size="large"
                  disabled={this.props.isEdit}
                  placeholder={t('measuringManager.form.key.placeholder')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('measuringManager.form.name.label')}
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: t('measuringManager.form.name.error'),
                  },
                  {
                    pattern: PATTERN_NAME,
                    message: t('measuringManager.form.name.pattern'),
                  },
                  {
                    max: 64,
                    message: t('measuringManager.form.name.max'),
                  },
                ],
              })(
                <LanguageInput
                  itemId={this._id}
                  type="Measure"
                  language={getFieldValue('language.name')}
                  placeholder={t('stationAutoManager.form.name.placeholder')}
                  rules={[
                    {
                      max: 64,
                      message: t('measuringManager.form.name.max'),
                    },
                  ]}
                  onChangeLanguage={language => this.onChangeLanguage(language)}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('measuringManager.form.unit.label')}
            >
              {getFieldDecorator('unit')(
                <Input
                  size="large"
                  placeholder={t('measuringManager.form.unit.placeholder')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('measuringManager.form.numericalOrder.label')}
            >
              {getFieldDecorator('numericalOrder', {
                rules: [
                  {
                    required: true,
                    message: t('measuringManager.form.numericalOrder.error'),
                  },
                ],
              })(
                <InputNumberCell
                  size="large"
                  placeholder={t(
                    'measuringManager.form.numericalOrder.placeholder'
                  )}
                  editable={true}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            {t('addon.save')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
