import { Button, Col, Form, Icon, Row } from 'antd'
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
import _ from 'lodash'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const Breadcrumb = createBreadcrumb()

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
  provinceName: t('ticket.label.incident.provinceName'),
  measure: t('ticket.label.incident.measure'),
  measure2: t('ticket.label.incident.measure2'),
  create: t('addon.create'),
  status: t('map.marker.status'),
  createSuccess: t('ticket.message.incident.createSuccess'),
  title: t('ticket.title.incident.drawer'),
  menu: t('ticket.menu.incident'),
  notificationSuccess: t('ticket.message.incident.notificationSuccess'),
  notificationError: t('ticket.message.incident.notificationError'),
})

export const PAGE_SIZE = 10

@protectRole(ROLE.INCIDENT_MANAGEMENT.VIEW)
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
    return protectRole(ROLE.INCIDENT_MANAGEMENT.CREATE)(
      <Button onClick={this.showDrawer} type="primary">
        <Icon type="plus" />
        {t('ticket.button.incident.create')}
      </Button>
    )
  }

  getParams = async () => {
    const { form } = this.props
    const values = await form.validateFields()
    if (!values) return

    const { page } = this.state

    let params = {
      [Fields.stationIds]: getParamArray(values[Fields.stationIds]),
      [Fields.type]: values[Fields.type],
      from: values[Fields.time][0].startOf('d').toDate(),
      to: values[Fields.time][1].endOf('d').toDate(),
      offset: page - 1,
      limit: PAGE_SIZE,
    }

    if (values[Fields.type] === 'default') {
      params = _.omit(params, Fields.stationIds)
    }

    return params
  }

  handleOnSearch = async () => {
    const params = await this.getParams()
    if (!params) return
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

    return (
      <PageContainer right={this.ButtonAdd()}>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n().menu,
            },
          ]}
        />
        <Clearfix height={32} />

        <Search onSearch={this.handleOnSearch} loading={loading}>
          <BoxShadow>
            <Filter form={form} onSearch={this.handleOnSearch} />
          </BoxShadow>
        </Search>

        {protectRole(ROLE.INCIDENT_MANAGEMENT.EXPORT)(
          <React.Fragment>
            <Clearfix height={32} />

            <Row type="flex" justify="end">
              <Col>
                <Button onClick={this.handleExport} type="primary">
                  {t('billing.button.exportReport')}
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
        <Clearfix height={32} />

        <TableData
          result={result}
          setPage={this.setPage}
          onSearch={this.handleOnSearch}
          page={page}
          loading={loading}
        />

        <IncidentCreate
          visible={visible}
          onClose={this.onClose}
          onSearch={this.handleOnSearch}
        />
      </PageContainer>
    )
  }
}
