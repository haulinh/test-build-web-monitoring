import styled from 'styled-components'

const Text = styled.div`
  font-size: ${props => props.fontSize || 14}px;
  font-weight: ${props => props.fontWeight || 'normal'};
  margin: ${props => props.margin};
  color: ${props => props.color};
  word-break: break-all;
  width: ${props => props.width};
`
export default Text
