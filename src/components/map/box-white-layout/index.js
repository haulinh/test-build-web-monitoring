import React from 'react'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Heading from './Heading'

const BoxWhiteLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const WrapperWhite = styled.div`
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-top: 0px;
  ${props => (!props.noPadding ? `padding: 16px 16px;` : ``)};
`

@autobind
export default class BoxWhiteLayout extends React.PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    right: PropTypes.object,
    style: PropTypes.object,
    onlyTitle: PropTypes.bool,
    noPadding: PropTypes.bool,
    noTitlePadding: PropTypes.bool,
    containerStyle: PropTypes.object
  }
  render() {
    return (
      <BoxWhiteLayoutWrapper style={this.props.style}>
        <Heading
          noPadding={this.props.noTitlePadding}
          onlyTitle={this.props.onlyTitle}
          right={this.props.right}
        >
          {this.props.title}
        </Heading>
        <WrapperWhite
          style={this.props.containerStyle}
          noPadding={this.props.noPadding}
        >
          {this.props.children}
        </WrapperWhite>
      </BoxWhiteLayoutWrapper>
    )
  }
}
