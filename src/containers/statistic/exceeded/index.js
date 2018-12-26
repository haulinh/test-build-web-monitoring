import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import { Spin, message } from 'antd'

export default class ExceededContainer extends React.Component {
  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['exceeded']} />
        <Spin spinning={false} title="Đang xử lý..." />
      </PageContainer>
    )
  }
}
