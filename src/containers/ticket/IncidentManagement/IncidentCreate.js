import { Button, Form, Input, message, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import CalculateApi from 'api/CalculateApi'
import SelectIncidentType from 'components/elements/select-data/ticket/SelectIncidentType'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { Flex, FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import React, { Component } from 'react'
import { FixedBottom, ILLDrawer } from '../Component'
import { Fields, i18n } from './index'
import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'

const TextAreaCustom = styled(TextArea)`
  > textarea {
    resize: none;
  }
`

@Form.create()
export default class IncidentCreate extends Component {
  state = {
    stationAutos: [],
    isSubmitted: false,
    isModalVisible: false,
  }

  isHaveSelectStation = () => {
    const { form } = this.props
    const incidentType = form.getFieldValue(Fields.type)
    return incidentType !== 'default'
  }

  isHaveSelectMeasureParameter = () => {
    const { form } = this.props
    const incidentType = form.getFieldValue(Fields.type)
    return incidentType === 'station_with_measure'
  }

  onStationAutosFetchSuccess = stationAutos => {
    this.setState({ stationAutos })
  }

  getMeasuringList = () => {
    const { form } = this.props
    const { stationIds = [] } = form.getFieldsValue()
    const stationAutos = this.state.stationAutos.filter(stationAuto =>
      stationIds.includes(stationAuto._id)
    )
    const measureList = getMeasuringListFromStationAutos(stationAutos)
    return measureList
  }

  getParams = async () => {
    const { form } = this.props
    const values = await form.getFieldsValue()
    const params = {
      [Fields.name]: values[Fields.name].trim(),
      [Fields.type]: values[Fields.type],
      [Fields.description]: values[Fields.description],
      [Fields.measures]: values[Fields.measures],
      [Fields.stationIds]: values[Fields.stationIds],
    }

    return params
  }

  clearFields = () => {
    const { form } = this.props
    form.resetFields()
  }

  handleOnSubmit = async e => {
    e.preventDefault()

    const { form } = this.props
    const values = await form.validateFields()
    if (!values) return

    const params = await this.getParams()
    try {
      const res = await CalculateApi.createTicket(params)
      if (res) {
        message.success(i18n().createSuccess)
        this.setState({ isSubmitted: true })
        this.clearFields()
        this.props.onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleOnClose = async () => {
    const { onClose } = this.props
    const { isSubmitted } = this.state

    if (isSubmitted) {
      onClose()
      this.clearFields()
      return
    }

    if (!isSubmitted) {
      this.setState({ isModalVisible: true })
    }
  }

  handleOk = () => {
    this.setState({ isModalVisible: false })
    this.clearFields()
    this.props.onClose()
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false })
  }

  render() {
    const { visible, form } = this.props
    const { isModalVisible } = this.state

    return (
      <React.Fragment>
        <ILLDrawer
          title={i18n().title}
          closable={false}
          onClose={this.handleOnClose}
          visible={visible}
          width={400}
        >
          <Form style={{ height: '100%' }} onSubmit={this.handleOnSubmit}>
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
              <div>
                <FormItem label={i18n().name}>
                  {form.getFieldDecorator(Fields.name, {
                    rules: [
                      {
                        required: true,
                        message: t('ticket.required.incident.name'),
                      },
                      { max: 64, message: t('rules.max64') },
                    ],
                  })(<Input />)}
                </FormItem>

                <FormItem label={i18n().incidentType}>
                  {form.getFieldDecorator(Fields.type, {
                    rules: [
                      {
                        required: true,
                        message: t('ticket.required.incident.incidentType'),
                      },
                    ],
                    initialValue: 'default',
                  })(<SelectIncidentType />)}
                </FormItem>

                {this.isHaveSelectStation() && (
                  <FormItem label={i18n().stationName}>
                    {form.getFieldDecorator(Fields.stationIds, {
                      rules: [
                        {
                          required: true,
                          message: t('ticket.required.incident.stationName'),
                        },
                      ],
                    })(
                      <TreeSelectStation
                        fieldValue="_id"
                        onStationAutosFetchSuccess={
                          this.onStationAutosFetchSuccess
                        }
                      />
                    )}
                  </FormItem>
                )}

                {this.isHaveSelectMeasureParameter() && (
                  <FormItem label={i18n().measure}>
                    {form.getFieldDecorator(Fields.measures, {
                      rules: [
                        {
                          required: true,
                          message: t('ticket.required.incident.measure'),
                        },
                      ],
                    })(
                      <SelectMeasureParameter
                        measuringList={this.getMeasuringList()}
                      />
                    )}
                  </FormItem>
                )}

                <FormItem label={i18n().description}>
                  {form.getFieldDecorator(Fields.description, {
                    rules: [{ max: 512, message: t('rules.max512') }],
                  })(
                    <TextAreaCustom
                      style={{
                        height: '150px',
                        resize: 'none',
                      }}
                      maxLength={512}
                      allowClear
                      autoSize
                    />
                  )}
                </FormItem>
              </div>

              <Button
                style={{ alignSelf: 'end', height: 32, minHeight: 32 }}
                type="primary"
                htmlType="submit"
              >
                {i18n().create}
              </Button>
            </Flex>
          </Form>
        </ILLDrawer>
        <Modal
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={t('global.leave')}
          cancelText={t('global.cancel')}
          title={t('global.leaveConfirm.title')}
        >
          {t('global.leaveConfirm.content')}
        </Modal>
      </React.Fragment>
    )
  }
}
