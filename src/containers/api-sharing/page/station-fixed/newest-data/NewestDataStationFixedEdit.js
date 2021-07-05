import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetail from './form/ApiSharingDetail'
import Clearfix from 'components/elements/clearfix'

@withRouter
export class NewestDataStationFixedEdit extends Component {
  render() {
    return (
      <PageContainer right={<Button>Click</Button>}>
        <Clearfix height={32} />
        <ApiSharingDetail edit />
      </PageContainer>
    )
  }
}
