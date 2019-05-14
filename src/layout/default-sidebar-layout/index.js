import React, { Component } from "react";
import Page from "@atlaskit/page";
import SidebarNavigation from "./SidebarNavigation";
import createProtectedAuth from "hoc/protected-auth";
import styled from "styled-components";
import { connectAutoDispatch } from "redux/connect";
import { withRouter } from 'react-router-dom'
import { toggleNavigation } from "redux/actions/themeAction";
import { updateNotificationOnMessage } from "redux/actions/notification";
import { autobind } from "core-decorators";
import { linkToken2Email } from 'api/NotificationApi'
import { notification } from 'antd'
import { TAB_KEYS } from 'constants/notification'
import slug from 'constants/slug'
import _ from 'lodash'

const Wrapper = styled.div`
  .zJwEi {
    min-height: 100vh;
  }
`;

@createProtectedAuth
@connectAutoDispatch(
  state => ({
    state,
    navigationIsOpen: state.theme.navigation.isOpen,
    stationAuto: state.stationAuto.list
  }),
  { toggleNavigation, updateNotificationOnMessage }
)
@withRouter
@autobind
export default class PageWrapper extends Component {
  componentDidMount() {
    // import { messaging } from "utils/init-fcm";
    // MARK  vì phải chờ app.json nen phải load o day
    
    const {messaging} = require('utils/init-fcm')
    // NOTE  request permission Noti và đăng ký sự kiện 'message' với serviceWorker
    messaging
      .requestPermission()
      .then(async function() {
        const token = await messaging.getToken();
        // NOTE  sau khi get đuợc token, sẽ cần báo cho back-end bik, token này link với email:user nào
        try{
          let response = await linkToken2Email(token)
          console.log('linkToken2Email respon',  token ,response)
        }catch(e){
          console.log('error linkToken2Email',  e)
        }

      })
      .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
      });
    
    messaging.onMessage((payload) => {
      this._showNotification(payload)

      /* note: format data de tuong thich code */
      payload.createdAt  = Number(payload.data.createdAt)
      payload.dataFilter = payload.data.dataFilter.split(";")
      payload.full_body  = payload.data.full_body
      this.props.updateNotificationOnMessage(payload, this.props.stationAuto)
    });
   
    //  navigator.serviceWorker.addEventListener("message", message =>{
    //    // NOTE  NOTIFICATION_MESSAGE khi có noti thì sẽ chạy đoạn code trong đây
    //   console.log('message noti',message)
    // });
  }

  state = {
    navigationWidth: 320
  };

  _showNotification(payload) {
    let stationInfo = _.find(this.props.stationAuto, {_id: payload.data.station_id})
    let description = ''
    switch(payload.data.type) {
      case TAB_KEYS.EXCEEDED: {
        description = 'Thông báo vượt ngưỡng' /* MARK  @translate */
        break;
      }
      case TAB_KEYS.LOST_SIGNAL: {
        description = 'Thông báo mất dữ liệu' /* MARK  @translate */
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        description = 'Thông báo trạng thái thiết bị' /* MARK  @translate */
        break;
      }
    }

    notification['info']({
      message: stationInfo.name,
      description: description,
    });
  }

  getNavigation() {
    return {
      width: this.state.navigationWidth,
      isOpen: this.props.navigationIsOpen
    };
  }

  handleResizeNavigation({ isOpen, width }) {
    this.props.toggleNavigation(isOpen);
    this.setState({
      navigationWidth: width
    });
  }

  render() {
    return (
      <Wrapper>
        <Page
          navigation={
            <SidebarNavigation
              onChangeSize={this.handleResizeNavigation}
              navigation={this.getNavigation()}
            />
          }
        >
          <div>{this.props.children}</div>
        </Page>
      </Wrapper>
    );
  }
}
