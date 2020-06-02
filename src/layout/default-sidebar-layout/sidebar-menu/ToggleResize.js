import React from 'react'
import styled from 'styled-components'
import { SHAPE } from 'themes/color'
import ChevronRight from '@atlaskit/icon/glyph/chevron-right'
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left'

const ToggleResizeWrapper = styled.div`
  width: 16px;
  height: 100vh;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  display: block
  ${props =>
    !props.isShow
      ? `
    .iconRight {
      opacity: 1;
    }
  `
      : ''}
  &:hover {
    border-right: 2px solid ${SHAPE.PRIMARY};
    .iconRight {
      opacity: 1;
    }
  }
`

const IconRight = styled.a`
  opacity: 0;
  width: 20px;
  height: 20px;
  border: 1px solid ${SHAPE.PRIMARY};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${SHAPE.PRIMARY};
  background-color: #fafbfb;
  transition: all 0.3s linear;
  position: absolute;
  right: -12px;
  top: 100px;
`

export default function ToggleResize({ onToggle, isShow }) {
  return (
    <ToggleResizeWrapper isShow={isShow} onClick={onToggle}>
      <IconRight
        href="#"
        onClick={e => e.preventDefault()}
        className="iconRight"
      >
        {isShow ? <ChevronLeft /> : <ChevronRight />}
      </IconRight>
    </ToggleResizeWrapper>
  )
}
