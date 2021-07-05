import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetail from './form/ApiSharingDetail'
import Clearfix from 'components/elements/clearfix'
import { shareApiApi } from 'api/ShareApiApi'

@withRouter
export class HistoryDataStationFixedEdit extends Component {
  async componentDidMount() {
    const {
      match: { params },
    } = this.props
    const data = await shareApiApi.getApiDetailById(params.id)
    console.log({ data })
  }
  render() {
    return (
      <PageContainer right={<Button>Click</Button>}>
        <Clearfix height={32} />
        <ApiSharingDetail edit />
      </PageContainer>
    )
  }
}
