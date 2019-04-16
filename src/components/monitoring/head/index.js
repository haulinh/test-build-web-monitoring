import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import { Button, Modal } from "antd";
import styled from "styled-components";
import { colorLevels } from "constants/warningLevels";
import { translate } from "hoc/create-lang";
import WarningLevel from "components/elements/warning-level";
import { COLOR_DEVICE_STATUS } from "themes/color";
// import BookIcon from '@atlaskit/icon/glyph/book'

// align-items: center;
// justify-content: space-between;
const HeaderWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  margin-left: 16px;
`;
const WarningWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  // margin-top: 8px;
  flex: 1;
`;
const WarningTitle = styled.span`
  font-weight: 600;
  font-size: 12px;
  margin-left: 4px;
`;

const WrapperColor = styled.div`
  display: flex;
  margin-top: 4px;
  margin-left: 8px;
  margin-right: 4px;
  flex: 1;
`;

const ColorLevel = styled.span`
  min-width: 96px;
  padding: 4;
  flex: 1;
  background-color: ${props => props.color};
  text-align: center;
`;
const TextLevel = styled.span`
  font-size: 12px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  text-align: center;
  color: #ffffff;
`;
const ColorLevelInfo = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

const TextLevelInfo = styled.span`
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  padding-left: 8px;
`;

const SpaceContainer = styled.span`
  width: 25%;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
`;
const SectionView = styled.h3`
  font-size: 15px;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2px 4px;
`;

const Dot = styled.div`
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
`;

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  justify-items: center;
  width: 200px;
`;

const StationStatusContainer = styled.div`
  width: 400px;
  margin-top: 12px;
  display: flex;
`;

const RowView = ({ color, titleLag }) => (
  <Row>
    <ColorLevelInfo color={color} />
    <TextLevelInfo>{translate(titleLag)}</TextLevelInfo>
  </Row>
);

const RowViewImg = ({ src, titleLag }) => (
  <Row>
    <img alt={titleLag} src={src} style={{ height: "20px", width: "20px" }} />
    <TextLevelInfo>{translate(titleLag)}</TextLevelInfo>
  </Row>
);

@autobind
export default class Header extends React.PureComponent {
  static propTypes = {
    number: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string
  };

  state = {
    isVisible: false
  };

  hideInfoWarningLevels = () => {
    this.setState({ isVisible: true });
    // Modal.info({
    //   title: translate('stationAutoManager.form.note.label'),
    //   content: (
    //     <div>

    //     </div>
    //   ),
    //   onOk() {},
    // });
  };
  render() {
    COLOR_DEVICE_STATUS;
    return (
      <HeaderWrapper>
        {this.props.children}
        <WarningWrapper>
          {/* <SpaceContainer /> */}
          {/* <WarningTitle> {translate('warningLevels.title')}</WarningTitle> */}
          <StationStatusContainer>
            <DotContainer>
              <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.ERROR }} />
              {translate("monitoring.deviceStatus.sensorError")}
            </DotContainer>
            <DotContainer>
              <Dot style={{ backgroundColor: COLOR_DEVICE_STATUS.NORMAL }} />
              {translate("monitoring.deviceStatus.sensorNormal")}
            </DotContainer>
          </StationStatusContainer>
          <WarningLevel />
        </WarningWrapper>
      </HeaderWrapper>
    );
  }
}
