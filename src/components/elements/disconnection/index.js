import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'


const DisconnectionWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 300px;
    .information--text{
        font-weight: bold;
    }
`
export default class Disconnection extends React.PureComponent {
  static propTypes = {
    messages: PropTypes.string
  }
  
  render() {
    const {messages} = this.props
    return (
      <DisconnectionWrapper className="information">
        <div className="information--icon">
          <img src="/images/warning/disconnection.jpg" />
        </div>
        <div className="information--text">{messages}</div>
      </DisconnectionWrapper>
    )
  }
}
