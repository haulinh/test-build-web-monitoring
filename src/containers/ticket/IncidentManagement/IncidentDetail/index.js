import { Button, Col, Form, notification, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { LeftContent } from './LeftContent'
import { RightContent } from './RightContent'

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
  }

  ButtonDelete = () => {
    return <Button>Xoá sự cố</Button>
  }

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
      form,
    } = this.props

    const [configs, data] = await Promise.all([
      CalculateApi.getConfig(),
      CalculateApi.getTicket(id),
    ])

    const categoriesShow = configs.filter(config => !config.hidden)

    this.setState({ record: data, categories: categoriesShow })
    const initialValues = _.pick(data, [Fields.name, Fields.description])
    form.setFieldsValue({
      ...initialValues,
      [Fields.status]: data.statusId,
      [Fields.timeStart]: moment(data.timeStart),
      [Fields.timeEnd]: data.timeEnd && moment(data.timeEnd),
    })
  }

  updateCategoryTicket = async param => {
    const {
      match: {
        params: { id },
      },
    } = this.props
    try {
      await CalculateApi.updateCategoryTicket(id, param)
      notification.success({ message: 'update thanh cong' })
    } catch (error) {
      notification.error('loi')
    }
  }

  updateTicket = async param => {
    const {
      match: {
        params: { id },
      },
    } = this.props
    try {
      await CalculateApi.updateTicket(id, param)
      notification.success({ message: 'update thanh cong' })
    } catch (error) {
      notification.error('loi')
    }
  }

  render() {
    const { form } = this.props
    const { record, categories } = this.state

    return (
      <PageContainer right={this.ButtonDelete()}>
        <Clearfix height={32} />
        <Row gutter={32}>
          <Col span={18}>
            <LeftContent
              form={form}
              record={record}
              updateTicket={this.updateTicket}
            />
          </Col>
          <Col span={6}>
            <RightContent
              updateTicket={this.updateTicket}
              form={form}
              record={record}
              categories={categories}
            />
          </Col>
        </Row>
      </PageContainer>
    )
  }
}
