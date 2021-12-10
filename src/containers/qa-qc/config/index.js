import { Clearfix } from 'components/layouts/styles'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import React from 'react'
import Breadcrumb from '../breadcrumb'
import ConfigQaqcAdvancedTab from './ConfigQaqcAdvanced'
import ConfigQaqcBasic from './ConfigQaqcBasic'

export default class QAQC_Config extends React.Component {
  state = {
    activeKeyPanel: 'basic',
    excludeParametersByTime: false,
    excludeParametersByValue: false,
  }

  toggleExcludeParametersByTime = value => {
    this.setState({ excludeParametersByTime: value })
  }

  toggleExcludeParametersByValue = value => {
    this.setState({ excludeParametersByValue: value })
  }

  setActiveKeyPanel = activeKeyPanel => {
    if (this.state.activeKeyPanel === activeKeyPanel) {
      this.setState({ activeKeyPanel: '' })
      return
    }
    this.setState({ activeKeyPanel })
  }

  render() {
    const {
      activeKeyPanel,
      excludeParametersByTime,
      excludeParametersByValue,
    } = this.state

    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['configNew']} />
        <Clearfix height={24} />
        <ConfigQaqcBasic
          excludeParametersByTime={excludeParametersByTime}
          excludeParametersByValue={excludeParametersByValue}
          toggleExcludeParametersByTime={this.toggleExcludeParametersByTime}
          toggleExcludeParametersByValue={this.toggleExcludeParametersByValue}
          activeKeyPanel={activeKeyPanel}
          setActiveKeyPanel={this.setActiveKeyPanel}
        />
        <Clearfix height={24} />
        <ConfigQaqcAdvancedTab
          toggleExcludeParametersByTime={this.toggleExcludeParametersByTime}
          excludeParametersByTime={excludeParametersByTime}
          toggleExcludeParametersByValue={this.toggleExcludeParametersByValue}
          excludeParametersByValue={excludeParametersByValue}
          setActiveKeyPanel={this.setActiveKeyPanel}
          activeKeyPanel={activeKeyPanel}
        />
        <Clearfix height={24} />
      </PageContainer>
    )
  }
}
