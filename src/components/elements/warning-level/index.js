import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { DATA_COLOR } from 'themes/color'

const HeaderWrapper = styled.div`
  flex: 1;
  flex-direction: column;
`
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`
// const WarningTitle = styled.span`
//   font-weight: 600;
//   font-size: 12px;
//   margin-left: 4px;
// `

const WrapperColor = styled.div`
  display: flex;
  margin-left: 8px;
  margin-right: 4px;
  flex: 1;
`

const ColorLevel = styled.span`
  min-width: 100px;
  padding: 4;
  flex: 1;
  background-color: ${props => props.color};
  text-align: center;
`
const TextLevel = styled.span`
  font-size: 12px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  text-align: center;
  color: #ffffff;
`

// const SpaceContainer = styled.span`
//   width: 25%;
// `

@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
  }

  render() {
    return (
      <HeaderWrapper>
        {/* {this.props.children} */}
        <WarningWrapper>
          {/* <SpaceContainer /> */}
          {/* <WarningTitle> {translate('warningLevels.title')}</WarningTitle> */}

          <WrapperColor>
            <ColorLevel color={DATA_COLOR.DATA_LOSS}>
              <TextLevel>{translate('warningLevels.lossData')}</TextLevel>
            </ColorLevel>
            <ColorLevel color={DATA_COLOR.EXCEEDED}>
              <TextLevel>{translate('warningLevels.exceed')}</TextLevel>
            </ColorLevel>
            <ColorLevel color={DATA_COLOR.EXCEEDED_PREPARING}>
              <TextLevel>
                {translate('warningLevels.exceedPreparing')}
              </TextLevel>
            </ColorLevel>
            <ColorLevel color={DATA_COLOR.GOOD}>
              <TextLevel>{translate('warningLevels.good')}</TextLevel>
            </ColorLevel>
          </WrapperColor>
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
