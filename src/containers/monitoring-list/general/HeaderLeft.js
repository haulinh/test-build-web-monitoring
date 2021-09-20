import React from 'react'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'

const HeaderLeftWrapper = styled.div`
  display: flex;
  align-items: center;
`

const SpanTitle = styled.span`
  font-size: 12px;
  margin-left: 8px;
`

const Label = styled.label`
  font-weight: bold;
  align-self: center;
  margin-bottom: 0px;
  font-size: 12px;
  margin-right: 4px;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  margin-left: 4px;
`

const Item = ({ color, children }) => (
  <ItemWrapper>
    <div
      style={{
        backgroundColor: color,
        borderRadius: '50%',
        width: '12px',
        height: '12px',
        marginRight: '4px',
      }}
    />
    <span>{children}</span>
  </ItemWrapper>
)

export default function HeaderLeft({ stationStatus, i18n }) {
  return (
    <HeaderLeftWrapper>
      <Label>{stationStatus}</Label>
      <SpanTitle>{i18n().statusSensor}</SpanTitle>
      <Item color={colorLevels.ERROR}>{i18n().sensorError}</Item>
      <Item color={colorLevels.MAINTAIN}>{i18n().sensorMaintain}</Item>
      <Item color={colorLevels.GOOD}>{i18n().sensorGood}</Item>
    </HeaderLeftWrapper>
  )
}
