import { Button, Col, Form, Row } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import IncidentCreate from './IncidentCreate'
import CalculateApi from 'api/CalculateApi'
import { Search, BoxShadow, Clearfix } from 'components/layouts/styles'
import Filter from './Filter'
import { getParamArray } from 'utils/params'
import { TableData } from './TableData'

export const Fields = {
  name: 'name',
  type: 'type',
  description: 'description',
  stationIds: 'stationIds',
  measures: 'measures',
  province: 'province',
  time: 'time',
}

export const i18n = () => ({
  name: t('ticket.label.incident.name'),
  incidentType: t('ticket.label.incident.incidentType'),
  description: t('ticket.label.incident.description'),
  stationName: t('ticket.label.incident.stationName'),
  measure: t('ticket.label.incident.measure'),
  create: t('addon.create'),
})

@Form.create()
export default class IncidentManagement extends Component {
  state = { visible: false }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  ButtonAdd = () => {
    return (
      <Button onClick={this.showDrawer} type="primary">
        {t('addon.create')}
      </Button>
    )
  }

  getParams = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    if (!values) return

    const params = {
      [Fields.stationIds]: getParamArray(values[Fields.stationIds]),
      from: values[Fields.time][0].startOf('d').toDate(),
      to: values[Fields.time][1].startOf('d').toDate(),
      offset: 1,
      limit: 10,
    }

    return params
  }

  handleOnSearch = async () => {
    const res = await CalculateApi.getTickets()
    console.log({ res })

    const params = await this.getParams()
    const result = await CalculateApi.getTickets(params)
    console.log({ result })
  }

  handleExport = () => {}

  render() {
    const { visible } = this.state
    const { form } = this.props

    return (
      <PageContainer right={this.ButtonAdd()}>
        <Search onSearch={this.handleOnSearch}>
          <BoxShadow>
            <Filter form={form} />
          </BoxShadow>
        </Search>
        <Clearfix height={32} />

        <Row type="flex" justify="end">
          <Col>
            <Button onClick={this.handleExport} type="primary">
              {t('billing.button.exportReport')}
            </Button>
          </Col>
        </Row>

        <TableData />

        <IncidentCreate visible={visible} onClose={this.onClose} />
      </PageContainer>
    )
  }
}
