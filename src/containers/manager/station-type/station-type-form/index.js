import React from 'react'
import { Form, Input, Button, Row, Col, Checkbox, Icon, Radio } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import SelectIcon from 'components/elements/select-icon-station-type'
import InputNumberCell from 'components/elements/input-number-cell'
import * as _ from 'lodash'
import { translate } from 'hoc/create-lang'

const i18n = {
  mode: translate('stationTypeManager.form.mode.label'),
  auto: translate('stationTypeManager.type.auto'),
  periodic: translate('stationTypeManager.type.periodic'),
}

const FormItem = Form.Item
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
      console.log(
        '🚀 ~ file: index.js ~ line 43 ~ StationTypeForm ~ this.props.form.validateFields ~ values',
        values
      )
      if (err) return
      const data = {
        key: values.key,
        name: values.name,
        isAuto: _.isUndefined(values.isAuto) ? false : values.isAuto,
        icon: this.state.urlIcon,
        color: this.state.color,
        numericalOrder: values.numericalOrder,
      }
      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
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

  async componentWillMount() {
    if (this.props.initialValues) {
      let updateState = {}
      if (this.props.initialValues.icon && this.props.initialValues.icon !== '')
        updateState.urlIcon = this.props.initialValues.icon
      if (this.props.initialValues.color)
        updateState.color = this.props.initialValues.color
      this.setState(updateState)
    }
  }

  onChangeIcon(iconObject) {
    this.setState({
      urlIcon: iconObject.urlIcon,
      color: iconObject.color,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { t } = this.props.lang
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

    console.log(t('stationTypeManage.form.key.error'))

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
                    message: t('stationTypeManager.form.name.error'),
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder={t('stationTypeManager.form.name.label')}
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
            <FormItem {...formItemLayout} label={i18n.mode}>
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
                  <Radio value={false}>{i18n.periodic}</Radio>
                  <Radio value={true}>{i18n.auto}</Radio>
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
