import { autobind } from 'core-decorators'
import createLanguageHoc from 'hoc/create-lang'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { get as _get } from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import { stationStatusOptions, getConfigColor } from 'constants/stationStatus'

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
  color: ${props => props.color};
`

// const SpaceContainer = styled.span`
//   width: 25%;
// `
@connectAutoDispatch(state => ({
  colorData: _get(state, 'config.color.warningLevel.data.value', []),
}))
@createLanguageHoc
@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
  }

  render() {
    const { t } = this.props.lang
    const { colorData } = this.props

    return (
      <HeaderWrapper>
        {/* {this.props.children} */}
        <WarningWrapper>
          {/* <SpaceContainer /> */}
          {/* <WarningTitle> {translate('warningLevels.title')}</WarningTitle> */}

          <WrapperColor>
            {stationStatusOptions.map((item, idx) => {
              const configColor = getConfigColor(colorData, item.key, {
                defaultPrimary: null,
                defaultSecond: '#ffffff',
              })

              return (
                <ColorLevel key={idx} color={configColor.primaryColor}>
                  <TextLevel color={configColor.secondColor}>
                    {t(`page.config.color.${item.key}`)}
                  </TextLevel>
                </ColorLevel>
              )
            })}
          </WrapperColor>
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
