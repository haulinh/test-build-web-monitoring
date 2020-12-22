import React from 'react'
import styled from 'styled-components'
import { Tag } from 'antd'

const HeaderLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;
`

const SpanTitle = styled.span`
  font-size: 12px;
`

const ItemWrapper = styled.div`
  .ant-tag {
    min-width: 90px;
    text-align: center;
    font-weight: 600;
    font-size: 11px;
    line-height: 22px;
    margin-right: 0px;
    margin-left: 4px;
    &.data-loss {
      color: #A4A6B5;
    }
    &.data-exceed {
      color: #E54C3C;
    }
    &.data-extend-prepare {
      color: #EDC30F;
    }
    &.data-good {
      color: #2CCA73;
    }
  }
`

const Item = ({ type, children }) => (
  <ItemWrapper>
    <Tag className={type}>{children}</Tag>
  </ItemWrapper>
)

export default function HeaderLeft({ i18n }) {
  return (
    <HeaderLeftWrapper>
      <SpanTitle>{i18n.statusData}</SpanTitle>
      <Item type="data-loss">{i18n.dataLoss}</Item>
      <Item type="data-exceed">{i18n.dataExceeded}</Item>
      <Item type="data-extend-prepare">{i18n.dataExceededPrepare}</Item>
      <Item type="data-good">{i18n.dataGood}</Item>
    </HeaderLeftWrapper>
  )
}
