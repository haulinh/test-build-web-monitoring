import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import WarningLevel from 'components/elements/warning-level'
import { COLOR_DEVICE_STATUS } from 'themes/color'
// import BookIcon from '@atlaskit/icon/glyph/book'

// align-items: center;
// justify-content: space-between;
const HeaderWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  margin-left: 8px;
`
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  flex: 1;
`

const Dot = styled.div`
  height: 15px;
  width: 15px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
`

const DotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  text-align: center;
  padding-right: 8px;
  font-size: 11px;
  font-weight: 500;
`

const StationStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string
  }

  state = {
    isVisible: false
  }

  hideInfoWarningLevels = () => {
    this.setState({ isVisible: true })
  }
  render() {
    return (
      <HeaderWrapper>
        {this.props.children}
        <WarningWrapper>
          {/* <SpaceContainer /> */}
          {/* <WarningTitle> {translate('warningLevels.title')}</WarningTitle> */}
          <StationStatusContainer>
            <DotContainer>
              <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.DATA_LOSS }} />
              <span>{translate('monitoring.deviceStatus.dataloss')}</span>
            </DotContainer>
            <DotContainer>
              <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.ERROR }} />
              <span>{translate('monitoring.deviceStatus.sensorError')}</span>
            </DotContainer>
            <DotContainer>
              <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.MAINTENACE }} />
              <span>{translate('monitoring.deviceStatus.maintenance')}</span>
            </DotContainer>

            <DotContainer>
              <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.NORMAL }} />
              <span>{translate('monitoring.deviceStatus.sensorNormal')}</span>
            </DotContainer>
          </StationStatusContainer>
          <WarningLevel style={{ marginTop: 4 }} />
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
