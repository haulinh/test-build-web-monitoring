import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ConfigQaqcAdvancedTab from './ConfigQaqcAdvanced'
import ConfigQaqcBasic from './ConfigQaqcBasic'

export default class QAQC_Config extends React.Component {
  render() {
    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['configNew']} />
        <Clearfix height={24} />
        <ConfigQaqcBasic />
        <Clearfix height={24} />
        <ConfigQaqcAdvancedTab />
        <Clearfix height={24} />
      </PageContainer>
    )
  }
}
