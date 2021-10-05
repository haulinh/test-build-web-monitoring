import { Button, Col, Form, notification, Row, Divider } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import LeftContent from './LeftContent'
import RightContent from './RightContent'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import { i18n } from '../index'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'

const Breadcrumb = createBreadcrumb()

export const Fields = {
  name: 'name',
  description: 'description',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  status: 'statusId',
}

@withRouter
@Form.create()
export default class IncidentDetail extends Component {
  state = {
    record: {},
    categories: [],
    name: '',
  }

  ButtonDelete = () => {
    return (
      <Button type="danger" danger>
        {translate('ticket.button.incident.delete')}
      </Button>
    )
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
    })
    const initialValues = _.pick(data, [Fields.name, Fields.description])

    const dynamicFields =
      data.categories &&
      categoriesShow.reduce((pre, current) => {
        const dynamicField = {
          [current._id]:
            current.type === 'datetime'
              ? moment(data.categories[current._id])
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
      notification.success({ message: 'update thanh cong category' })
      return true
    } catch (error) {
      notification.error('loi')
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
      notification.success({ message: 'update thanh cong ticket' })
      return true
    } catch (error) {
      notification.error('loi')
    }
    return false
  }

  render() {
    const { form } = this.props
    const { record, categories, name } = this.state

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
            />
          </Col>
        </Row>
      </PageContainer>
    )
  }
}
