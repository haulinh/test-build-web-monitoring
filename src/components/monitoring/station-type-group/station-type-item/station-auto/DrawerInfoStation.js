import { Drawer, Button } from "antd";
import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import slug from "constants/slug";

export default function DrawerInfoStation({
  onClose,
  visibleDrawer,
  data,
  _id,
}) {
  console.log("data", data);
  const {
    address,
    userResponsible,
    phoneResponsible,
    userSupervisor,
    phoneSupervisor,
    website,
    career,
  } = data || {};
  return (
    <Drawer
      width={480}
      title="Thông tin trạm"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visibleDrawer}
    >
      <Link target="_blank" to={slug.stationAuto.editWithKey + "/" + _id}>
        Link
      </Link>
      <Row>
        <Col span={24}>{address}</Col>
      </Row>
      <Row>
        <Col span={12}>User Responsible</Col>
        <Col span={12}>
          <Row>
            <p>{userResponsible}</p>
            <p>{phoneResponsible}</p>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={12}>User Supervisor</Col>
        <Col span={12}>
          <Row>
            <p>{userSupervisor}</p>
            <p>{phoneSupervisor}</p>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>Website</Col>
      </Row>
      <Row>
        <Col span={24}>{website}</Col>
      </Row>
      <Row>
        <Col span={24}>Career</Col>
      </Row>
      <Row>
        <Col span={24}>{career}</Col>
      </Row>
    </Drawer>
  );
}
