import React from 'react'
import styled from 'styled-components'
import ListItem from "../camera-list/list-item"
import { Button } from 'antd'
import * as _ from 'lodash'

const WrapperContainer = styled.div`
  justify-content: center;
`

export default class CameraList extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      size: 5,
      cameraList: props.cameraList
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.cameraList !== nextProps.cameraList) {
      this.setState({ cameraList: nextProps.cameraList })
    }
  }

  handleCamera = camera => {
    if (this.props.onItemClick) {
      this.props.onItemClick(camera)
    }
  }

  handleLoadMore = () => {
    this.setState(state => ({
      size: state.size + 5
    }));
  }

  getData = () => {
    return _.clone(this.state.cameraList).slice(0, this.state.size)
  }

  render () {
    return (
      <WrapperContainer>
        {
          this.getData().map((camera, inx) => <ListItem key={`${inx}`} camera={camera} onCameraClick={this.handleCamera}/>)
        }
        {
          this.state.cameraList.length > 10 ? <Button onClick={this.handleLoadMore}>Load more</Button> : ` `
        }
      </WrapperContainer>
    )
  }
}