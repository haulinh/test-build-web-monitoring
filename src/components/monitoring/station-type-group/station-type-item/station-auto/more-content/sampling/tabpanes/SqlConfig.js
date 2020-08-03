import React from 'react'
import { Row, Col, Form, Input, InputNumber, Button } from 'antd'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'



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
        checkErr: PropTypes.func.isRequired
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
        samplingProtocol: 'MODBUS'
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
        const {
            getFieldDecorator,
            getFieldsError,
            isFieldsTouched,
        } = this.props.form
        const isSampling = isConfig && status !== STATUS_SAMPLING.READY

        return (
            <Form onSubmit={this.props.handleSubmit}>
                <Row>
                    <Col>
                        <Row>
                            <FormItem
                                label={i18n.totalBottles}
                                validateStatus={this.props.checkErr('totalBottles') ? 'error' : ''}
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
                        <Button
                            block
                            type="primary"
                            loading={isSaving}
                            disabled={
                                (hasErrors(getFieldsError()) && isFieldsTouched()) ||
                                isSampling ||
                                isScheduled
                            }
                            htmlType="submit"
                        >
                            {i18n.save}
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field])
}
