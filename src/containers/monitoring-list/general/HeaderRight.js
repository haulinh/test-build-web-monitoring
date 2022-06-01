import React from 'react'
import styled from 'styled-components'
import WarningLevel from 'components/elements/warning-level'

const HeaderLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
  margin-top: 16px;
  line-height: 21px;
  margin-bottom: 16px;
  width: 50%;
`

export default function HeaderLeft() {
  return (
    <HeaderLeftWrapper>
      <WarningLevel />
    </HeaderLeftWrapper>
  )
}
