import { Button, Col, Divider, Form, notification, Popconfirm, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { i18n } from '../index'
import LeftContent from './LeftContent'
import RightContent from './RightContent'
import protectRole from 'hoc/protect-role'
import ROLE from 'constants/role'

const Breadcrumb = createBreadcrumb()

export const Fields = {
  name: 'name',
  description: 'description',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  status: 'statusId',
}

@withRouter
@protectRole(ROLE.INCIDENT_MANAGEMENT.EDIT)
@Form.create()
export default class IncidentDetail extends Component {
  state = {
    record: {},
    categories: [],
    name: '',
    updatedAt: null,
  }

  handleDelete = async () => {
    const {
      match: {
        params: { id },
      },
      history,
    } = this.props
    try {
      await CalculateApi.deleteTicket(id)
      history.push(slug.ticket.incident)
    } catch (error) {
      console.log({ error })
    }
  }

  ButtonDelete = () => {
    return protectRole(ROLE.INCIDENT_MANAGEMENT.DELETE)(
      <Popconfirm
        onConfirm={this.handleDelete}
        title={translate('ticket.label.incident.confirmDelete')}
        okText={translate('global.verify')}
        cancelText={translate('global.cancel')}
      >
        <Button type="danger" danger>
          {translate('ticket.button.incident.delete')}
        </Button>
      </Popconfirm>
    )
  }

  setRecord = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props
    const data = await CalculateApi.getTicket(id)
    this.setState({ record: data })
  }

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
      form,
    } = this.props

    const [configs, data] = await Promise.all([
      CalculateApi.getConfigs(),
      CalculateApi.getTicket(id),
    ])

    const categoriesShow = configs.filter(config => !config.hidden)

    this.setState({
      record: data,
      categories: categoriesShow,
      name: data.name,
      updatedAt: data.updatedAt,
    })
    const initialValues = _.pick(data, [Fields.name, Fields.description])

    const dynamicFields =
      data.categories &&
      categoriesShow.reduce((pre, current) => {
        const dynamicField = {
          [current._id]:
            current.type === 'datetime'
              ? data.categories[current._id] &&
                moment(data.categories[current._id])
              : data.categories[current._id],
        }
        return { ...pre, ...dynamicField }
      }, {})
    form.setFieldsValue({
      ...initialValues,
      [Fields.status]: data.statusId,
      [Fields.timeStart]: moment(data.timeStart),
      [Fields.timeEnd]: data.timeEnd && moment(data.timeEnd),
      ...dynamicFields,
    })
  }

  updateCategoryTicket = async param => {
    const {
      match: {
        params: { id },
      },
      form,
    } = this.props

    const values = await form.validateFields()
    if (!values) return false

    try {
      await CalculateApi.updateCategoryTicket(id, param)
      this.setState({ updatedAt: moment() })
      this.setRecord()
      notification.success({ message: i18n().notificationSuccess })
      return true
    } catch (error) {
      notification.error({ message: i18n().notificationError })
    }
    return false
  }

  updateTicket = async param => {
    const {
      match: {
        params: { id },
      },
      form,
    } = this.props

    const values = await form.validateFields()
    if (!values) return false

    try {
      await CalculateApi.updateTicket(id, param)
      this.setState({ updatedAt: moment() })
      this.setRecord()
      notification.success({ message: i18n().notificationSuccess })
      return true
    } catch (error) {
      notification.error({ message: i18n().notificationError })
    }
    return false
  }

  setName = name => {
    this.setState({ name })
  }

  setUpdatedAt = () => {
    this.setState({ updatedAt: moment() })
  }

  render() {
    const { form } = this.props
    const { record, categories, name, updatedAt } = this.state

    return (
      <PageContainer right={this.ButtonDelete()}>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n().menu,
              href: slug.ticket.incident,
            },
            {
              id: '2',
              name: name,
            },
          ]}
        />
        <Clearfix height={32} />
        <Row type="flex" gutter={32}>
          <Col span={15}>
            <LeftContent
              form={form}
              record={record}
              updateTicket={this.updateTicket}
              setName={this.setName}
              setUpdatedAt={this.setUpdatedAt}
            />
          </Col>

          <Col span={1}>
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>

          <Col span={7}>
            <RightContent
              updateTicket={this.updateTicket}
              form={form}
              record={record}
              categories={categories}
              updateCategoryTicket={this.updateCategoryTicket}
              updatedAt={updatedAt}
            />
          </Col>
        </Row>
      </PageContainer>
    )
  }
}
