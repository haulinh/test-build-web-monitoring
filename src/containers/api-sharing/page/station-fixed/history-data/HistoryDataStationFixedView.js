import Clearfix from 'components/elements/clearfix'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetail from './form/ApiSharingDetail'

@withRouter
export class HistoryDataStationFixedView extends Component {
  render() {
    return (
      <PageContainer>
        <Clearfix height={32} />
        <ApiSharingDetail rule="view" />
      </PageContainer>
    )
  }
}
