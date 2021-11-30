import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ConfigQaqcAdvancedTab from './ConfigQaqcAdvanced'
import ConfigQaqcBasic from './ConfigQaqcBasic'

export default class QAQC_Config extends React.Component {
  state = {
    activeKeyPanel: 'basic',
  }

  setActiveKeyPanel = activeKeyPanel => {
    if (this.state.activeKeyPanel === activeKeyPanel) {
      this.setState({ activeKeyPanel: '' })
      return
    }
    this.setState({ activeKeyPanel })
  }

  render() {
    const { activeKeyPanel } = this.state
    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['configNew']} />
        <Clearfix height={24} />
        <ConfigQaqcBasic
          activeKeyPanel={activeKeyPanel}
          setActiveKeyPanel={this.setActiveKeyPanel}
        />
        <Clearfix height={24} />
        <ConfigQaqcAdvancedTab
          setActiveKeyPanel={this.setActiveKeyPanel}
          activeKeyPanel={activeKeyPanel}
        />
        <Clearfix height={24} />
      </PageContainer>
    )
  }
}
