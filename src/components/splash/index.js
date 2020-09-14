import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
`

const Content = styled.div`
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  width: 46px;
  height: 46px;
  margin-right: 8px;
`

const Brand = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #333;
`

const Dots = styled.span`
  font-size: 32px;
  margin-left: 8px;
  color: #00a5e7;
`

const Dot = styled.span`
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes blink {
    /**
        * At the start of the animation the dot
        * has an opacity of .2
        */
    0% {
      opacity: 0.2;
    }
    /**
        * At 20% the dot is fully visible and
        * then fades out slowly
        */
    20% {
      opacity: 1;
    }
    /**
        * Until it reaches an opacity of .2 and
        * the animation can start again
        */
    100% {
      opacity: 0.2;
    }
  }
`

export default class SplashLoading extends Component {
  render() {
    return (
      <Wrapper>
        <Content>
          <Logo src="/images/logo/logo-icon.png" />
          <Brand>
            iLotusLand
            <Dots>
              <Dot>.</Dot>
              <Dot>.</Dot>
              <Dot>.</Dot>
            </Dots>
          </Brand>
        </Content>
      </Wrapper>
    )
  }
}
