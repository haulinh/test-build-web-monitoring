import React from "react";
import styled from "styled-components";
import PageContainer from "layout/default-sidebar-layout/PageContainer";
import Breadcrumb from "../breadcrumb";
import ListItem from "./list-item";
import StationAutoApi from "api/StationAuto";
import { getAuthToken } from "api/CameraApi";
import { Spin } from "antd";
import * as _ from "lodash";
import swal from 'sweetalert2'

const WrapperContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
`;

export default class CameraList extends React.Component {
  state = {
    isLoaded: false,
    cameraList: [],
    auth: ''
  };

  handleCamera = e => {};

  async componentDidMount() {
    //todo
    const auth = await getAuthToken();
    if (!auth) {
      swal({
        title: "Unauthorized Camera fail",
        type: 'error'
      })
    }
    // console.log('auththththt',auth)
    const rs = await StationAutoApi.getCamera();
    let cameraList = [];
    _.forEach(rs.data || [], ({ _id, key, name, stationType, options }) => {
      cameraList = cameraList.concat(
        _.map(_.get(options, "camera.list", []), item => ({
          key,
          stationName: name,
          stationType,
          src: item.rtspUrl,
          name: item.name,
          _id
        }))
      );
    });
    this.setState({ cameraList, auth: auth, isLoaded: true });
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={["list"]} />
        <WrapperContainer>
          {!this.state.isLoaded && (
            <SpinnerContainer>
              <Spin size="large" loading={!this.state.isLoaded} />
            </SpinnerContainer>
          )}

          {this.state.isLoaded && this.state.cameraList.map((camera, inx) => (
            <ListItem
              auth={this.state.auth}
              key={`${inx}`}
              camera={camera}
              onCameraClick={this.handleCamera}
            />
          ))}
        </WrapperContainer>
      </PageContainer>
    );
  }
}
