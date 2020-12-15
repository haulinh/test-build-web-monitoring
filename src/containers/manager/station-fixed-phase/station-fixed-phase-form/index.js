import React from 'react'
import { Form, Input, Button, Row, Col, Icon } from 'antd'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { mapPropsToFields } from 'utils/form'
import createLanguageHoc, { langPropTypes } from 'hoc/create-lang'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import SelectStationType from 'components/elements/select-station-type-v2'

const FormItem = Form.Item
@Form.create({
  mapPropsToFields: mapPropsToFields,
})
@createLanguageHoc
@autobind
export default class StationFixedPhaseForm extends React.PureComponent {
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
        key: values.key.trim(),
        name: values.name.trim(),
        stationTypeId: values.stationTypeId,
      }

      // Callback submit form Container Component
      const res = await this.props.onSubmit(data)
      if (res && res.status ) {
        if (res.data.error.message === 'PHASE_ALREADY_EXISTS') {
          this.props.form.setFields({
            key: {
              value: values.key,
              errors: [
                new Error(
                  this.props.lang.t('stationFixedPhase.create.keyExisted')
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
    // console.log(t('stationTypeManage.form.key.error'))

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem label={t('stationFixedPhase.form.key.label')}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: t('stationFixedPhase.form.key.required'),
                  },
                  {
                    pattern: PATTERN_KEY,
                    message: t('stationFixedPhase.form.key.pattern'),
                  },
                  {
                    max: 64,
                    message: t('stationFixedPhase.form.key.max'),
                  },
                ],
              })(
                <Input
                  disabled={this.props.isEdit ? true : false}
                  size="large"
                  placeholder={t('stationFixedPhase.form.key.label')}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label={t('stationFixedPhase.form.name.label')}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: t('stationFixedPhase.form.name.required'),
                  },
                  {
                    pattern: PATTERN_NAME,
                    message: t('stationFixedPhase.form.name.pattern'),
                  },
                  {
                    max: 64,
                    message: t('stationFixedPhase.form.name.max'),
                  },
                ],
              })(
                <Input
                  size="large"
                  placeholder={t('stationFixedPhase.form.name.placeholder')}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem label={t('stationFixedPhase.form.stationType.label')}>
              {getFieldDecorator('stationTypeId', {
                rules: [
                  {
                    required: true,
                    message: t('stationFixedPhase.form.stationType.required'),
                  },
                ],
              })(
                <SelectStationType
                  isAuto={false}
                  size="large"
                  label={t('stationAutoManager.form.stationType.label')}
                  placeholder={t(
                    'stationFixedPhase.form.stationType.placeholder'
                  )}
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
