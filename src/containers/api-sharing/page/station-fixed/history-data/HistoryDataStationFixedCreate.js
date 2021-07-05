import Clearfix from 'components/elements/clearfix'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import ApiSharingDetail from './form/ApiSharingDetail'

export class HistoryDataStationFixedCreate extends Component {
  render() {
    return (
      <PageContainer hideBackground={true}>
        <Clearfix height={32} />
        <ApiSharingDetail />
      </PageContainer>
    )
  }
}
