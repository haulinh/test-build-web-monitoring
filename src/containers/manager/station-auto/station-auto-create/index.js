import React from "react"
import styled from "styled-components"
import PageContainer from "layout/default-sidebar-layout/PageContainer"
import { message, Modal, Button, Typography, Skeleton } from "antd"
import { autobind } from "core-decorators"
import StationAutoApi from "api/StationAuto"
import slug from "constants/slug"
import StationAutoForm from "../station-auto-form"
import Breadcrumb from "../breadcrumb"
import ROLE from "constants/role"
import protectRole from "hoc/protect-role"
import { connect } from "react-redux"
import * as _ from "lodash"
import { SHAPE } from "themes/color"
import { EMAIL, PHONE } from "constants/info-contact.js"
import { translate } from "hoc/create-lang"

const ModalContent = styled.div`
  width: fit-content;
  text-align: left;
  line-height: 2rem;
  padding-left: 16px;
  .modal--content--text__padding {
    float: left;
    width: 200px;
  }
`

const { Text } = Typography

const i18n = {
  title: translate("stationAutoManager.create.modal.title"),
  back: translate("stationAutoManager.create.modal.back"),
  text: translate("stationAutoManager.create.modal.text"),
  text1: translate("stationAutoManager.create.modal.text1"),
  text2: translate("stationAutoManager.create.modal.text2"),
  text3: translate("stationAutoManager.create.modal.text3")
}

@protectRole(ROLE.STATION_AUTO.CREATE)
@connect(state => ({
  totalStation: _.get(
    state,
    "auth.userInfo.organization.license.totalStation",
    0
  ),
  totalStationActived: _.get(state, "stationAuto.totalStationActived", 0)
}))
@autobind
export default class StationAutoCreate extends React.PureComponent {
  state = {
    isLicense: false
  }

  async handleSubmit(data) {
    const res = await StationAutoApi.createStationAuto(data)
    if (res.success) {
      message.info("Add measuring success!")
      this.props.history.push(slug.stationAuto.list)
    }
  }

  componentDidMount = () => {
    this.checkLicenseStation()
  }

  componentDidUpdate = prevProps => {
    if (this.props.totalStationActived !== prevProps.totalStationActived) {
      this.checkLicenseStation()
    }
  }

  checkLicenseStation = () => {
    const { totalStation, totalStationActived } = this.props
    if (totalStationActived >= totalStation) {
      this.setState({
        isLicense: true
      })
    }
  }

  hanldeClose = () => {
    this.props.history.push(slug.stationAuto.list)
  }

  render() {
    // console.log(this.props.totalStationActived, "totalStationActived")
    return (
      <PageContainer {...this.props.wrapperProps}>
        <Breadcrumb items={["list", "create"]} />
        {!this.state.isLicense && (
          <StationAutoForm onSubmit={this.handleSubmit} />
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
          <Text type="secondary">{i18n.text}</Text>
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
    )
  }
}
