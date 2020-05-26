import React from "react";
import { Row, Col, Drawer, Button, Icon, Divider } from "antd";
import slug from "constants/slug";
import styled from "styled-components";
import { translate } from "hoc/create-lang";
import { getStationAuto } from "api/StationAuto";

const i18n = {
  title: translate("stationAutoManager.infoStation.title"),
  edit: translate("stationAutoManager.infoStation.edit"),
  career: translate("stationAutoManager.infoStation.career"),
  empty: translate("stationAutoManager.infoStation.emptyText"),
  yearOperate: translate("stationAutoManager.infoStation.yearOperate"),
  capacity: translate("stationAutoManager.infoStation.capacity"),
  processProdution: translate(
    "stationAutoManager.infoStation.processProdution"
  ),
  userResponsible: translate("stationAutoManager.infoStation.userResponsible"),
  userSupervisor: translate("stationAutoManager.infoStation.userSupervisor"),
  website: translate("stationAutoManager.infoStation.website"),
};

const TextColor = styled.p`
  font-size: 20px;
  color: #1890ff;
  margin: 0;
  line-height: normal;
`;

const Text = styled.p`
  font-size: 20px;
  margin: 0;
  line-height: normal;
`;

const Title = styled.h4``;

const defaultChartType = "hours";

const Wrapper = styled(Row)`
  padding: 12px 0 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const WrapperItem = styled(Col)`
  > p + p {
    margin-top: 12px;
  }
  margin-left: 12px;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const InfoItem = ({ iconType, label, desc, title }) => (
  <Wrapper>
    <WrapperItem span={!title ? 1 : 10}>
      <Flex>
        {iconType && (
          <Icon
            style={{
              fontSize: "26px",
              color: "#1890ff",
              marginRight: !title ? "0px" : "10px",
            }}
            type={iconType}
            theme='outlined'
          />
        )}
        {title && <Text>{title}</Text>}
      </Flex>
    </WrapperItem>
    <WrapperItem span={!title ? 23 : 14}>
      {!label && !desc && <Text>{i18n.empty}</Text>}
      {label && <Text>{label}</Text>}
      {desc && <TextColor>{desc}</TextColor>}
    </WrapperItem>
  </Wrapper>
);

export default class DrawerInfoStation extends React.Component {
  state = {
    isLoadingInfoStation: true,
    InfoStationData: {},
    chartType: "",
    visibleDrawer: false,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });

    const res = await getStationAuto(this.props._id);
    if (res.success) {
      this.setState({
        isLoadingInfoStation: false,
        InfoStationData: res.data,
        chartType: defaultChartType,
      });
    }
  }

  render() {
    console.log("InfoStationData", this.state.InfoStationData);
    const { onClose, visibleDrawer, _id } = this.props;
    const {
      address,
      userResponsible,
      phoneResponsible,
      userSupervisor,
      phoneSupervisor,
      website,
      career,
      yearOperate,
      capacity,
      processProdution,
    } = this.state.InfoStationData;
    return (
      <Drawer
        width={720}
        placement='right'
        closable={false}
        onClose={onClose}
        visible={visibleDrawer}
      >
        <Wrapper>
          <WrapperItem span={10}>
            <Title>{i18n.title}</Title>
          </WrapperItem>
          <WrapperItem span={14}>
            <Button
              target='_blank'
              href={slug.stationAuto.editWithKey + "/" + _id}
            >
              <Icon
                style={{ fontSize: "16px", color: "#1890ff" }}
                type='edit'
                theme='outlined'
              />
              {i18n.edit}
            </Button>
          </WrapperItem>
        </Wrapper>
        <Divider style={{ margin: 0 }} />
        <InfoItem iconType='environment' desc={address} />
        <Divider style={{ margin: 0 }} />
        <InfoItem
          iconType='team'
          label={userResponsible}
          desc={phoneResponsible}
          title={i18n.userResponsible}
        />
        <Divider style={{ margin: 0 }} />
        <InfoItem
          iconType='user'
          label={userSupervisor}
          desc={phoneSupervisor}
          title={i18n.userSupervisor}
        />
        <Divider style={{ margin: 0 }} />
        <InfoItem iconType='global' label={website} title={i18n.website} />
        <Divider style={{ margin: 0 }} />
        <InfoItem title={i18n.career} label={career} />
        <InfoItem title={i18n.yearOperate} label={yearOperate} />
        <InfoItem title={i18n.capacity} label={capacity} />
        <InfoItem title={i18n.processProdution} label={processProdution} />
      </Drawer>
    );
  }
}
