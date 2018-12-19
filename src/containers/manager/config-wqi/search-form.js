import React from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import { translate } from 'hoc/create-lang'
const Search = Input.Search

const Toolbar = styled.div`
  margin-bottom: 16px;
`

export default class SearchForm extends React.PureComponent {
  render() {
    return (
      <Toolbar>
        <Search
          placeholder={translate('qaqc.configPublish.stationName')}
          onSearch={this.props.onSearch}
          //onChange={this.props.onSearch}
          enterButton
        />
      </Toolbar>
    )
  }
}
