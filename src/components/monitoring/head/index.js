import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Button, Modal  } from 'antd'
import styled from 'styled-components'
import { colorLevels } from 'constants/warningLevels'
import { translate } from 'hoc/create-lang'
// import BookIcon from '@atlaskit/icon/glyph/book'

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
  border-radius: 3px;
  background-color: ${props => props.color};
`

const TextLevelInfo = styled.span`
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  padding-left: 8px;
`

const SpaceContainer = styled.span`
  width: 25%;
`

const RowWrapper = styled.div` display: flex; flex-direction: column; padding-bottom: 8px;`
const SectionView = styled.h3` font-size: 15px;`
const Row = styled.div` display: flex; flex-direction: row; margin: 2px 4px; `

const RowView = ({color, titleLag}) => (
  <Row>
    <ColorLevelInfo color={color}/>
    <TextLevelInfo >{translate(titleLag)}</TextLevelInfo>
  </Row>
)

const RowViewImg = ({src, titleLag}) => (
  <Row>
    <img alt={titleLag} src={src} style={{height:'20px', width:'20px'} }/>
    <TextLevelInfo >{translate(titleLag)}</TextLevelInfo>
  </Row>
)

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
    this.setState({isVisible: true})
    // Modal.info({
    //   title: translate('stationAutoManager.form.note.label'),
    //   content: (
    //     <div>
          
    //     </div>
    //   ),
    //   onOk() {},
    // });
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
          <Modal
            visible={this.state.isVisible}
            footer={null}
            title={translate('monitoring.note')}
            onCancel={() => this.setState({isVisible: false})}
          >
            <RowWrapper>
              <SectionView>{translate('dashboard.chartStatus.title')}</SectionView>
              <RowView color='#008001' titleLag='dashboard.connected'/>
              <RowView color='#F03045' titleLag='dashboard.dataLoss'/>
              <RowView color='#4D4E48' titleLag='dashboard.notUse'/>
            </RowWrapper>
            <RowWrapper>
              <SectionView>{translate('monitoring.statusResult')}</SectionView>
              <RowView color={colorLevels.GOOD} titleLag='warningLevels.good'/>
              <RowView color={colorLevels.EXCEEDED_TENDENCY} titleLag='warningLevels.exceedTendency'/>
              <RowView color={colorLevels.EXCEEDED} titleLag='warningLevels.exceed'/>
            </RowWrapper>
            <RowWrapper>
              <SectionView>{translate('qaqc.dataFilter.deviceStatus')}</SectionView>
              <RowViewImg src="/images/sensor1.png" titleLag='monitoring.deviceStatus.normal'/>
              <RowViewImg src="/images/sensor2.png" titleLag='monitoring.deviceStatus.maintenance'/>
              <RowViewImg src="/images/sensor3.png" titleLag='monitoring.deviceStatus.broken'/>
            </RowWrapper>
          </Modal>
        </WarningWrapper>
      </HeaderWrapper>
    )
  }
}
