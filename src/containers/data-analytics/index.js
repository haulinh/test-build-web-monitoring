import React, { Component } from 'react'
import styled from 'styled-components'
import Clearfix from 'components/elements/clearfix'

import FilterForm from './filter'
import ReportData from './report-data'

const Container = styled.div`
  padding: 24px;
`
class DataAnalytics extends Component {
  state = {
    data: {},
  }

  onData = data => {
    this.setState({ data })
  }

  render() {
    return (
      <Container>
        <FilterForm onData={this.onData} />
        <Clearfix height={36} />
        <ReportData />
      </Container>
    )
  }
}

export default DataAnalytics
