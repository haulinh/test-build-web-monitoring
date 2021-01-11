import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import CategoryApi from 'api/CategoryApi'
import createLanguageHoc, { langPropTypes, translate } from 'hoc/create-lang'
import swal from 'sweetalert2'
import MeasuringTableQCVN from '../qcvn-formTable'
import InputNumberCell from 'components/elements/input-number-cell'
import Clearfix from 'components/elements/clearfix'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'

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
      measuringList: [],
      measuringListSource: [],
      measuringOps: [],
      options: {},
      previewVisible: false,
    }
  }

  async componentWillMount() {
    const measuringList = await CategoryApi.getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )

    this.setState({
      measuringListSource: measuringList.data,
    })
    if (this.props.initialValues) {
      let fileList = []
      this.setState({
        measuringList: this.props.initialValues.measuringList,
        options: this.props.initialValues.options
          ? this.props.initialValues.options
          : {},
        fileList: fileList,
      })
    }
  }

  handleChange(value, key, column) {
    const newData = [...this.state.measuringList]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      target[column] = value
      this.setState({ measuringList: newData })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!values.measuringList) {
        const { t } = this.props.lang
        swal({
          title: t('stationAutoManager.addMeasuring.error'),
          type: 'error',
        })
        return
      }
      if (err) return
      const data = {
        key: values.key,
        name: values.name,
        measuringList: values.measuringList,
        numericalOrder: values.numericalOrder,
      }
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
                    pattern: PATTERN_KEY,
                    message: i18n.key.pattern,
                  },
                  {
                    max: 64,
                    message: i18n.key.max,
                  },
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
        <MeasuringTableQCVN
          lang={this.props.lang}
          form={this.props.form}
          dataSource={
            this.props.initialValues
              ? this.props.initialValues.measuringList
              : [
                  {
                    key: '',
                    name: '',
                    unit: '',
                  },
                ]
          }
          measuringListSource={this.state.measuringListSource}
        />
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
