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

export const incidentType = () => ({
  default: t('ticket.incidentType.default'),
  station: t('ticket.incidentType.station'),
  station_with_measure: t('ticket.incidentType.measure'),
})

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
  state = { visible: false, data: [], loading: false }

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
      to: values[Fields.time][1].endOf('d').toDate(),
      offset: 1,
      limit: 10,
    }

    return params
  }

  handleOnSearch = async () => {
    const params = await this.getParams()
    this.setState({ loading: true })
    try {
      const data = await CalculateApi.getTickets(params)
      this.setState({ data, loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  handleExport = () => {}

  render() {
    const { visible, data } = this.state
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

        <Clearfix height={32} />

        <TableData data={data} />

        <IncidentCreate visible={visible} onClose={this.onClose} />
      </PageContainer>
    )
  }
}
