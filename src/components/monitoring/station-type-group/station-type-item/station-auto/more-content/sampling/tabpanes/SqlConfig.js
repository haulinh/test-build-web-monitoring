import { Col, Form, Input, InputNumber, Row } from 'antd'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import React from 'react'

const FormItem = Form.Item

function i18n() {
  return {
    totalBottles: translate(
      'monitoring.moreContent.sampling.content.config.totalBottles'
    ),
    controlTagName: translate(
      'monitoring.moreContent.sampling.content.config.controlTagName'
    ),
    timeToTakeOneBottle: translate(
      'monitoring.moreContent.sampling.content.config.timeToTakeOneBottle'
    ),
    save: translate('monitoring.moreContent.sampling.content.config.save'),
    alertNull: translate('error.nullValue'),
    alertSuccess: translate('success.text'),
    alertError: translate('error.text'),
    alertSaveConfigError: translate('error.monitoring.saveSampingConfig'),
  }
}

export default class SqlConfig extends React.Component {
  static propTypes = {
    stationID: PropTypes.string.isRequired,
    configSampling: PropTypes.object.isRequired,
  }

  static defaultProps = {
    stationID: '',
    configSampling: {
      totalBottles: 1,
      controlTagName: '',
      timeToTakeOneBottle: 1,
    },
  }

  state = {
    isSaving: false,
  }

  render() {
    const { STATUS_SAMPLING, isConfig, isScheduled } = this.props
    const {
      totalBottles,
      controlTagName,
      timeToTakeOneBottle,
      status,
    } = this.props.configSampling
    const { getFieldDecorator } = this.props.form
    const isSampling = isConfig && status !== STATUS_SAMPLING.READY

    return (
      <Form>
        <Row>
          <Col>
            <Row>
              <FormItem label={i18n().totalBottles}>
                {getFieldDecorator('totalBottles', {
                  rules: [
                    {
                      required: true,
                      min: 1,
                      type: 'integer',
                      message: i18n().alertNull,
                    },
                  ],
                  initialValue: totalBottles,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={isSampling || isScheduled}
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label={i18n().controlTagName}>
                {getFieldDecorator('controlTagName', {
                  rules: [{ required: true, message: i18n().alertNull }],
                  initialValue: controlTagName,
                })(
                  <Input
                    style={{ width: '100%' }}
                    disabled={isSampling || isScheduled}
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label={i18n().timeToTakeOneBottle}>
                {getFieldDecorator('timeToTakeOneBottle', {
                  rules: [
                    {
                      required: true,
                      min: 1,
                      type: 'integer',
                      message: i18n().alertNull,
                    },
                  ],
                  initialValue: timeToTakeOneBottle,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={isSampling || isScheduled}
                  />
                )}
              </FormItem>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}
