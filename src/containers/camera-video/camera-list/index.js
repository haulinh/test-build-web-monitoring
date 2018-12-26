import React from 'react'
import styled from 'styled-components'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import ListItem from './list-item'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'

const WrapperContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`

export default class CameraList extends React.Component {
  state = {
    cameraList: []
  }

  handleCamera = e => {}

  async componentDidMount() {
    const rs = await StationAutoApi.getCamera()
    let cameraList = []
    _.forEach(rs.data || [], ({ _id, key, name, stationType, options }) => {
      cameraList = cameraList.concat(
        _.map(_.get(options, 'camera.list', []), item => ({
          key,
          stationName: name,
          stationType,
          src: item.rtspUrl,
          name: item.name,
          _id
        }))
      )
    })
    this.setState({ cameraList })
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list']} />
        <WrapperContainer>
          {this.state.cameraList.map((camera, inx) => (
            <ListItem
              key={`${inx}`}
              camera={camera}
              onCameraClick={this.handleCamera}
            />
          ))}
        </WrapperContainer>
      </PageContainer>
    )
  }
}
