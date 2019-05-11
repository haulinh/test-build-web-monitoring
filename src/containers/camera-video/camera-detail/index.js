import React from 'react'
import { Card } from 'antd'
import ListView from './list-camera'
import Player from '../player-view'
import styled from 'styled-components'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'
import { getAuthToken } from 'api/CameraApi'
import { Spin } from 'antd'
import swal from 'sweetalert2'

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
`

const Left = styled.div`
  flex: 3;
  padding-right: 20px;
`

const Right = styled.div`
  flex: 1;
`

const Empty = styled.div``

export default class PlayerViewer extends React.Component {
  state = {
    cameraList: [],
    camera: {},
    isLoaded: false,
    auth: ''
  }

  async componentDidMount() {
    const auth = await getAuthToken()
    if (!auth) {
      swal({
        title: 'Unauthorized Camera fail',
        type: 'error'
      })
    }

    console.log(this.props.match.params.name)
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

    this.setState({ cameraList, auth: auth, isLoaded: true })
  }

  handleCamera = camera => {
    this.setState({ camera })
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list']} />
        <Container>
          {/* <Left>
            <Card
              cover={
                this.state.camera.src ? (
                  <Player src={this.state.camera.src + 'auth=' + this.props.auth} />
                ) : (
                  <Empty />
                )
              }
            >
              <Card.Meta
                title={this.state.camera.name || ' '}
                description={this.state.camera.stationName || ' '}
              />
            </Card>
          </Left> */}
          {!this.state.isLoaded && (
            <SpinnerContainer>
              <Spin size="large" loading={!this.state.isLoaded} />
            </SpinnerContainer>
          )}

          {this.state.isLoaded && (
            <Right>
              <ListView
                auth={this.props.auth}
                cameraList={this.state.cameraList}
                onItemClick={this.handleCamera}
              />
            </Right>
          )}
        </Container>
      </PageContainer>
    )
  }
}
