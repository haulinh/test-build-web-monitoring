import React from 'react'
import { colorLevels } from 'constants/warningLevels'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'

const WarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const WarningTitle = styled.span`
  font-weight: 600;
  font-size: 12px;
`
const WrapperColor = styled.div`
  display: flex;
  margin-top: 4px;
`
const ColorLevel = styled.span`
  width: 100px;
  text-align: center;
  background-color: ${props => props.color};
`

const TextLevel = styled.span`
  width: 100px;
  font-size: 10px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.1px;
  text-align: center;
  color: #fff;
`

export default function LevelInfo() {
  return (
    <WarningWrapper>
      <WarningTitle>{translate('warningLevels.title')}</WarningTitle>
      <WrapperColor>
        <ColorLevel color={colorLevels.GOOD}>
          <TextLevel>{translate('warningLevels.good')}</TextLevel>
        </ColorLevel>
        <ColorLevel color={colorLevels.EXCEEDED_TENDENCY}>
          <TextLevel>{translate('warningLevels.exceedTendency')}</TextLevel>
        </ColorLevel>
        {/* <ColorLevel color={colorLevels.EXCEEDED_PREPARING} /> */}
        <ColorLevel color={colorLevels.EXCEEDED}>
          <TextLevel>{translate('warningLevels.exceed')}</TextLevel>
        </ColorLevel>
      </WrapperColor>
      {/* <WrapperText>
        <TextLevel>{translate('warningLevels.good')}</TextLevel>
        <TextLevel>{translate('warningLevels.exceedTendency')}</TextLevel>
        <TextLevel>{translate('warningLevels.exceedPreparing')}</TextLevel>
        <TextLevel>{translate('warningLevels.exceed')}</TextLevel>
      </WrapperText> */}
    </WarningWrapper>
  )
}
