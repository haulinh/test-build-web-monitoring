import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetailForm from './form/ApiSharingDetailForm'
import Clearfix from 'components/elements/clearfix'

@withRouter
export class NewestDataEdit extends Component {
  render() {
    return (
      <PageContainer right={<Button>Click</Button>}>
        <Clearfix height={32} />
        <ApiSharingDetailForm edit />
      </PageContainer>
    )
  }
}
