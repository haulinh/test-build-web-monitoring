import React from 'react'
import { Form, Input, Button, Row, Col, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import moment from 'moment'
import * as _ from 'lodash'

import { mapPropsToFields } from 'utils/form'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import InputNumberCell from 'components/elements/input-number-cell'
import Clearfix from 'components/elements/clearfix'
import MeasuringList from './measuring-list'

const FormItem = Form.Item

const i18n = {
  key: {
    required: translate('qcvn.form.key.required'),
    pattern: translate('qcvn.form.key.pattern'),
    max: translate('qcvn.form.key.max'),
  },
  name: {
    required: translate('qcvn.form.name.required'),
    pattern: translate('qcvn.form.name.pattern'),
    max: translate('qcvn.form.name.max'),
  },
  measuringList: {
    required: translate('qcvn.form.measuringList.required'),
    validate1: translate('qcvn.form.measuringList.validate1'),
    validate2: translate('qcvn.form.measuringList.validate2'),
    validate3: translate('qcvn.form.measuringList.validate3'),
    validate4: translate('qcvn.form.measuringList.validate4'),
  },
}

@Form.create({
  mapPropsToFields: ({ initialValues }) => {
    if (!initialValues) return
    return mapPropsToFields({ initialValues })
  },
})
@createLanguageHoc
@autobind
export default class QCVNForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    isLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      options: {},
      previewVisible: false,
    }
  }

  async componentWillMount() {
    if (this.props.initialValues) {
      let fileList = []
      this.setState({
        options: this.props.initialValues.options
          ? this.props.initialValues.options
          : {},
        fileList: fileList,
      })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) return

      if (
        values.expired &&
        !moment(
          values.expired.utcOffset(0).set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
        ).isAfter(
          moment(
            values.begin.utcOffset(0).set({
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            })
          )
        )
      ) {
        this.props.form.setFields({
          expired: {
            value: values.expired,
            errors: [
              new Error(this.props.lang.t('qcvn.edit.expiredBeforeBegin')),
            ],
          },
        })
        return
      }

      const data = {
        key: values.key,
        name: (values.name || '').trim(),
        measuringList: values.measuringList,
        numericalOrder: values.numericalOrder,
        begin: values.begin,
        expired: values.expired,
      }
      console.log(data, '---DATA---')
      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
      if (res && res.error) {
        if (res.message === 'KEY_EXISTED') {
          this.props.form.setFields({
            key: {
              value: values.key,
              errors: [new Error(this.props.lang.t('qcvn.create.keyExisted'))],
            },
          })
        }
      }
    })
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { t } = this.props.lang
    const formItemLayout = {
      labelCol: {
        sm: { span: 6, offset: 0 },
      },
      wrapperCol: {
        sm: { span: 17, offset: 0 },
      },
    }

    const roleKey = this.props.isEdit
      ? []
      : [
          {
            pattern: PATTERN_KEY,
            message: i18n.key.pattern,
          },
        ]

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={[16, 24]}>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('qcvn.form.key.label')}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: i18n.key.required,
                  },
                  {
                    max: 64,
                    message: i18n.key.max,
                  },
                  ...roleKey,
                ],
              })(
                <Input
                  size="large"
                  disabled={this.props.isEdit}
                  placeholder={t('qcvn.form.key.placeholder')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('qcvn.form.name.label')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: i18n.name.required,
                  },
                  {
                    pattern: PATTERN_NAME,
                    message: i18n.name.pattern,
                  },
                  {
                    max: 64,
                    message: i18n.name.max,
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder={t('qcvn.form.name.placeholder')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('qcvn.form.begin.label')}>
              {getFieldDecorator('begin', {
                rules: [
                  {
                    required: true,
                    message: t('qcvn.form.begin.error'),
                  },
                ],
              })(
                <DatePicker
                  size="large"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder={t(
                    'stationAutoManager.form.dayOfOperation.placeholder'
                  )}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('qcvn.form.expired.label')}>
              {getFieldDecorator('expired', {
                rules: [{ required: false }],
              })(
                <DatePicker
                  size="large"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder={t(
                    'stationAutoManager.form.dayOfOperation.placeholder'
                  )}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('qcvn.form.numericalOrder.label')}
            >
              {getFieldDecorator('numericalOrder', {
                rules: [
                  {
                    required: true,
                    message: t('qcvn.form.numericalOrder.error'),
                  },
                ],
              })(
                <InputNumberCell
                  size="large"
                  placeholder={t('qcvn.form.numericalOrder.placeholder')}
                  editable={true}
                  min={1}
                  max={1000000}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Clearfix height={24} />
        <Row>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('measuringList', {
                rules: [
                  {
                    type: 'array',
                    required: true,
                    message: i18n.measuringList.required,
                  },
                  {
                    validator: (rule, value, callback) =>
                      this.validateMeasuringList(rule, value, callback),
                  },
                ],
              })(<MeasuringList />)}
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

  validateMeasuringList = (rule, value, callback) => {
    const errorArr = _.map(value, item => {
      let isBound = false
      if (item.key) {
        let strItem = item.name
        if (
          _.isNumber(item.minLimit) &&
          _.isNumber(item.maxLimit) &&
          item.minLimit > item.maxLimit
        ) {
          strItem = _.concat(strItem, ` -- ${i18n.measuringList.validate1}`)
          isBound = true
        }

        if (isBound) return <div>{strItem}</div>
      }
    })

    // const { form } = this.props
    // if (value && value > form.getFieldValue(fliedName)) {
    if (true) {
      callback(_.compact(errorArr))
    } else {
      callback()
    }
  }
}
