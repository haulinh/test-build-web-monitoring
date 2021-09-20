import { Button, Col, DatePicker, Form, Input, InputNumber, Row } from 'antd'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { BoxShadow, Clearfix, FormItem } from 'components/layouts/styles'
import { PATTERN_KEY } from 'constants/format-string'
import createLanguageHoc, { translate } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { getTimeUTC } from 'utils/datetime'
import MeasuringList from './MeasuringList'

function i18n() {
  return {
    save: translate('addon.save'),
    keyExisted: translate('billing.create.keyExisted'),
    key: {
      label: translate('billing.label.key'),
      placeholder: translate('billing.placeholder.key'),
      required: translate('billing.required.key'),
      pattern: translate('billing.pattern'),
      max: translate('billing.max'),
    },
    name: {
      label: translate('billing.label.name'),
      placeholder: translate('billing.placeholder.name'),
      required: translate('billing.required.name'),
      max: translate('billing.max'),
    },
    fixedFee: {
      label: translate('billing.label.fixedFee'),
      placeholder: translate('billing.placeholder.fixedFee'),
      required: translate('billing.required.fixedFee'),
    },
    flowKey: {
      label: translate('billing.label.flowKey'),
      placeholder: translate('billing.placeholder.flowKey'),
    },
    timeStart: {
      label: translate('billing.label.timeStart'),
      placeholder: translate('billing.placeholder.timeStart'),
      required: translate('billing.required.timeStart'),
    },
    timeEnd: {
      label: translate('billing.label.timeEnd'),
      placeholder: translate('billing.placeholder.timeEnd'),
      required: translate('billing.required.timeEnd'),
    },
    note: {
      label: translate('billing.label.note'),
      placeholder: translate('billing.placeholder.note'),
    },
  }
}

const Fields = {
  name: 'name',
  key: 'key',
  fixedFee: 'fixedFee',
  flowKey: 'flowKey',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  note: 'note',
  measuringList: 'measuringList',
}

@Form.create({})
@createLanguageHoc
export default class ConfigForm extends React.Component {
  state = {
    measuringList: [],
  }
  handleSubmit = async e => {
    e.preventDefault()
    const { form, onSubmit } = this.props
    const values = await form.validateFields()
    const measuringList = values.measuringList.map(measure => {
      const { rowKey, ...newMeasure } = measure
      return newMeasure
    })

    const params = {
      ...values,
      measuringList,
      timeStart: values.timeStart && getTimeUTC(values.timeStart),
      timeEnd: values.timeEnd && getTimeUTC(values.timeEnd),
    }

    if (onSubmit) {
      onSubmit(params)
    }
  }

  componentDidMount = () => {
    const { initialValues } = this.props
    if (initialValues) {
      const { setFieldsValue } = this.props.form
      console.log({ initialValues })

      setFieldsValue(
        _.pick(initialValues, [
          Fields.key,
          Fields.name,
          Fields.fixedFee,
          Fields.note,
          Fields.flowKey,
          Fields.measuringList,
        ])
      )

      if (initialValues.timeStart)
        setFieldsValue({ [Fields.timeStart]: moment(initialValues.timeStart) })
      if (initialValues.timeEnd)
        setFieldsValue({ [Fields.timeEnd]: moment(initialValues.timeEnd) })
    }
  }

  onFetchMeasuringListSuccess = measuringList => {
    this.setState({ measuringList })
  }

  render() {
    const { form } = this.props
    const { measuringList } = this.state

    return (
      <Form onSubmit={this.handleSubmit}>
        <Clearfix height={36} />
        <BoxShadow>
          <Row gutter={32}>
            <Col span={8}>
              <FormItem label={i18n().key.label}>
                {form.getFieldDecorator(Fields.key, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: i18n().key.required,
                    },
                    {
                      pattern: PATTERN_KEY,
                      message: i18n().key.pattern,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={i18n().name.label}>
                {form.getFieldDecorator(Fields.name, {
                  rules: [
                    {
                      required: true,
                      message: i18n().name.required,
                    },
                    {
                      max: 64,
                      message: i18n().key.max,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={i18n().fixedFee.label}>
                {form.getFieldDecorator(Fields.fixedFee, {
                  rules: [
                    {
                      required: true,
                      message: i18n().fixedFee.required,
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={32}>
            <Col span={8}>
              <FormItem label={i18n().flowKey.label}>
                {form.getFieldDecorator(Fields.flowKey)(
                  <SelectMeasureParameter
                    mode="default"
                    measuringList={measuringList}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={i18n().timeStart.label}>
                {form.getFieldDecorator(Fields.timeStart, {
                  rules: [
                    {
                      required: true,
                      message: i18n().timeStart.required,
                    },
                  ],
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={i18n().timeEnd.label}>
                {form.getFieldDecorator(Fields.timeEnd)(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <FormItem label={i18n().note.label}>
                {form.getFieldDecorator(Fields.note)(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </BoxShadow>

        <Clearfix height={36} />

        <BoxShadow>
          {form.getFieldDecorator(Fields.measuringList)(
            <MeasuringList
              onFetchMeasuringListSuccess={this.onFetchMeasuringListSuccess}
            />
          )}
        </BoxShadow>

        <Clearfix height={36} />

        <Button style={{ width: '100%' }} type="primary" htmlType="submit">
          {i18n().save}
        </Button>
      </Form>
    )
  }
}
