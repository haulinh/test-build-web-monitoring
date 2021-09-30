import { Button } from 'antd'
import CalculateApi from 'api/CalculateApi'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

@withRouter
export default class IncidentDetail extends Component {
  ButtonDelete = () => {
    return <Button>Xoá sự cố</Button>
  }

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props

    const data = await CalculateApi.getTicket(id)
    console.log({ data })
  }

  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props
    return <PageContainer right={this.ButtonDelete()}>{id}</PageContainer>
  }
}
