import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 8px;
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
  width: 90px;
  height: 6px;
  background-color: ${props => props.color};
`
const WrapperText = styled.div`
  display: flex;
  margin-top: 4px;
`
const TextLevel = styled.span`
  width: 90px;
  font-size: 10px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: -0.1px;
  text-align: left;
  color: #3b3b3b;
`

@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string
  }

  render() {
    return (
      <HeaderWrapper>
        {this.props.children}
        <WarningWrapper>
          <WarningTitle> {translate('devicesManager.status.label')}</WarningTitle>
          <WrapperColor>
            <ColorLevel color={colorLevels.GOOD} />
            <ColorLevel color={colorLevels.EXCEEDED_PREPARING} />
            <ColorLevel color={colorLevels.EXCEEDED} />
          </WrapperColor>
          <WrapperText>
            <TextLevel>{translate('devicesManager.status.activity')}</TextLevel>
            <TextLevel>{translate('devicesManager.status.maintenance')}</TextLevel>
            <TextLevel>{translate('devicesManager.status.brokened')}</TextLevel>
          </WrapperText>
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
