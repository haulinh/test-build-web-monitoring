import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { translate } from 'hoc/create-lang'
import Breadcrumb from '../breadcrumb'


@autobind
export default class StationAutoConfigSampling extends React.Component {
  static propTypes = {}
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <div>page</div>
  }
}