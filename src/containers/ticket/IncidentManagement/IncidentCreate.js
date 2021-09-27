import { Button, Form, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import CalculateApi from 'api/CalculateApi'
import SelectIncidentType from 'components/elements/select-data/ticket/SelectIncidentType'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import React, { Component } from 'react'
import { getParamArray } from 'utils/params'
import { FixedBottom, ILLDrawer } from '../Component'
import { Fields, i18n } from './index'

@Form.create()
export default class IncidentCreate extends Component {
  state = {
    stationAutos: [],
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
      [Fields.measures]: getParamArray(values[Fields.measures]),
      [Fields.stationIds]: getParamArray(values[Fields.stationIds]),
    }

    return params
  }

  handleOnSubmit = async e => {
    e.preventDefault()
    const params = await this.getParams()
    try {
      const res = await CalculateApi.createTicket(params)
      if (res) this.props.onClose()
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { onClose, visible, form } = this.props

    return (
      <ILLDrawer
        title="Basic Drawer"
        closable={false}
        onClose={onClose}
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
    )
  }
}
