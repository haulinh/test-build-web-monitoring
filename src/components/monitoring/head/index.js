import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Button, Modal, Icon  } from 'antd'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
import BookIcon from '@atlaskit/icon/glyph/book'

// align-items: center;
// justify-content: space-between;
const HeaderWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  margin-left: 16px;
`
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  flex: 1;
`
const WarningTitle = styled.span`
  font-weight: 600;
  font-size: 12px;
  margin-left: 4px;
`

const WrapperColor = styled.div`
  display: flex;
  margin-top: 4px;
  margin-left: 8px;
  margin-right: 4px;
  flex: 1;
`

const ColorLevel = styled.span`
  min-width: 96px;
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
const ColorLevelInfo = styled.div`
  height: 20px;
  width: 20px;
  background-color: ${props => props.color};
`

const TextLevelInfo = styled.span`
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
`

const SpaceContainer = styled.span`
  width: 25%;
`
@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string
  }


  hideInfoWarningLevels = () => {
    Modal.info({
      title: translate('stationAutoManager.form.note.label'),
      content: (
                <div class="row">
                    <div class="col-md-12"><strong>{translate('dashboard.chartStatus.title')}</strong></div>
                      <div class="col-md-2"><ColorLevelInfo color='#008001'> </ColorLevelInfo></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{translate('dashboard.connected')}</TextLevelInfo>
                      </div>
                      <div class="col-md-2"><ColorLevelInfo color='#F03045'> </ColorLevelInfo></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{translate('dashboard.dataLoss')}</TextLevelInfo>
                      </div>
                      <div class="col-md-2"><ColorLevelInfo color='#4D4E48'> </ColorLevelInfo></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{translate('dashboard.notUse')}</TextLevelInfo>
                      </div>
                    <div class="col-md-12"><strong>{translate('map.menuRight.dataStatus')}</strong></div>
                      <div class="col-md-2"><ColorLevelInfo color={colorLevels.GOOD}> </ColorLevelInfo></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{translate('warningLevels.good')}</TextLevelInfo>
                      </div>
                      <div class="col-md-2"><ColorLevelInfo color={colorLevels.EXCEEDED_TENDENCY}> </ColorLevelInfo></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{translate('warningLevels.exceedTendency')}</TextLevelInfo>
                      </div>
                      <div class="col-md-2"><ColorLevelInfo color={colorLevels.EXCEEDED}> </ColorLevelInfo></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{translate('warningLevels.exceed')}</TextLevelInfo>
                      </div>
                    <div class="col-md-12"><strong>{translate('map.menuRight.stationStatus')}</strong></div>
                      <div class="col-md-2"> <Icon type="tags" theme="outlined" style={{color: '#1dce6c' }} /></div> 
                      <div class="col-md-10">
                        <TextLevelInfo >{`Sensor ${translate('monitoring.deviceStatus.normal')}`}</TextLevelInfo>
                      </div>
                      <div class="col-md-2"> <Icon type="tags" theme="outlined" style={{color: '#F1D748' }}/></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{`Sensor ${translate('monitoring.deviceStatus.maintenance')}`}</TextLevelInfo>
                      </div>
                      <div class="col-md-2"> <Icon type="tags" theme="outlined" style={{color: '#EA3223' }}/></div>
                      <div class="col-md-10">
                        <TextLevelInfo >{`Sensor ${translate('monitoring.deviceStatus.broken')}`}</TextLevelInfo>
                      </div>
                </div>
      ),
      onOk() {},
    });
  }

  render() {
    return (
      <HeaderWrapper>
        {this.props.children}
        <WarningWrapper>
          <SpaceContainer />
          <WarningTitle> {translate('warningLevels.title')}</WarningTitle>
          <WrapperColor>
            <ColorLevel color={colorLevels.GOOD}>
              <TextLevel>{translate('warningLevels.good')}</TextLevel>
            </ColorLevel>
            <ColorLevel color={colorLevels.EXCEEDED_TENDENCY}>
              <TextLevel>{translate('warningLevels.exceedTendency')}</TextLevel>
            </ColorLevel>
            {/* <ColorLevel color={colorLevels.EXCEEDED_PREPARING}>
              <TextLevel>
                {translate('warningLevels.exceedPreparing')}
              </TextLevel>
            </ColorLevel> */}
            <ColorLevel color={colorLevels.EXCEEDED}>
              <TextLevel>{translate('warningLevels.exceed')}</TextLevel>
            </ColorLevel>
          </WrapperColor>
          <Button type="primary" shape="circle" icon="info" style ={{width: '20px', height: '20px', fontSize: '10px'}} size="small" onClick={this.hideInfoWarningLevels}/>
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
