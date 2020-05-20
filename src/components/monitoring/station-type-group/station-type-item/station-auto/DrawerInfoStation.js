import React from "react";
import { Row, Col, Drawer, Button, Icon, Divider } from "antd";
import slug from "constants/slug";
import styled from 'styled-components'
import { translate } from "hoc/create-lang";
import { getStationAuto } from "api/StationAuto";

const i18n = {
  title: translate("stationAutoManager.infoStation.title"),
  edit: translate("stationAutoManager.infoStation.edit"),
  career: translate("stationAutoManager.infoStation.career"),
};

const TextColor = styled.p`
  font-size: 20px;
  color: #1890ff;
`

const Text = styled.p`
  font-size: 20px;
`

const Title = styled.h4`
`

const defaultChartType = "hours";

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
    const { onClose, visibleDrawer, _id } = this.props
    const {
      address,
      userResponsible,
      phoneResponsible,
      userSupervisor,
      phoneSupervisor,
      website,
      career,
    } = this.state.InfoStationData
    return (
      <Drawer
        width={480}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visibleDrawer}
      >
        <Row>
          <Col span={8} ><Title>{i18n.title}</Title></Col>
          <Col span={8} offset={8}><Button target="_blank" href={slug.stationAuto.editWithKey + "/" + _id}><Icon style={{ fontSize: '16px', color: '#1890ff' }} type='edit' theme='outlined' />{i18n.edit}</Button></Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        <Row>
          <Col span={6}><Icon style={{ fontSize: '26px', color: '#1890ff' }} type='environment' theme='outlined' /></Col>
          <Col span={18}><TextColor>{address}</TextColor></Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        <Row>
          <Col span={6}><Icon style={{ fontSize: '26px', color: '#1890ff' }} type='team' theme='outlined' /></Col>
          <Col span={18}>
            <Row>
              <Text>{userResponsible}</Text>
              <TextColor>{phoneResponsible}</TextColor>
            </Row>
          </Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        <Row>
          <Col span={6}><Icon style={{ fontSize: '26px', color: '#1890ff' }} type='user' theme='outlined' /></Col>
          <Col span={18}>
            <Row>
              <Text>{userSupervisor}</Text>
              <TextColor>{phoneSupervisor}</TextColor>
            </Row>
          </Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        <Row>
          <Col span={6}><Icon style={{ fontSize: '26px', color: '#1890ff' }} type='global' theme='outlined' /></Col>
          <Col span={18}><Text>{website}</Text></Col>
        </Row>
        <Divider style={{ margin: 0 }} />
        <Row>
          <Col span={24}><Text>{i18n.career}</Text></Col>
        </Row>
        <Row>
          <Col span={24}><Text>{career}</Text></Col>
        </Row>
      </Drawer>
    );
  }
}
