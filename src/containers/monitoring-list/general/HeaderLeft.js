import React from 'react'
import styled from 'styled-components'

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
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  margin-left: 4px;
  img {
    width: 12px;
    margin-right: 4px;
  }
`

const Item = ({ type, children }) => (
  <ItemWrapper>
    <img src={`/images/sensor/${type}.png`} alt={type} />
    <span>{children}</span>
  </ItemWrapper>
)

export default function HeaderLeft({ stationStatus, i18n }) {
  return (
    <HeaderLeftWrapper>
      <Label>{stationStatus}</Label>
      <SpanTitle>{i18n.statusSensor}</SpanTitle>
      <Item type="error">{i18n.sensorError}</Item>
      <Item type="maintain">{i18n.sensorMaintain}</Item>
      <Item type="good">{i18n.sensorGood}</Item>
    </HeaderLeftWrapper>
  )
}
