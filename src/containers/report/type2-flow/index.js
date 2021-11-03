import { Form } from 'antd'
import React, { Component } from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import Clearfix from 'components/elements/clearfix'
import { Search } from 'components/layouts/styles'
import { BoxShadow } from 'containers/api-sharing/layout/styles'
import Filter from './Filter'

@Form.create()
export default class ReportFlow extends Component {
  render() {
    const { form } = this.props
    return (
      <PageContainer>
        <Breadcrumb items={['type2_flow']} />
        <Clearfix height={16} />
        <Search>
          <BoxShadow>
            <Filter form={form} />
          </BoxShadow>
        </Search>
      </PageContainer>
    )
  }
}
