import React, { PureComponent } from 'react'
// import { message } from 'antd'
import { autobind } from 'core-decorators'
// import { withRouter } from 'react-router-dom'
// import PageContainer from 'layout/default-sidebar-layout/PageContainer'
// import StationAutoApi from 'api/StationAuto'
import styled from 'styled-components'
// import Clearfix from 'components/elements/clearfix'
import CameraItem from './CameraItem'

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

@autobind
export default class CameraForm extends PureComponent {
  renderPanel(item, index) {
    // const isFullWidth =
    //   this.props.cameraList.length % 2 === 1 &&
    //   index === this.props.cameraList.length - 1
    return (
      <WrapperItem key={item.name} isFullWidth={false}>
        <CameraItem {...item} index={index} />
      </WrapperItem>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.props.cameraList.map((item, index) => {
          return this.renderPanel(item, index)
        })}
      </Wrapper>
    )
  }
}
