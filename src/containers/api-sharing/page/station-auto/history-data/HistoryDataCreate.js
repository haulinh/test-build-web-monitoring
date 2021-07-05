import Clearfix from 'components/elements/clearfix'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import ApiSharingDetailForm from './form/ApiSharingDetailForm'

export class HistoryDataCreate extends Component {
  render() {
    return (
      <PageContainer hideBackground={true}>
        <Clearfix height={32} />
        <ApiSharingDetailForm />
      </PageContainer>
    )
  }
}
