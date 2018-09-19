import React from 'react'
import {
  Form,
  Input,
  Button,
  Row,
  Col
} from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import CategoryApi from 'api/CategoryApi'
import createLanguageHoc, { langPropTypes } from '../../../../hoc/create-lang'
import swal from 'sweetalert2'
import MeasuringTableQCVN from '../qcvn-formTable'
import InputNumberCell from 'components/elements/input-number-cell'

const FormItem = Form.Item

@Form.create({
  mapPropsToFields: ({ initialValues }) => {
    if (!initialValues) return
    return mapPropsToFields({ initialValues })
  }
})
@createLanguageHoc
@autobind
export default class QCVNForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes
  }

  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
      measuringListSource: [],
      measuringOps: [],
      options: {},
      previewVisible: false
    }
  }

  async componentWillMount() {
    const measuringList = await CategoryApi.getMeasurings(
      { page: 1, itemPerPage: 100000 },
      {}
    )

    this.setState({
      measuringListSource: measuringList.data
    })
    if (this.props.initialValues) {
      let fileList = []
      this.setState({
        measuringList: this.props.initialValues.measuringList,
        options: this.props.initialValues.options
          ? this.props.initialValues.options
          : {},
        fileList: fileList
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
    this.props.form.validateFields((err, values) => {
      if (!values.measuringList) {
        const { t } = this.props.lang
        swal({
          title: t('stationAutoManager.addMeasuring.error'),
          type: 'error'
        })
        return
      }
      if (err) return
      const data = {
        key: values.key,
        name: values.name,
        measuringList: values.measuringList,
        options: this.state.options,
        numericalOrder: values.numericalOrder
      }
      // Callback submit form Container Component
      this.props.onSubmit(data)
    })
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
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
        sm: { span: 6, offset: 0 }
      },
      wrapperCol: {
        sm: { span: 17, offset: 0 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem {...formItemLayout} label={t('qcvn.form.key.label')}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: t('qcvn.form.key.error')
                  }
                ]
              })(
                <Input
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
                    message: t('qcvn.form.name.error')
                  }
                ]
              })(<Input placeholder={t('qcvn.form.name.placeholder')} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={t('qcvn.form.numericalOrder.label')}
            >
              {getFieldDecorator('numericalOrder', {
                rules: [{ required: true }]
              })(
                <InputNumberCell
                  editable={true}
                  size="small"
                  min={1}
                  max={1000000}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24} />
        </Row>

        <Row
          gutter={8}
          style={{
            display: 'none'
          }}
        />
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
                    unit: ''
                  }
                ]
          }
          measuringListSource={this.state.measuringListSource}
        />
        <FormItem>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            {t('addon.save')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}