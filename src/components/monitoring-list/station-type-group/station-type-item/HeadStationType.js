import React from 'react'
import Heading from 'components/elements/heading'
// import { Menu} from 'antd'
// import styled from 'styled-components'

// const LinkSpan = styled.span`
//   color: #ffffff;
//   &:hover {
//     cursor: pointer;
//   }
// `

export default class HeadStypeType extends React.Component {
  render() {
    return (
      <Heading
        isBackground
        textColor="#ffffff"
        fontSize={14}
        style={{
          padding: '8px 16px',
        }}
      >
        {this.props.children}
      </Heading>
    )
  }
}
