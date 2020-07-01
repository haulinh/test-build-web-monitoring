import styled from 'styled-components'

const HeaderSearchWrapper = styled.div`
  padding-left: 16px;
  ${props => props.flex ? `flex: ${props.flex};` : (
    `width: ${props.width ? props.width : 600}px`
  )}
`

export default HeaderSearchWrapper