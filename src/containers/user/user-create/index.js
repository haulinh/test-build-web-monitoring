import React from "react";
import styled from "styled-components";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import { message, Modal, Button, Typography, Skeleton } from "antd";
import { autobind } from "core-decorators";
import UserApi from "api/UserApi";
import slug from "constants/slug";
import UserForm from "../user-form";
import Breadcrumb from "../breadcrumb";
import ROLE from "constants/role";
import protectRole from "hoc/protect-role";
import { connect } from "react-redux";
import * as _ from "lodash";
import { translate } from "hoc/create-lang";
import { SHAPE } from "themes/color";
import { EMAIL, PHONE } from "constants/info-contact.js";


const { Text } = Typography;

const ModalContent = styled.div`
  width: fit-content;
  text-align: left;
  line-height: 2rem;
  padding-left: 16px;
  .modal--content--text__padding {
    float: left;
    width: 200px;
  }
`;

const i18n = {
  title: translate("userManager.modal.title"),
  back: translate("userManager.modal.back"),
  text: translate("userManager.modal.text"),
  text1: translate("userManager.modal.text1"),
  text2: translate("userManager.modal.text2"),
  text3: translate("userManager.modal.text3")
};

@protectRole(ROLE.USER.CREATE)
@connect(state => ({
  totalUser: _.get(state, "auth.userInfo.organization.license.totalUser", 0)
}))
@autobind
export default class UserCreate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  async handleSubmit(data) {
    this.setState({
      isLoading: true,
      totalUserActive: 0,
      isLicense: false
    });

    const res = await UserApi.registerUser(data);
    if (res.success) {
      message.info("Register User success!");
      this.props.history.push(slug.user.list);
    }
    if (res.error) message.info(res.message);
  }

  componentDidMount = async () => {
    const res = await UserApi.getTotalCount();
    if (res.success) {
      this.setState(
        {
          totalUserActive: _.get(res, "data", 0)
        },
        () => {
          this.checkLicenseStation();
        }
      );
    }
  };

  // componentDidUpdate = prevProps => {
  //   if (this.props.totalStationActived !== prevProps.totalStationActived) {
  //     this.checkLicenseStation();
  //   }
  // };

  checkLicenseStation = () => {
    const { totalUser } = this.props;
    const { totalUserActive } = this.state;
    if (totalUserActive >= totalUser) {
      this.setState({
        isLicense: true
      });
    }
  };

  hanldeClose = () => {
    this.props.history.push(slug.stationAuto.list);
  };

  render() {
    console.log(this.props.totalUser, "----totalUser-----");
    const limitTotalStation = _.get(this.props, "totalUser", 0);

    return (
      <PageContainer title="Create station type" {...this.props.wrapperProps}>
        <Breadcrumb items={["list", "create"]} />
        {!this.state.isLicense && (
          <UserForm
            onSubmit={this.handleSubmit}
            isLoading={this.state.isLoading}
          />
        )}

        {this.state.isLicense && <Skeleton />}

        <Modal
          closable={false}
          title={i18n.title}
          visible={this.state.isLicense}
          onCancel={this.hanldeClose}
          footer={[
            <Button key="back" type="primary" onClick={this.hanldeClose}>
              {i18n.back}
            </Button>
          ]}
        >
          <Text type="secondary" >
            <div
              dangerouslySetInnerHTML={{
                __html: translate("userManager.modal.text", {
                  total: limitTotalStation
                })
              }}
            />
          </Text>
          <br />
          <br />
          <br />
          <ModalContent className="modal--content">
            <Text
              style={{
                color: SHAPE.PRIMARY,
                fontWeight: "bold"
              }}
            >
              {i18n.text1}
            </Text>
            <br />
            <Text className="modal--content--text__padding" strong>
              {i18n.text2}
            </Text>
            <Text
              style={{
                color: SHAPE.PRIMARY
              }}
            >
              {PHONE}
            </Text>
            <br />
            <Text className="modal--content--text__padding" strong>
              {i18n.text3}
            </Text>
            <Text
              style={{
                color: SHAPE.PRIMARY
              }}
            >
              {EMAIL}
            </Text>
          </ModalContent>
        </Modal>
      </PageContainer>
    );
  }
}
