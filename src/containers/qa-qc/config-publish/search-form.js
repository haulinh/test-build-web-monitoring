import React from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
const Search = Input.Search

const Toolbar = styled.div`
  margin-bottom: 16px;
`

export default class SearchForm extends React.PureComponent {
  render() {
    return (
      <Toolbar>
        <Search
          placeholder="input search text"
          onSearch={this.props.onSearch}
          onChange={this.props.onSearch}
          enterButton
        />
      </Toolbar>
    )
  }
}
