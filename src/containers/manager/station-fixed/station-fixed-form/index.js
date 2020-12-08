import React from 'react'
import { Form, Input, Row, Col, InputNumber } from 'antd'

/** */
import { translate } from 'hoc/create-lang'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import SelectStationType from 'components/elements/select-station-type'
import SelectQCVN from 'components/elements/select-qcvn'

const FormItem = Form.Item

const i18n = {
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
  },
  long: {
    label: translate('stationFixedPoint.form.long.label'),
    placeholder: translate('stationFixedPoint.form.long.placeholder'),
  },
  address: {
    label: translate('stationFixedPoint.form.address.label'),
    placeholder: translate('stationFixedPoint.form.address.placeholder'),
  },
  note: {
    label: translate('stationFixedPoint.form.note.label'),
    placeholder: translate('stationFixedPoint.form.note.placeholder'),
  },
}
@Form.create({})
export default class StationFixedForm extends React.Component {
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
      <Form
      //   onSubmit={this.handleSubmit}
      >
        <Row gutter={12}>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.key.label}>
              {getFieldDecorator('key', {
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
              {getFieldDecorator('stationTypeId', {
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
              {getFieldDecorator('qcvnId')(
                <SelectQCVN placeholder={i18n.qcvn.placeholder} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.long.label}>
              {getFieldDecorator('long')(
                <InputNumber
                  style={{ flex: 1, width: '100%' }}
                  placeholder={i18n.long.placeholder}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={i18n.lat.label}>
              {getFieldDecorator('lat')(
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
              {getFieldDecorator('address')(
                <InputNumber
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
                <InputNumber
                  style={{ flex: 1, width: '100%' }}
                  placeholder={i18n.note.placeholder}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
