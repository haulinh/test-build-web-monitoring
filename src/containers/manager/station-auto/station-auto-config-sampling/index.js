import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'
import Page from '@atlaskit/page/dist/cjs/Page';


@autobind
export default class StationAutoConfigSampling extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['configSampling']}/>
      </PageContainer>
    )
  }
}