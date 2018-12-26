import React from 'react'
import { Card } from 'antd'
import ListView from './list-camera'
import Player from '../player-view'
import styled from 'styled-components'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Breadcrumb from '../breadcrumb'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'

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
    camera: {}
  }

  async componentDidMount() {
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

    this.setState({ cameraList })
  }

  handleCamera = camera => {
    this.setState({ camera })
  }

  render() {
    return (
      <PageContainer>
        <Breadcrumb items={['list']} />
        <Container>
          <Left>
            <Card
              cover={
                this.state.camera.src ? (
                  <Player src={this.state.camera.src} />
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
          </Left>
          <Right>
            <ListView
              cameraList={this.state.cameraList}
              onItemClick={this.handleCamera}
            />
          </Right>
        </Container>
      </PageContainer>
    )
  }
}
