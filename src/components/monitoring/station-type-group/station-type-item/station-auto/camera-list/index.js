import React, { PureComponent } from 'react'
// import { message } from 'antd'
import { autobind } from 'core-decorators'
// import { withRouter } from 'react-router-dom'
// import PageContainer from 'layout/default-sidebar-layout/PageContainer'
// import StationAutoApi from 'api/StationAuto'
import styled from 'styled-components'
// import Clearfix from 'components/elements/clearfix'
import CameraItem from './CameraItem'
import { getAuthToken } from "api/CameraApi";
import { Spin } from "antd";
import swal from 'sweetalert2'


const Wrapper = styled.div`
  margin-top: 8px;
  .ant-collapse {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .ant-collapse-item {
    width: 50%;
  }
  .ant-collapse-header {
    text-align: center;
  }
`

const WrapperItem = styled.div`
  width: ${props => (props.isFullWidth ? '100%' : '50%')};
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
`;

@autobind
export default class CameraForm extends PureComponent {
  state={
    isLoaded: false
  }

  async componentDidMount(){
       //todo
       const auth = await getAuthToken();
       if (!auth) {
         swal({
           title: "Unauthorized Camera fail",
           type: 'error'
         })
       }
       this.setState({  auth: auth, isLoaded: true });
  }

  renderPanel(item, index) {
    // const isFullWidth =
    //   this.props.cameraList.length % 2 === 1 &&
    //   index === this.props.cameraList.length - 1
    return (
      <WrapperItem key={item.name} isFullWidth={false}>
        <CameraItem auth={this.state.auth} {...item} index={index} />
      </WrapperItem>
    )
  }

  render() {
    return (
      <Wrapper>
          {!this.state.isLoaded && (
            <SpinnerContainer>
              <Spin size="large" loading={!this.state.isLoaded} />
            </SpinnerContainer>
          )}

        {this.state.isLoaded && this.props.cameraList.map((item, index) => {
          return this.renderPanel(item, index)
        })}
      </Wrapper>
    )
  }
}
