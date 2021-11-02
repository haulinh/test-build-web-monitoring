import { Col, Form, Row, DatePicker } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import { Fields, i18n } from './index'
import { translate as t } from 'hoc/create-lang'
import TreeSelectStation from 'components/elements/select-data/TreeSelectStation'
import SelectIncidentType from 'components/elements/select-data/ticket/SelectIncidentType'
import SelectStatus from 'components/elements/select-data/ticket/SelectStatus'
import moment from 'moment'

const { RangePicker } = DatePicker

@Form.create()
export default class Filter extends Component {
  componentDidMount() {
    const { onSearch } = this.props

    onSearch && onSearch()
  }

  onStationAutosFetchSuccess = stationAutos => {
    const { form } = this.props

    const stationAutoIds = stationAutos.map(stationAuto => stationAuto._id)

    form.setFieldsValue({
      [Fields.stationIds]: stationAutoIds,
      [Fields.time]: [moment().startOf('M'), moment().endOf('M')],
    })
  }

  isDisableStation = () => {
    const { form } = this.props
    return ['', 'default'].includes(form.getFieldValue(Fields.type))
  }

  render() {
    const { form } = this.props
    const { province } = form.getFieldsValue()

    return (
      <Form>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label={i18n().incidentType}>
              {form.getFieldDecorator(Fields.type, {
                initialValue: '',
              })(<SelectIncidentType isShowAll />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label={t('ticket.label.incident.time')}>
              {form.getFieldDecorator(Fields.time, {
                initialValue: [moment().startOf('M'), moment().endOf('M')],
                rules: [
                  {
                    required: true,
                    message: t('ticket.required.incident.time'),
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label={t('ticket.label.incident.status')}>
              {form.getFieldDecorator(Fields.status, {
                initialValue: '',
              })(<SelectStatus isShowAll style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          {!this.isDisableStation() && (
            <Col>
              <FormItem label={t('menuApp.config.stationAuto')}>
                {form.getFieldDecorator(Fields.stationIds, {
                  rules: [
                    {
                      required: true,
                      message: t('ticket.required.incident.stationName'),
                    },
                  ],
                })(
                  <TreeSelectStation
                    maxTagCount={5}
                    province={province}
                    fieldValue="_id"
                    onStationAutosFetchSuccess={this.onStationAutosFetchSuccess}
                  />
                )}
              </FormItem>
            </Col>
          )}
        </Row>
      </Form>
    )
  }
}
