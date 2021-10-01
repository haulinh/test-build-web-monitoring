import { Button, Col, Form, Row } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import _ from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { LeftContent } from './LeftContent'
import { RightContent } from './RightContent'

export const Fields = {
  name: 'name',
  description: 'description',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  status: 'status',
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

    // const configs = await CalculateApi.getConfig()
    // const category = await CalculateApi.getCategoryTicket(id)

    // console.log({ category })
    console.log({ configs })

    // const data = await CalculateApi.getTicket(id)
    this.setState({ record: data })
    const initialValues = _.pick(data, [Fields.name, Fields.description])
    form.setFieldsValue({ ...initialValues, [Fields.status]: data.status._id })
  }

  render() {
    const {
      match: {
        params: { id },
      },
      form,
    } = this.props
    const { record } = this.state

    return (
      <PageContainer right={this.ButtonDelete()}>
        <Clearfix height={32} />
        <Row gutter={32}>
          <Col span={18}>
            <LeftContent form={form} record={record} />
          </Col>
          <Col span={6}>
            <RightContent form={form} record={record} />
          </Col>
        </Row>
      </PageContainer>
    )
  }
}
