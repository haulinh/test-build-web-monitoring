import { Button, Col, Form, Icon, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { BoxShadow, Clearfix, Search } from 'components/layouts/styles'
import ROLE from 'constants/role'
import { translate as t } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { getParamArray } from 'utils/params'
import Filter from './Filter'
import IncidentCreate from './IncidentCreate'
import ModalConfigColumnTable from './IncidentDetail/ModalConfigColumnTable'
import { TableData } from './TableData'

const Breadcrumb = createBreadcrumb()

export const Fields = {
  name: 'name',
  type: 'type',
  description: 'description',
  stationIds: 'stationIds',
  measures: 'measures',
  province: 'province',
  time: 'time',
  status: 'statusId',
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
@connect(state => ({
  type: state.ticket.type,
}))
export default class IncidentManagement extends Component {
  state = {
    visible: false,
    result: {},
    loading: false,
    page: 1,
    total: null,
    isShowModalConfigColumn: false,
    params: {},
  }

  componentDidMount = async () => {
    const params = await this.getParams()
    this.setState({ params })
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
      [Fields.status]: values[Fields.status],
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

  getData = async () => {
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

  handleOnSearch = () => {
    this.setState({ page: 1 }, () => {
      this.getData()
    })
  }

  setPage = page => {
    this.setState({ page })
  }

  showModalConfigColumn = () => {
    this.setState({ isShowModalConfigColumn: true })
  }

  cancelModalConfigColumn = () => {
    this.setState({ isShowModalConfigColumn: false })
  }

  closeModalConfigColumn = () => {
    this.setState({ isShowModalConfigColumn: false })
  }

  render() {
    const {
      visible,
      result,
      page,
      loading,
      isShowModalConfigColumn,
      params,
    } = this.state
    const { form } = this.props

    const type = form.getFieldValue(Fields.type)
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
            <Filter form={form} onSearch={this.getData} />
          </BoxShadow>
        </Search>

        {protectRole(ROLE.INCIDENT_MANAGEMENT.EXPORT)(
          <React.Fragment>
            <Clearfix height={32} />

            <Row type="flex" justify="end">
              <Col>
                <Button
                  style={{ marginRight: '12px' }}
                  type="primary"
                  onClick={this.showModalConfigColumn}
                  icon="file-excel"
                >
                  {t('report.exportExcel')}
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
        <Clearfix height={32} />

        <TableData
          result={result}
          setPage={this.setPage}
          onSearch={this.getData}
          page={page}
          loading={loading}
          type={type}
        />

        <ModalConfigColumnTable
          visible={isShowModalConfigColumn}
          onCancel={this.cancelModalConfigColumn}
          form={form}
          params={params}
          onClose={this.closeModalConfigColumn}
        ></ModalConfigColumnTable>

        <IncidentCreate
          visible={visible}
          onClose={this.onClose}
          onSearch={this.handleOnSearch}
        />
      </PageContainer>
    )
  }
}
