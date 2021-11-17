import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ConfigQaqcAdvancedTab from './ConfigQaqcAdvanced'
import ConfigQaqcBasic from './ConfigQaqcBasic'

export default class QAQC_Config extends React.Component {
  refConfigQaqcBasic = React.createRef()
  refConfigQaqcAdvanced = React.createRef()

  handleOnSubmit = type => {
    if (type === 'basic') {
      return
    }
  }

  render() {
    if (this.props.isDrawer) {
      return this.renderContent()
    }

    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['configNew']} />
        <Clearfix height={24} />
        <ConfigQaqcBasic ref={this.refConfigQaqcBasic} />
        <Clearfix height={24} />
        <ConfigQaqcAdvancedTab ref={this.refConfigQaqcAdvanced} />
        <Clearfix height={24} />
      </PageContainer>
    )
  }
}
