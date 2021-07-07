import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetail from './form/ApiSharingDetail'
import Clearfix from 'components/elements/clearfix'
import { shareApiApi } from 'api/ShareApiApi'

@withRouter
export class HistoryDataStationFixedView extends Component {
  state = {
    data: [],
  }
  async componentDidMount() {
    const {
      match: { params },
    } = this.props
    try {
      const res = await shareApiApi.getApiDetailById(params.id)
      if (res.success) {
        this.setState({ data: res.data.config })
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { data } = this.state

    return (
      <PageContainer>
        <Clearfix height={32} />
        <ApiSharingDetail rule="view" data={data} />
      </PageContainer>
    )
  }
}
