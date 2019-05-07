import React, { Component } from "react";
import Page from "@atlaskit/page";
import SidebarNavigation from "./SidebarNavigation";
import createProtectedAuth from "hoc/protected-auth";
import styled from "styled-components";
import { connectAutoDispatch } from "redux/connect";
import { toggleNavigation } from "redux/actions/themeAction";
import { autobind } from "core-decorators";
import { linkToken2Email } from 'api/NotificationApi'

const Wrapper = styled.div`
  .zJwEi {
    min-height: 100vh;
  }
`;

@createProtectedAuth
@connectAutoDispatch(
  state => ({
    navigationIsOpen: state.theme.navigation.isOpen
  }),
  { toggleNavigation }
)
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
          console.log('linkToken2Email respon', response)
        }catch(e){
          console.log('error linkToken2Email',  e)
        }

      })
      .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
      });
    
   
    navigator.serviceWorker.addEventListener("message", message =>{
       // NOTE  NOTIFICATION_MESSAGE khi có noti thì sẽ chạy đoạn code trong đây
      console.log('message noti',message)
    }
    );
  }

  state = {
    navigationWidth: 320
  };

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
