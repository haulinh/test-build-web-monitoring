import styled from 'styled-components'
import React from 'react'

const ResponseFormat = styled.pre`
  background: #292b36;
  padding: 10px 20px;
  color: #fff;
  border-radius: 8px;
`

const Example = ({ data }) => {
  return <ResponseFormat>{JSON.stringify(data, null, 4)}</ResponseFormat>
}

export default Example
