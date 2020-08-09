import React from 'react'
import { Row, Col, Form, Input, InputNumber, Button } from 'antd'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import swal from 'sweetalert2'
import SamplingAPI from 'api/SamplingApi'

const FormItem = Form.Item

const i18n = {
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
  alertSaveConfigError: translate('alert.error.monitoring.saveSampingConfig'),
}

@Form.create()
export default class SqlConfig extends React.Component {
  static propTypes = {
    stationID: PropTypes.string.isRequired,
    configSampling: PropTypes.object.isRequired,
    checkErr: PropTypes.func.isRequired,
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

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ isSaving: true })
    const { stationId } = this.props
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        this.setState({ isSaving: false })
        swal({ title: i18n.alertSaveConfigError, type: 'error' })
        return
      }

      try {
        SamplingAPI.updateConfig(stationId, {
          configSampling: {
            ...values,
            // protocol: "SQL"
          },
        })
        this.setState({ isSaving: false })
        swal({ title: i18n.alertSuccess, type: 'success' })
      } catch (error) {
        console.error(
          error,
          '========Lỗi handleSubmit SamplingConfig sql========== '
        )
        this.setState({ isSaving: false })
        swal({ title: '', type: 'error' })
      }
    })
  }
  render() {
    const { STATUS_SAMPLING, isConfig, isScheduled } = this.props
    const { isSaving } = this.state
    const {
      totalBottles,
      controlTagName,
      timeToTakeOneBottle,
      status,
    } = this.props.configSampling
    const { getFieldDecorator } = this.props.form
    const isSampling = isConfig && status !== STATUS_SAMPLING.READY

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Row>
              <FormItem
                label={i18n.totalBottles}
                validateStatus={
                  this.props.checkErr('totalBottles') ? 'error' : ''
                }
                help={this.props.checkErr('totalBottles') || ''}
              >
                {getFieldDecorator('totalBottles', {
                  rules: [
                    {
                      required: true,
                      min: 1,
                      type: 'integer',
                      message: i18n.alertNull,
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
              <FormItem
                label={i18n.controlTagName}
                validateStatus={
                  this.props.checkErr('controlTagName') ? 'error' : ''
                }
                help={this.props.checkErr('controlTagName') || ''}
              >
                {getFieldDecorator('controlTagName', {
                  rules: [{ required: true, message: i18n.alertNull }],
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
              <FormItem
                label={i18n.timeToTakeOneBottle}
                validateStatus={
                  this.props.checkErr('timeToTakeOneBottle') ? 'error' : ''
                }
                help={this.props.checkErr('timeToTakeOneBottle') || ''}
              >
                {getFieldDecorator('timeToTakeOneBottle', {
                  rules: [
                    {
                      required: true,
                      min: 1,
                      type: 'integer',
                      message: i18n.alertNull,
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
            <Button block type="primary" loading={isSaving} htmlType="submit">
              {i18n.save}
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
