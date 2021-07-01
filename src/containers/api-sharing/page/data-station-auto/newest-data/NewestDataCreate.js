import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import ApiSharingDetailForm from './form/ApiSharingDetailForm'
import Clearfix from 'components/elements/clearfix'

export class NewestDataCreate extends Component {
  render() {
    return (
      <PageContainer hideBackground={true} right={<Button>Click</Button>}>
        <Clearfix height={32} />
        <ApiSharingDetailForm />
      </PageContainer>
    )
  }
}
