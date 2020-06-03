import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguage, { langPropTypes } from 'hoc/create-lang'
import InputNumberCell from 'components/elements/input-number-cell'

const FormItem = Form.Item

@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguage
@autobind
export default class MeasuringForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    lang: langPropTypes,
    isEdit: PropTypes.bool,
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) return
      const data = {
        key: values.key,
        name: values.name,
        unit: values.unit ? values.unit : '',
        numericalOrder: values.numericalOrder,
      }
      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
      if (res.error) {
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
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
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
                ],
              })(
                <Input
                  size="large"
                  placeholder={t('measuringManager.form.name.placeholder')}
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
              // labelCol={{ span: 7}}
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
