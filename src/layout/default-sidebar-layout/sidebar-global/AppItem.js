import React from 'react'
import Tooltip from '@atlaskit/tooltip'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const AppItemWrapper = styled(Link)`
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: ${props => props.color};
`

const Icon = styled.img`
  width: 20px;
  height: 20px;
`

export default function AppItem({ name, icon, href, color }) {
  return (
    <Tooltip position="right" content={name}>
      <AppItemWrapper color={color} to={href}>
        <Icon src={`/images/app-icons/${icon}.svg`} />
      </AppItemWrapper>
    </Tooltip>
  )
}
