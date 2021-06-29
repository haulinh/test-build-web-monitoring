import { Button } from 'antd'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import ApiSharingDetailForm from './form/ApiSharingDetailForm'

@withRouter
export default class ApiSharingDetailCreate extends Component {
  render() {
    return (
      <PageContainer right={<Button>Click</Button>}>
        <ApiSharingDetailForm />
      </PageContainer>
    )
  }
}
