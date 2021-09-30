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
import { getLanguage } from 'utils/localStorage'
import { downFileExcel } from 'utils/downFile'
import { DD_MM_YYYY } from 'constants/format-date'

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
  status: t('map.marker.status'),
  createSuccess: t('ticket.message.incident.createSuccess'),
  title: t('ticket.title.incident.drawer'),
})

export const PAGE_SIZE = 10

@Form.create()
export default class IncidentManagement extends Component {
  state = {
    visible: false,
    result: {},
    loading: false,
    page: 1,
    total: null,
  }

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

    const { page } = this.state

    const params = {
      [Fields.stationIds]: getParamArray(values[Fields.stationIds]),
      [Fields.type]: values[Fields.type],
      from: values[Fields.time][0].startOf('d').toDate(),
      to: values[Fields.time][1].endOf('d').toDate(),
      offset: page - 1,
      limit: PAGE_SIZE,
    }

    return params
  }

  handleOnSearch = async () => {
    const params = await this.getParams()
    this.setState({ loading: true })
    try {
      const result = await CalculateApi.getTickets(params)
      this.setState({ result, loading: false })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
    }
  }

  getTimes = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const from = values[Fields.time][0].format(DD_MM_YYYY)
    const to = values[Fields.time][1].format(DD_MM_YYYY)
    return { from, to }
  }

  handleExport = async () => {
    const params = await this.getParams()
    const result = await CalculateApi.exportTicket({
      ...params,
      lang: getLanguage(),
    })
    const { from, to } = this.getTimes()
    downFileExcel(
      result.data,
      `${t('ticket.title.incident.report')} ${from} - ${to}`
    )
  }

  setPage = page => {
    this.setState({ page })
  }

  render() {
    const { visible, result, page, loading } = this.state
    const { form } = this.props

    console.log({ values: form.getFieldsValue() })

    return (
      <PageContainer right={this.ButtonAdd()}>
        <Clearfix height={32} />

        <Search onSearch={this.handleOnSearch} loading={loading}>
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

        <TableData
          result={result}
          setPage={this.setPage}
          onSearch={this.handleOnSearch}
          page={page}
          loading={loading}
        />

        <IncidentCreate visible={visible} onClose={this.onClose} />
      </PageContainer>
    )
  }
}
