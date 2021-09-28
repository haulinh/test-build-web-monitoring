import { Button, Form, Input, message, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import CalculateApi from 'api/CalculateApi'
import SelectIncidentType from 'components/elements/select-data/ticket/SelectIncidentType'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import React, { Component } from 'react'
import { FixedBottom, ILLDrawer } from '../Component'
import { Fields, i18n } from './index'

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
      [Fields.name]: values[Fields.name],
      [Fields.type]: values[Fields.type],
      [Fields.description]: values[Fields.description],
      [Fields.measures]: values[Fields.measures],
      [Fields.stationIds]: values[Fields.stationIds],
    }

    return params
  }

  handleOnSubmit = async e => {
    e.preventDefault()
    const params = await this.getParams()
    try {
      const res = await CalculateApi.createTicket(params)
      if (res) {
        message.success(i18n().createSuccess)
        this.setState({ isSubmitted: true })
        this.props.onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleOnClose = async () => {
    const { onClose, form } = this.props
    const { isSubmitted } = this.state

    if (isSubmitted) {
      onClose()
      return
    }

    if (!isSubmitted) {
      this.setState({ isModalVisible: true })
    }
  }

  handleOk = () => {
    this.setState({ isModalVisible: false })
    this.props.onClose()
  }

  render() {
    const { onClose, visible, form } = this.props
    const { isModalVisible } = this.state

    return (
      <React.Fragment>
        <ILLDrawer
          title="Basic Drawer"
          closable={false}
          onClose={this.handleOnClose}
          visible={visible}
          width={400}
        >
          <Form
            style={{ height: '100%', position: 'relative' }}
            onSubmit={this.handleOnSubmit}
          >
            <FormItem label={i18n().name}>
              {form.getFieldDecorator(Fields.name, {
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>

            <FormItem label={i18n().incidentType}>
              {form.getFieldDecorator(Fields.type, {
                rules: [{ required: true }],
                initialValue: 'default',
              })(<SelectIncidentType />)}
            </FormItem>

            {this.isHaveSelectStation() && (
              <FormItem label={i18n().stationName}>
                {form.getFieldDecorator(Fields.stationIds)(
                  <TreeSelectStation
                    fieldValue="_id"
                    onStationAutosFetchSuccess={this.onStationAutosFetchSuccess}
                  />
                )}
              </FormItem>
            )}

            {this.isHaveSelectMeasureParameter() && (
              <FormItem label={i18n().measure}>
                {form.getFieldDecorator(Fields.measures)(
                  <SelectMeasureParameter
                    measuringList={this.getMeasuringList()}
                  />
                )}
              </FormItem>
            )}

            <FormItem label={i18n().description}>
              {form.getFieldDecorator(Fields.description)(
                <TextArea style={{ height: '150px' }} />
              )}
            </FormItem>

            <FixedBottom>
              <Button type="primary" htmlType="submit">
                {i18n().create}
              </Button>
            </FixedBottom>
          </Form>
        </ILLDrawer>
        <Modal visible={isModalVisible} onOk={this.handleOk}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </React.Fragment>
    )
  }
}
