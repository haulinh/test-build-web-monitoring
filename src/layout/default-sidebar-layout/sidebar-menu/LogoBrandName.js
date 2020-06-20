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
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  color: ${SHAPE.BLACK};
`
const WrapperIcon = styled.div`
  margin-left: 165px;
  color: #333;
`
export function LogoBrandName(props) {
  return (
    <Fragment>
      <LogoContainer>
        <LogoIcon
          src={props.logo ? props.logo : '/images/logo/icon/enviroment.png'}
        />
        <InfoWrapper>
          <TextPlaceholder>
            iLotusLand for Environment <RegisterBrand>&trade;</RegisterBrand>
          </TextPlaceholder>
          <WrapperIcon>
            <NotificationIcon />
          </WrapperIcon>
          <BrandName>{props.name}</BrandName>
        </InfoWrapper>
      </LogoContainer>
    </Fragment>
  )
}

export default connect(state => ({
  name: state.auth.userInfo.organization.name,
  logo: state.auth.userInfo.organization.logo,
}))(LogoBrandName)
