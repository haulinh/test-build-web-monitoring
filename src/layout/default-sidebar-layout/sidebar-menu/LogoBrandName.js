import React from 'react'
import styled from 'styled-components'
import { SHAPE } from 'themes/color'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import NotificationIcon from './../sidebar-global/NotificationIcon'

const LogoWidthNotification = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 8px;
  justify-content: space-between;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`

const LogoIcon = styled.img`
  height: 35px;
  width: auto;
  max-width: 35px;
`

const InfoWrapper = styled.div`
  padding-left: 8px;
`

const TextPlaceholder = styled.div`
  color: ${SHAPE.GRAYTEXT};
  font-size: 11px;
  position: relative;
`

const RegisterBrand = styled.span`
  position: relative;
  font-size: 9px;
  top: -2px;
`

const BrandName = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  color: ${SHAPE.BLACK};
`

const WrapperIcon = styled.div``

export function LogoBrandName(props) {
  return (
    <LogoWidthNotification>
      <Link to="/" id="logoBrandName">
        <LogoContainer>
          <LogoIcon
            src={props.logo ? props.logo : '/images/logo/icon/enviroment.png'}
          />
          <InfoWrapper>
            <TextPlaceholder>
              iLotusLand for Environment <RegisterBrand>&trade;</RegisterBrand>
            </TextPlaceholder>
            <BrandName>{props.name}</BrandName>
          </InfoWrapper>
        </LogoContainer>
      </Link>
      <WrapperIcon>
        <NotificationIcon />
      </WrapperIcon>
    </LogoWidthNotification>
  )
}

export default connect(state => ({
  name: state.auth.userInfo.organization.name,
  logo: state.auth.userInfo.organization.logo,
}))(LogoBrandName)
