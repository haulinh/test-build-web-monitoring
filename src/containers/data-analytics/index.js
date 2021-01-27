import React, { Component } from 'react'
import styled from 'styled-components'

import FilterForm from './filter'

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
      </Container>
    )
  }
}

export default DataAnalytics
