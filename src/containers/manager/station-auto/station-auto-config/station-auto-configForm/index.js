import React from 'react'
import {
  Form,
  Input,
  Row,
  Col,
  Table,
  InputNumber,
  // Button,
  Select,
  message,
  Radio,
} from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { get } from 'lodash'
// import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import FtpApi from 'api/FtpApi'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

@Form.create({
  //mapPropsToFields: mapPropsToFields
})
@createLanguageHoc
@autobind
export default class StationAutoForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    lang: langPropTypes,
    measuringListSource: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
      path: '',
      mesureSourceData: [],
    }
    const { t } = this.props.lang
    const { getFieldDecorator } = this.props.form
    const styleFormItem = {
      style: {
        marginBottom: 0,
      },
    }
    this.columns = [
      {
        dataIndex: 'key',
        title: t('stationAutoManager.config.measuringDes.label'),
        render: (text, record, index) => (
          <FormItem {...styleFormItem}>
            {getFieldDecorator(`measuringList[${index}].measuringDes`, {
              initialValue: text,
              rules: [
                {
                  message: t('stationAutoManager.config.measuringDes.error'),
                },
              ],
            })(<span>{text}</span>)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'measuringSrc',
        title: t('stationAutoManager.config.measuringSrc.label'),
        render: (text, record, index) => {
          return (
            <FormItem {...styleFormItem}>
              {getFieldDecorator(`measuringList[${index}].measuringSrc`, {
                initialValue: this.initialValueMeasuringSrc(record.key),
                rules: [
                  {
                    message: t('stationAutoManager.config.measuringSrc.error'),
                  },
                ],
              })(
                // <Input
                //   placeholder={t(
                //     'stationAutoManager.config.measuringDes.placeholder'
                //   )}
                // />
                <Select mode="combobox">
                  {this.state.mesureSourceData.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )
        },
      },
      {
        dataIndex: 'ratio',
        title: t('stationAutoManager.config.ratio.label'),
        render: (text, record, index) => {
          return (
            <FormItem {...styleFormItem}>
              {getFieldDecorator(`measuringList[${index}].ratio`, {
                initialValue: this.initialValueRatio(record.key),
                rules: [
                  {
                    required: true,
                    message: t('stationAutoManager.config.ratio.error'),
                  },
                ],
              })(<InputNumber />)}
            </FormItem>
          )
        },
      },
    ]
  }

  initialValueMeasuringSrc(measuringDes) {
    let res = this.props.initialValues.measuringList.find(
      item => item.measuringDes === measuringDes
    )
    return res ? res.measuringSrc : ''
  }

  initialValueRatio(measuringDes) {
    let res = this.props.initialValues.measuringList.find(
      item => item.measuringDes === measuringDes
    )
    return res ? res.ratio : 1
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      const data = {
        fileName: values.fileName,
        path: values.path,
        measuringList: values.measuringList.filter(
          item => item.measuringDes && item.measuringDes !== ''
        ),
      }
      // Callback submit form Container Component
      this.props.onSubmit(data)
    })
  }

  async loadSourceParameter() {
    const { getFieldValue, setFieldsValue } = this.props.form
    const { t } = this.props.lang
    const fileName = getFieldValue('fileName')
    const path = this.props.initialValues.path
    if (fileName && path) {
      let res = await FtpApi.readFileTheMostRecent(fileName, path)
      if (res.success && res.data) {
        let data = this.anylizeData(res.data)
        if (data)
          this.setState({ mesureSourceData: data }, () => {
            getFieldValue('measuringList').map((item, index) => {
              let measureFinded = this.state.mesureSourceData.find(
                i => i.toUpperCase() === item.measuringDes.toUpperCase()
              )
              if (measureFinded)
                setFieldsValue({
                  [`measuringList[${index}].measuringSrc`]: measureFinded,
                })
              return item
            })
          })
      }
    } else {
      message.warning(t('stationAutoManager.config.errorLoadFile'))
    }
  }

  anylizeData(data) {
    return data.split('\n').map((item, key) => {
      return item.replace(/\s/g, ' ').split(' ')[0]
    })
  }

  onPress = e => {
    e.preventDefault()
    this.props.onPress(this.props.form)
  }

  render() {
    console.log(this.props.initialValues, 'ououououou')
    const { getFieldDecorator } = this.props.form
    const { t } = this.props.lang
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
        lg: { span: 5 },
        xl: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 16 },
        lg: { span: 19 },
        xl: { span: 21 },
      },
    }

    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItem label={t('stationAutoManager.config.fileName.label')}>
            <Row gutter={8} type="flex">
              <Col span={12}>
                {getFieldDecorator('fileName', {
                  initialValue: get(this.props, 'initialValues.fileName', ''),
                  rules: [
                    {
                      required: true,
                      message: t('stationAutoManager.config.fileName.label'),
                    },
                  ],
                })(
                  <Input
                    placeholder={t(
                      'stationAutoManager.config.fileName.placeholder'
                    )}
                  />
                )}
              </Col>
              {/* <Col>
                <Button type="primary" onClick={this.loadSourceParameter}>
                  {t('stationAutoManager.config.buttonLoadSourceParameter')}
                </Button>
              </Col> */}
            </Row>
          </FormItem>
          <FormItem label={t('stationAutoManager.config.extensionFile')}>
            {getFieldDecorator('extensionFile', {
              initialValue: get(
                this.props,
                'initialValues.extensionFile',
                'txt'
              ),
            })(
              <RadioGroup>
                <Radio value="txt">.TXT</Radio>
                <Radio value="csv">.CSV</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <Table
            rowKey={record => record.key}
            bordered
            dataSource={
              this.props.measuringListSource && this.props.measuringListSource
            }
            columns={this.columns}
            pagination={{ pageSize: 1000, hideOnSinglePage: true }}
          />
        </Form>
      </div>
    )
  }
}
