import React, { Component } from "react";
import Page from "@atlaskit/page";
import SidebarNavigation from "./SidebarNavigation";
import createProtectedAuth from "hoc/protected-auth";
import styled from "styled-components";
import { connectAutoDispatch } from "redux/connect";
import { withRouter } from 'react-router-dom'
import { toggleNavigation } from "redux/actions/themeAction";
import { updateNotificationOnMessage } from "redux/actions/notification";
import { getTotalByNotificationType } from "redux/actions/stationAuto";
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
  { toggleNavigation, updateNotificationOnMessage, getTotalByNotificationType }
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
      console.log('------', payload)
      const {data, notification} = payload

      let description = ''
      switch(data.type) {
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

      this._showNotification(notification.title, description)
      this.props.updateNotificationOnMessage(payload)
    });
   
    //  navigator.serviceWorker.addEventListener("message", message =>{
    //    // NOTE  NOTIFICATION_MESSAGE khi có noti thì sẽ chạy đoạn code trong đây
    //   console.log('message noti',message)
    // });
  }

  state = {
    navigationWidth: 320
  };

  _showNotification(title, description) {
    notification['info']({
      message: title,
      description: description,
      onClick: () => {
        const formSearch = {
          stationType: 'WASTE_WATER',
          stationAuto: 'CONGTONMPM1',
          measuringList: 'FLOW',
          searchNow: true
        }
        this.props.history.push(
          slug.dataSearch.base +
            '?formData=' +
            encodeURIComponent(JSON.stringify(formSearch))
        )
      },
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
