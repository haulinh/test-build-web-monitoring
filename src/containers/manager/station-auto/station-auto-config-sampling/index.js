/* packages */
import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
/* util */
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
/* components */
import Breadcrumb from '../breadcrumb'
import SearchForm from './search-form'


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
        <SearchForm />
      </PageContainer>
    )
  }
}