import React, { Fragment } from 'react'
import styled from 'styled-components'
import { SHAPE } from 'themes/color'
import { connect } from 'react-redux'
import NotificationIcon from './../sidebar-global/NotificationIcon'

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 8px;
`

const LogoIcon = styled.img`
  height: 35px;
  width: auto;
`

const InfoWrapper = styled.div`
  padding-left: 35px;
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
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  color: ${SHAPE.BLACK};
  padding-left: 35px;
`
const WrapperIcon = styled.div`
  color: #333;
  padding-left: 162px;
`
export function LogoBrandName(props) {
  return (
    <Fragment>
      <InfoWrapper>
        <TextPlaceholder>
          iLotusLand for Environment <RegisterBrand>&trade;</RegisterBrand>
        </TextPlaceholder>
      </InfoWrapper>

      <LogoContainer>
        <LogoIcon
          src={props.logo ? props.logo : '/images/logo/icon/enviroment.png'}
        />

        <WrapperIcon>
          <NotificationIcon />
        </WrapperIcon>
      </LogoContainer>
      <BrandName>{props.name}</BrandName>
    </Fragment>
  )
}

export default connect(state => ({
  name: state.auth.userInfo.organization.name,
  logo: state.auth.userInfo.organization.logo,
}))(LogoBrandName)
