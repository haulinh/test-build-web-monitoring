import React from 'react'
import { Form, Input, Row, Col, InputNumber, Button } from 'antd'
import PropTypes from 'prop-types'
import * as _ from 'lodash'

/** */
import { translate } from 'hoc/create-lang'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import SelectStationType from 'components/elements/select-station-type-v2'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import MeasuringList from './measuring-list'

const FormItem = Form.Item

const i18n = {
  save: translate('addon.save'),
  keyExisted: translate('stationFixedPoint.create.keyExisted'),
  key: {
    label: translate('stationFixedPoint.form.key.label'),
    placeholder: translate('stationFixedPoint.form.key.placeholder'),
    required: translate('stationFixedPoint.form.key.required'),
    pattern: translate('stationFixedPoint.form.key.pattern'),
    max: translate('stationFixedPoint.form.key.max'),
  },
  name: {
    label: translate('stationFixedPoint.form.name.label'),
    placeholder: translate('stationFixedPoint.form.name.placeholder'),
    required: translate('stationFixedPoint.form.name.required'),
    pattern: translate('stationFixedPoint.form.name.pattern'),
    max: translate('stationFixedPoint.form.name.max'),
  },
  stationType: {
    label: translate('stationFixedPoint.form.stationType.label'),
    placeholder: translate('stationFixedPoint.form.stationType.placeholder'),
    required: translate('stationFixedPoint.form.stationType.required'),
  },
  qcvn: {
    label: translate('stationFixedPoint.form.qcvn.label'),
    placeholder: translate('stationFixedPoint.form.qcvn.placeholder'),
  },
  lat: {
    label: translate('stationFixedPoint.form.lat.label'),
    placeholder: translate('stationFixedPoint.form.lat.placeholder'),
    required: translate('stationFixedPoint.form.lat.required'),
  },
  lng: {
    label: translate('stationFixedPoint.form.long.label'),
    placeholder: translate('stationFixedPoint.form.long.placeholder'),
    required: translate('stationFixedPoint.form.long.required'),
  },
  address: {
    label: translate('stationFixedPoint.form.address.label'),
    placeholder: translate('stationFixedPoint.form.address.placeholder'),
  },
  note: {
    label: translate('stationFixedPoint.form.note.label'),
    placeholder: translate('stationFixedPoint.form.note.placeholder'),
  },
  measuringList: {
    required: translate('stationFixedPoint.form.measuringList.required'),
  },
}
const Fields = {
  key: 'key',
  name: 'name',
  stationTypeId: 'stationTypeId',
  lng: 'lng',
  lat: 'lat',
  address: 'address',
  note: 'note',
  measuringList: 'measuringList',
  qcvnId: 'qcvnId',
}
@Form.create({})
export default class StationFixedForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    initialValues: PropTypes.object,
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      // console.log('--error--', err)
      // console.log('--values--', values)
      if (err) return
      const data = {
        ...values,
        mapLocation: {
          lat: values.lat,
          lng: values.lng,
        },
      }
      const res = await this.props.onSubmit(data)
      if (res && res.status) {
        if (res.data.error.message === 'ALREADY_EXISTS') {
          this.props.form.setFields({
            key: {
              value: values.key,
              errors: [new Error(i18n.keyExisted)],
            },
          })
        }
      }
    })
  }
  validateMeasuringList = (rule, value, callback) => {
    const errorArr = _.map(value, item => {
      let isBound = false
      if (item.key) {
        let strItem = item.name
        if (item.minLimit && item.maxLimit && item.minLimit > item.maxLimit) {
          strItem = _.concat(strItem, ' -- [Giới hạn vượt ngưỡng: Min > Max]')
          isBound = true
        }
        if (item.minTend && item.maxTend && item.minTend > item.maxTend) {
          strItem = _.concat(strItem, ' -- [Chuẩn bị vượt ngưỡng: Min > Max]')
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

  componentDidMount = () => {
    console.log(this.props.initialValues, '--componentDidMount--')
    if (this.props.initialValues) {
      const { setFieldsValue } = this.props.form
      if (_.get(this.props.initialValues, 'mapLocation', null)) {
        this.props.initialValues.lat = this.props.initialValues.mapLocation.lat
        this.props.initialValues.lng = this.props.initialValues.mapLocation.lng
      }
      setFieldsValue(this.props.initialValues)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        sm: { span: 6, offset: 0 },
      },
      wrapperCol: {
        sm: { span: 18, offset: 0 },
      },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.key.label}>
              {getFieldDecorator(Fields.key, {
                rules: [
                  {
                    required: true,
                    whitespace: true,
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
                  disabled={this.props.isEdit ? true : false}
                  placeholder={i18n.key.placeholder}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.name.label}>
              {getFieldDecorator(Fields.name, {
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
                  disabled={this.props.isEdit ? true : false}
                  placeholder={i18n.name.placeholder}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.stationType.label}>
              {getFieldDecorator(Fields.stationTypeId, {
                rules: [
                  {
                    required: true,
                    message: i18n.stationType.required,
                  },
                ],
              })(
                <SelectStationType
                  isAuto={false}
                  placeholder={i18n.stationType.placeholder}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.qcvn.label}>
              {getFieldDecorator(Fields.qcvnId)(
                <SelectQCVN placeholder={i18n.qcvn.placeholder} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.lng.label}>
              {getFieldDecorator(Fields.lng, {
                rules: [
                  {
                    required: true,
                    message: i18n.lng.required,
                  },
                ],
              })(
                <InputNumber
                  style={{ flex: 1, width: '100%' }}
                  placeholder={i18n.lng.placeholder}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.lat.label}>
              {getFieldDecorator(Fields.lat, {
                rules: [
                  {
                    required: true,
                    message: i18n.lat.required,
                  },
                ],
              })(
                <InputNumber
                  style={{ flex: 1, width: '100%' }}
                  placeholder={i18n.lat.placeholder}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              labelCol={{
                sm: { span: 3, offset: 0 },
              }}
              wrapperCol={{
                sm: { span: 21, offset: 0 },
              }}
              label={i18n.address.label}
            >
              {getFieldDecorator(Fields.address)(
                <Input
                  style={{ flex: 1, width: '100%' }}
                  placeholder={i18n.lat.address}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              labelCol={{
                sm: { span: 3, offset: 0 },
              }}
              wrapperCol={{
                sm: { span: 21, offset: 0 },
              }}
              label={i18n.note.label}
            >
              {getFieldDecorator('note')(
                <Input
                  style={{ flex: 1, width: '100%' }}
                  placeholder={i18n.note.placeholder}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator(Fields.measuringList, {
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
            size="large"
          >
            {i18n.save}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
