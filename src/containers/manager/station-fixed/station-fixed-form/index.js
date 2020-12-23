import React from 'react'
import { Form, Input, Row, Col, InputNumber, Button, Collapse } from 'antd'
import PropTypes from 'prop-types'
import * as _ from 'lodash'

/** */
import Clearfix from 'components/elements/clearfix'
import InputPhoneNumber from 'components/elements/input-phone-number'
import { translate } from 'hoc/create-lang'
import { PATTERN_KEY, PATTERN_NAME } from 'constants/format-string'
import SelectStationType from 'components/elements/select-station-type-v2'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import SelectProvince from 'components/elements/select-province'
import MeasuringList from './measuring-list'

const FormItem = Form.Item
const { TextArea } = Input
const { Panel } = Collapse

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
    format: translate('stationFixedPoint.form.lat.format'),
  },
  lng: {
    label: translate('stationFixedPoint.form.long.label'),
    placeholder: translate('stationFixedPoint.form.long.placeholder'),
    required: translate('stationFixedPoint.form.long.required'),
    format: translate('stationFixedPoint.form.long.format'),
  },
  provinceId: {
    label: translate('stationFixedPoint.form.provinceId.label'),
    placeholder: translate('stationFixedPoint.form.provinceId.placeholder'),
  },
  position: {
    label: translate('stationFixedPoint.form.position.label'),
    placeholder: translate('stationFixedPoint.form.position.placeholder'),
    max: translate('stationFixedPoint.form.position.max'),
  },
  address: {
    label: translate('stationFixedPoint.form.address.label'),
    placeholder: translate('stationFixedPoint.form.address.placeholder'),
    max: translate('stationFixedPoint.form.address.max'),
  },
  note: {
    label: translate('stationFixedPoint.form.note.label'),
    placeholder: translate('stationFixedPoint.form.note.placeholder'),
  },
  measuringList: {
    required: translate('stationFixedPoint.form.measuringList.required'),
    validate1: translate('stationFixedPoint.form.measuringList.validate1'),
    validate2: translate('stationFixedPoint.form.measuringList.validate2'),
    validate3: translate('stationFixedPoint.form.measuringList.validate3'),
    validate4: translate('stationFixedPoint.form.measuringList.validate4'),
  },

  panel1: translate('stationAutoManager.form.panel1'),
  panel2: translate('stationAutoManager.form.panel2'),
  website: {
    label: translate('stationFixedPoint.form.website.label'),
    placeholder: translate('stationFixedPoint.form.website.placeholder'),
  },
  yearOperate: {
    label: translate('stationFixedPoint.form.yearOperate.label'),
    placeholder: translate('stationFixedPoint.form.yearOperate.placeholder'),
  },
  userResponsible: {
    label: translate('stationFixedPoint.form.userResponsible.label'),
    placeholder: translate(
      'stationFixedPoint.form.userResponsible.placeholder'
    ),
  },
  userSupervisor: {
    label: translate('stationFixedPoint.form.userSupervisor.label'),
    placeholder: translate('stationFixedPoint.form.userSupervisor.placeholder'),
  },
  phoneResponsible: {
    label: translate('stationFixedPoint.form.phoneResponsible.label'),
    placeholder: translate(
      'stationFixedPoint.form.phoneResponsible.placeholder'
    ),
  },
  phoneSupervisor: {
    label: translate('stationFixedPoint.form.phoneSupervisor.label'),
    placeholder: translate(
      'stationFixedPoint.form.phoneSupervisor.placeholder'
    ),
  },
  irrigationArea: {
    label: translate('stationFixedPoint.form.irrigationArea.label'),
    placeholder: translate('stationFixedPoint.form.irrigationArea.placeholder'),
  },
  purposeUsed: {
    label: translate('stationFixedPoint.form.purposeUsed.label'),
    placeholder: translate('stationFixedPoint.form.purposeUsed.placeholder'),
  },
  lakeCapacity: {
    label: translate('stationFixedPoint.form.lakeCapacity.label'),
    placeholder: translate('stationFixedPoint.form.lakeCapacity.placeholder'),
  },
  catchmentArea: {
    label: translate('stationFixedPoint.form.catchmentArea.label'),
    placeholder: translate('stationFixedPoint.form.catchmentArea.placeholder'),
  },
}
const Fields = {
  key: 'key',
  name: 'name',
  stationTypeId: 'stationTypeId',
  lng: 'lng',
  lat: 'lat',
  provinceId: 'provinceId',
  position: 'position',
  address: 'address',
  note: 'note',
  measuringList: 'measuringList',
  qcvnId: 'qcvnId',
  website: 'website',
  yearOperate: 'yearOperate',
  userResponsible: 'userResponsible',
  userSupervisor: 'userSupervisor',
  phoneResponsible: 'phoneResponsible',
  phoneSupervisor: 'phoneSupervisor',
  irrigationArea: 'irrigationArea',
  purposeUsed: 'purposeUsed',
  lakeCapacity: 'lakeCapacity',
  catchmentArea: 'catchmentArea',
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
      console.log('--values--', values)
      if (err) return
      const data = {
        ..._.omit(values,['lat','lng']),
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
          strItem = _.concat(strItem, ` -- ${i18n.measuringList.validate1}`)
          isBound = true
        }
        if (item.minTend && item.maxTend && item.minTend > item.maxTend) {
          strItem = _.concat(strItem, ` -- ${i18n.measuringList.validate2}`)
          isBound = true
        }
        if (item.minLimit && item.minTend && item.minLimit > item.minTend) {
          strItem = _.concat(strItem, ` -- ${i18n.measuringList.validate3}`)
          isBound = true
        }
        if (item.maxLimit && item.maxTend && item.maxLimit < item.maxTend) {
          strItem = _.concat(strItem, ` -- ${i18n.measuringList.validate4}`)
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
        <Clearfix height={16} />
        <Collapse
          // onChange={this.handleChange}
          // activeKey={this.state.tabKey}
          defaultActiveKey={['2']}
        >
          <Panel header={i18n.panel1} key="1">
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
                  })(<Input placeholder={i18n.name.placeholder} />)}
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
                      disabled={this.props.isEdit ? true : false}
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
                      {
                        type: 'number',
                        max: 180,
                        min: -180,
                        message: i18n.lng.format,
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
                      {
                        type: 'number',
                        max: 90,
                        min: -90,
                        message: i18n.lat.format,
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
              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.provinceId.label}>
                  {getFieldDecorator(
                    Fields.provinceId,
                    {}
                  )(
                    <SelectProvince
                      isUsedId={true}
                      placeholder={i18n.provinceId.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.position.label}>
                  {getFieldDecorator(Fields.position, {
                    rules: [
                      {
                        max: 64,
                        message: i18n.position.max,
                      },
                    ],
                  })(
                    <Input
                      style={{ flex: 1, width: '100%' }}
                      placeholder={i18n.position.placeholder}
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
                  {getFieldDecorator(Fields.address, {
                    rules: [
                      {
                        max: 256,
                        message: i18n.address.max,
                      },
                    ],
                  })(
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
                    <TextArea
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
          </Panel>
          <Panel header={i18n.panel2} key="2">
            <Row gutter={12}>
              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.website.label}>
                  {getFieldDecorator(Fields.website, {
                    rules: [
                      {
                        max: 64,
                        message: i18n.name.max,
                      },
                    ],
                  })(<Input placeholder={i18n.website.placeholder} />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.yearOperate.label}>
                  {getFieldDecorator(Fields.yearOperate, {
                    rules: [],
                  })(
                    <InputNumber
                      style={{ flex: 1, width: '100%' }}
                      placeholder={i18n.yearOperate.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={i18n.userResponsible.label}
                >
                  {getFieldDecorator(Fields.userResponsible, {
                    rules: [
                      {
                        max: 64,
                        message: i18n.name.max,
                      },
                    ],
                  })(<Input placeholder={i18n.userResponsible.placeholder} />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={i18n.phoneResponsible.label}
                >
                  {getFieldDecorator(Fields.phoneResponsible, {
                    rules: [],
                  })(
                    <InputPhoneNumber
                      size="medium"
                      placeholder={i18n.phoneResponsible.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.userSupervisor.label}>
                  {getFieldDecorator(Fields.userSupervisor, {
                    rules: [
                      {
                        max: 64,
                        message: i18n.name.max,
                      },
                    ],
                  })(<Input placeholder={i18n.userSupervisor.placeholder} />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={i18n.phoneSupervisor.label}
                >
                  {getFieldDecorator(Fields.phoneSupervisor, {
                    rules: [],
                  })(
                    <InputPhoneNumber
                      size="medium"
                      placeholder={i18n.phoneSupervisor.placeholder}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.purposeUsed.label}>
                  {getFieldDecorator(Fields.purposeUsed, {
                    rules: [
                      {
                        max: 64,
                        message: i18n.name.max,
                      },
                    ],
                  })(<Input placeholder={i18n.purposeUsed.placeholder} />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.irrigationArea.label}>
                  {getFieldDecorator(Fields.irrigationArea, {
                    rules: [],
                  })(<Input placeholder={i18n.irrigationArea.placeholder} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.lakeCapacity.label}>
                  {getFieldDecorator(Fields.lakeCapacity, {
                    rules: [
                      {
                        max: 64,
                        message: i18n.name.max,
                      },
                    ],
                  })(<Input placeholder={i18n.lakeCapacity.placeholder} />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem {...formItemLayout} label={i18n.catchmentArea.label}>
                  {getFieldDecorator(Fields.catchmentArea, {
                    rules: [],
                  })(<Input placeholder={i18n.catchmentArea.placeholder} />)}
                </FormItem>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Clearfix height={16} />
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
